import React, { useEffect, useState } from 'react';
import {
    Table,
    Input,
    Select,
    Switch,
    Button,
    Popconfirm,
    Form,
    Modal,
    message,
    DatePicker, AutoComplete
} from 'antd';
import './AdminTrainStopsList.css';
import {stationsList, stationTitleIntoUkrainian} from "../../InterpreterDictionaries/StationsDictionary.js";
import dayjs from 'dayjs';
const { Option } = Select;

const options = stationsList.map((station) => ({value: station.ukrainian, label: station.ukrainian}));
function formatDate(dateTime)
{
    return dateTime.toLocaleString('uk-UA', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
function parseTrainRaceId(trainRaceId) {
    const parts = trainRaceId.split('_');

    if (parts.length !== 4) {
        throw new Error("Невірний формат ідентифікатора рейсу");
    }

    const [trainRouteId, year, month, day] = parts;
    const date = `${year}-${month}-${day}`;

    return {
        trainRouteId,
        date
    };
}

function AdminTrainStopsList({train_race_id}) {
    const [trainStops, setTrainStops] = useState([]);
    const [updateForm] = Form.useForm();
    const [createForm] = Form.useForm();
    const [copyScheduleForm] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isCopyScheduleModalVisible, setIsCopyScheduleModalVisible] = useState(false);
    const isStartStop = Form.useWatch("is_starting_stop", createForm) ?? false;
    const isEndStop = Form.useWatch("is_ending_stop", createForm) ?? false;

    const fetchTrainStops= async () => {
        const res = await fetch(`https://localhost:7230/Admin-API/get-train-stops-for-train-race/${train_race_id}`);
        const data = await res.json();
        setTrainStops(data);
    };

    useEffect(() => {
        fetchTrainStops();
    }, []);
    useEffect(() => {
        if(isStartStop)
        {
            createForm.setFieldsValue({arrival_time: null});
        }
        if(isEndStop)
        {
            createForm.setFieldsValue({departure_time: null});
        }
    })

    const isEdited = (record) => record.station_title === editingKey;

    const update = (record) => {
        updateForm.setFieldsValue({ ...record });
        setEditingKey(record.station_title);
    };

    const cancelUpdate = () => setEditingKey('');

    const saveUpdate = async (station_title, train_route_on_date_id) => {
        try {
            const row = await updateForm.validateFields();
            const updatedTrainStop = { ...trainStops.find((r) => r.station_title === station_title), ...row };
            const response = await fetch(`https://localhost:7230/Admin-API/update-train-stop/${train_route_on_date_id}/${station_title}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedTrainStop)
            });
            if (!response.ok) throw new Error('Помилка при оновленні');
            message.success('Оновлено');
            setEditingKey('');
            fetchTrainStops();
        } catch (err) {
            console.error(err);
            message.error('Помилка при збереженні');
        }
    };

    const handleCreate = async () => {
        try {
            let values = await createForm.validateFields();
            console.log(values.arrival_time);
            console.log(values.departure_time);
            const toLocalTimeFormat = (time) => {
              if(time == null)
              {
                  return null;
              }
              else
              {
                  return time.format("YYYY-MM-DDTHH:mm:ss")
              }
            };
            let stationTitle = stationsList.find(station => station.ukrainian === values.station_title)?.english;
            const payload = {
                ...values,
                train_route_on_date_id: train_race_id,
                station_title: stationTitle,
                arrival_time: toLocalTimeFormat(values.arrival_time),
                departure_time: toLocalTimeFormat(values.departure_time),
                stop_type: 0,
            };
            const response = await fetch(`https://localhost:7230/Admin-API/add-train-stop-for-train-race`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            console.log(JSON.stringify(payload));

            if (!response.ok) throw new Error('Помилка при створенні рейсу');

            message.success('Рейс створено');
            setIsCreateModalVisible(false);
            createForm.resetFields();
            fetchTrainStops();
        } catch (err) {
            console.error(err);
            message.error('Не вдалося створити маршрут');
        }
    };
    const handleDelete = async (train_route_on_date_id, station_title) => {
        try {
            const response = await fetch(`https://localhost:7230/Admin-API/delete-train-stop/${train_race_id}/${station_title}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error("Помилка при видаленні");
            fetchTrainStops();
        }
        catch (err) {
            console.error(err);
            message.error("Не вдалося видалити маршрут");
        }
    }
    const handleScheduleCopy = async () =>
    {
        try
        {
            let values = await copyScheduleForm.validateFields();
            const prototype_train_route_id = values.prototype_train_route_id;
            const new_train_route_id = parseTrainRaceId(train_race_id).trainRouteId;
            const prototype_date = values.prototype_date.format("YYYY-MM-DD");
            const new_date = parseTrainRaceId(train_race_id).date;
            const response = await fetch(`https://localhost:7230/Admin-API/TrainAssignment/Copy-Train-With-Schedule?prototype_train_route_id=${prototype_train_route_id}&new_train_route_id=${new_train_route_id}&prototype_date=${prototype_date}&new_date=${new_date}&creation_option=false`,
                {
                    method: 'POST'
                });
            if (!response.ok) throw new Error('Помилка при копіюванні складу поїзду');

            message.success('Склад поїзда скопійовано');
            setIsCopyScheduleModalVisible(false);
            copyScheduleForm.resetFields();
            fetchTrainStops();
        }
        catch(err)
        {
            console.error(err);
            message.error('Не вдалося скопіювати склад');
        }
    }


    const columns = [
        {
            title: 'Назва станції',
            dataIndex: 'station_title',
            render: (_, record) => (
                stationTitleIntoUkrainian(record.station_title)
            )
        },
        {
            title: 'ID рейсу',
            dataIndex: 'train_route_on_date_id',
        },
        {
            title: 'Час прибуття',
            dataIndex: 'arrival_time',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="arrival_time" style={{ margin: 0 }}>
                        <Input />
                    </Form.Item>
                ) : (
                    record.arrival_time ? formatDate(new Date(record.arrival_time)) : "✖️"
                ),

        },
        {
            title: 'Час відправлення',
            dataIndex: 'departure_time',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="departure_time" style={{ margin: 0 }}>
                        <Input />
                    </Form.Item>
                ) : record.departure_time ? formatDate(new Date(record.departure_time)) : "✖️"
        },
        {
            title: 'Тривалість зупинки',
            dataIndex: 'stop_duration',
            render: (_, record) => (record.departure_time != undefined && record.arrival_time != undefined) ?
                `${(new Date(record.departure_time) - new Date(record.arrival_time))/ 60000} хв` : "✖️"
        },
        {
            title: "Тип зупинки",
            dataIndex: "stop_type",
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="factual_wi_fi" valuePropName="checked" style={{ margin: 0 }}>
                        <Switch />
                    </Form.Item>
                ) : record.factual_wi_fi ? (
                    '✅'
                ) : (
                    '❌'
                ),
        },
        {
            title: "Відстань від початкової станції",
            dataIndex: "distance_from_starting_station",
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="distance_from_starting_station" style={{ margin: 0 }}>
                        <Input />
                    </Form.Item>
                ) : record.distance_from_starting_station,
            width: 100
        },
        {
            title: "Швидкість на перегоні",
            dataIndex: "speed_on_section",
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="speed_on_section" valuePropName="checked" style={{ margin: 0 }}>
                        <Input />
                    </Form.Item>
                ) : record.speed_on_section
        },
        {
            title: 'Дії',
            dataIndex: 'actions',
            render: (_, record) =>
                isEdited(record) ? (
                    <>
                        <Popconfirm
                            title="Підтвердити збереження?"
                            onConfirm={() => saveUpdate(record.station_title, record.train_route_on_date_id)}
                            okText="Так"
                            cancelText="Ні"
                        >
                            <Button type="link">Зберегти</Button>
                        </Popconfirm>
                        <Popconfirm
                            title="Скасувати зміни?"
                            onConfirm={cancelUpdate}
                            okText="Так"
                            cancelText="Ні"
                        >
                            <Button type="link">Скасувати</Button>
                        </Popconfirm>
                    </>
                ) : (
                    <>
                        <Button disabled={editingKey !== ''} onClick={() => {
                            update(record);
                        }} type="link">
                            Редагувати
                        </Button>
                        <Popconfirm
                            title="Ви впевнені, що хочете видалити цю станцію?"
                            onConfirm={() => handleDelete(train_race_id, record.station_title)}
                            okText="Так"
                            cancelText="Ні"
                        >
                            <Button type="link" danger>
                                Видалити
                            </Button>
                        </Popconfirm>
                    </>
                ),
        },
    ];

    return (
        <>
            <div className="create-button-wrapper">
                <Button type="primary" className = "create-train-stop-button" onClick={() => setIsCreateModalVisible(true)} style={{ marginBottom: 16 }}>
                    + Додати зупинку в розклад
                </Button>
            </div>
            <div className="create-button-wrapper">
                <Button className="copy-schedule-button" type="primary" onClick={() => setIsCopyScheduleModalVisible(true)} style={{ marginBottom: 16 }}>
                    + Скопіювати розклад поїзда з прототипу
                </Button>
            </div>

            <Form form={updateForm} component={false}>
                <Table
                    dataSource={trainStops}
                    columns={columns}
                    rowKey="station_title"
                    bordered
                    pagination={false}
                    components={{
                        body: {
                            cell: ({ children }) => <td>{children}</td>,
                        },
                    }}
                    rowClassName={(_, index) => (index % 2 === 0 ? 'light-blue-row' : 'dark-blue-row')}
                />
            </Form>

            <Modal
                title="Нова зупинка"
                open={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                onOk={handleCreate}
                okText="Створити"
            >
                <Form form={createForm} layout="vertical"
                      initialValues={{
                    arrival_time: dayjs(`${parseTrainRaceId(train_race_id).date} 00:00`, 'YYYY-MM-DD HH:mm'),
                    departure_time: dayjs(`${parseTrainRaceId(train_race_id).date} 00:00`, 'YYYY-MM-DD HH:mm')
                }}>
                    <Form.Item label="Назва зупинки" name="station_title" rules={[{ required: true, message: 'Вкажіть назву зупинки' }]}>
                        <AutoComplete
                            options={options}
                            placeholder="Почніть вводити станцію"
                            filterOption={(inputValue, option) =>
                                option?.value?.toLowerCase().includes(inputValue.toLowerCase())
                            }
                        />
                    </Form.Item>
                    <Form.Item label="Початкова зупинка" name="is_starting_stop" valuePropName="checked">
                        <Switch></Switch>
                    </Form.Item>
                    <Form.Item label="Час прибуття" name="arrival_time">
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm"
                            valueFormat="YYYY-MM-DDTHH:mm:ss"
                            style={{ width: "100%" }}
                            disabled={isStartStop}
                        />
                    </Form.Item>
                    <Form.Item label="Кінцева зупинка" name="is_ending_stop" valuePropName="checked">
                        <Switch></Switch>
                    </Form.Item>
                    <Form.Item label="Час відправлення" name="departure_time">
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm"
                            valueFormat="YYYY-MM-DDTHH:mm:ss"
                            style={{ width: "100%" }}
                            disabled={isEndStop}
                        />
                    </Form.Item>
                    <Form.Item label="Відстань від початкової станції" name="distance_from_starting_station">
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item label="Швидкість на перегоні" name="speed_on_section">
                        <Input type="number" />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Копіювання розкладу з прототипу"
                open={isCopyScheduleModalVisible}
                onCancel={() => setIsCopyScheduleModalVisible(false)}
                onOk={handleScheduleCopy}
                okText="Скопіювати склад"
            >
                <Form form={copyScheduleForm} layout="vertical">
                    <Form.Item label="ID маршруту-прототипу" name="prototype_train_route_id" rules={[{ required: true, message: 'Вкажіть ID маршруту-прототипу' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Дата відправлення рейсу-прототипу"
                        name="prototype_date"
                        rules={[{ required: true, message: 'Вкажіть дату відправлення рейсу-прототипу' }]}
                    >
                        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default AdminTrainStopsList;
