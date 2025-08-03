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
    DatePicker
} from 'antd';
import './AdminTrainRoutesList.css';
import {stationTitleIntoUkrainian} from "../../InterpreterDictionaries/StationsDictionary.js";

const { Option } = Select;
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

function AdminTrainStopsList({train_race_id}) {
    const [trainStops, setTrainStops] = useState([]);
    const [updateForm] = Form.useForm();
    const [createForm] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);



    const fetchTrainStops= async () => {
        const res = await fetch(`https://localhost:7230/Admin-API/get-train-stops-for-train-race/${train_race_id}`);
        const data = await res.json();
        setTrainStops(data);
    };

    useEffect(() => {
        fetchTrainStops();
    }, []);

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
            const payload = {
                ...values,
                departure_date: values.departure_date.format("YYYY-MM-DD"),
                train_race_coefficient: parseFloat(values.train_race_coefficient),
            };
            const response = await fetch(`https://localhost:7230/Admin-API/add-train-race`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            console.log(JSON.stringify(payload));

            if (!response.ok) throw new Error('Помилка при створенні рейсу');

            message.success('Рейс створено');
            setIsCreateModalVisible(false);
            createForm.resetFields();
            //fetchRaces();
        } catch (err) {
            console.error(err);
            message.error('Не вдалося створити маршрут');
        }
    };
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://localhost:7230/Admin-API/delete-train-race/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error("Помилка при видаленні");
            //fetchRaces();
        }
        catch (err) {
            console.error(err);
            message.error("Не вдалося видалити маршрут");
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
                            onConfirm={() => handleDelete(record.id)}
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
                <Button type="primary" onClick={() => setIsCreateModalVisible(true)} style={{ marginBottom: 16 }}>
                    + Додати вагон в склад
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
                <Form form={createForm} layout="vertical">
                    <Form.Item label="ID маршруту" name="train_route_id" rules={[{ required: true, message: 'Вкажіть ID маршруту' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Дата відправлення"
                        name="departure_date"
                        rules={[{ required: true, message: 'Вкажіть дату відправлення' }]}
                    >
                        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Коефіцієнт рейсу" name="train_race_coefficient">
                        <Input type="number" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default AdminTrainStopsList;
