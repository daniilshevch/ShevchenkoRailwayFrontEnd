import {Button, Form, Input, message, Popconfirm, Select, Switch, Table} from "antd";
import React, {useState} from "react";
import {stationTitleIntoUkrainian} from "../../../InterpreterDictionaries/StationsDictionary.js";
import {enumOptions, enumOptionsForStrings} from "../GeneralComponents/EnumOptionConvertion.jsx";
import {RAILWAY_BRANCH_OPTIONS} from "../AdminTrainRoutesList/AdminTrainRoutesEnums.js";
import {TRAIN_STOP_TYPE_OPTIONS} from "./AdminTrainStopsEnums.js";
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
function AdminTrainStopsTable({trainStops, fetchTrainStops})
{
    const [messageApi, contextHolder] = message.useMessage();
    const [updateForm] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const isEdited = (record) => record.station_title === editingKey;

    const update = (record) => {
        updateForm.setFieldsValue({ ...record });
        setEditingKey(record.station_title);
    };

    const cancelUpdate = () => setEditingKey('');

    const saveUpdate = async (station_title, train_route_on_date_id) => {
        try {
            const row = await updateForm.validateFields();
            const updatedTrainStop = { ...trainStops.find(train_stop => train_stop.station_title === station_title), ...row };
            const response = await fetch(`https://localhost:7230/Admin-API/update-train-stop/${train_route_on_date_id}/${station_title}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedTrainStop)
            });
            if (!response.ok) throw new Error('Помилка при оновленні');
            messageApi.success(`Зупинку ${stationTitleIntoUkrainian(station_title)} успішно оновлено`);
            setEditingKey('');
            fetchTrainStops();
        } catch (err) {
            messageApi.error(err.message);
        }
    };
    const handleDelete = async (train_route_on_date_id, station_title) => {
        try {
            const response = await fetch(`https://localhost:7230/Admin-API/delete-train-stop/${train_route_on_date_id}/${station_title}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error("Помилка при видаленні");
            messageApi.success(`Зупинку ${stationTitleIntoUkrainian(station_title)} успішно видалено`)
            fetchTrainStops();
        }
        catch (err) {
            messageApi.error(err.message);
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
            title: 'Тип зупинки',
            dataIndex: 'stop_type',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="stop_type" style={{ margin: 0 }}>
                        <Select>{enumOptions(TRAIN_STOP_TYPE_OPTIONS)}</Select>
                    </Form.Item>
                ) : (
                    TRAIN_STOP_TYPE_OPTIONS[record.stop_type]
                ),
            width: 50,
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
        { //////////////////////CHANGE
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
                            onConfirm={() => handleDelete(record.train_route_on_date_id, record.station_title)}
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
            {contextHolder}
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
        </>
    )
}
export default AdminTrainStopsTable;