import React, {useState} from "react";
import {Button, Form, Input, message, Popconfirm, Switch, Table} from "antd";
import {CARRIAGE_TYPE_OPTIONS, CARRIAGE_QUALITY_CLASS_OPTIONS, CARRIAGE_MANUFACTURER_OPTIONS} from "./AdminCarriageAssignmentsEnums.js";

function AdminCarriageAssignmentsTable({train_race_id, carriageAssignments, fetchCarriageAssignments})
{
    const [messageApi, contextHolder] = message.useMessage();
    const [updateForm] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const isEdited = (record) => record.passenger_carriage_id === editingKey;

    const update = (record) => {
        updateForm.setFieldsValue({ ...record });
        setEditingKey(record.passenger_carriage_id);
    };

    const cancelUpdate = () => setEditingKey('');

    const saveUpdate = async (passenger_carriage_id, train_route_on_date_id) => {
        try {
            const row = await updateForm.validateFields();
            const updatedCarriageAssignment = { ...carriageAssignments.find(carriage_assignment => carriage_assignment.passenger_carriage_id === passenger_carriage_id), ...row };
            const response = await fetch(`https://localhost:7230/Admin-API/update-carriage-assignment/${train_route_on_date_id}/${passenger_carriage_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedCarriageAssignment)
            });
            if (!response.ok) throw new Error('Помилка при оновленні');
            messageApi.success(` Вагон ${passenger_carriage_id} успішно оновлено`);
            setEditingKey('');
            fetchCarriageAssignments();
        } catch (err) {
            messageApi.error(err.message);
        }
    };
    const handleDelete = async (passenger_carriage_id) => {
        try {
            const response = await fetch(`https://localhost:7230/Admin-API/delete-carriage-assignment/${train_race_id}/${passenger_carriage_id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error("Помилка при видаленні");
            messageApi.success(`Вагон  ${passenger_carriage_id} успішно видалено`);
            fetchCarriageAssignments();
        }
        catch (err) {
            messageApi.error(err.message);
        }
    }

    const columns = [
        {
            title: 'ID вагону',
            dataIndex: 'passenger_carriage_id',
        },
        {
            title: 'ID рейсу',
            dataIndex: 'train_route_on_date_id',
        },
        {
            title: 'Номер в складі',
            dataIndex: 'position_in_squad',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="position_in_squad" style={{ margin: 0 }}>
                        <Input />
                    </Form.Item>
                ) : (
                    record.position_in_squad
                ),
            width: 100,
        },
        {
            title: 'Тип вагону',
            dataIndex: 'passenger_carriage_type',
            render: (_, record) => (
                CARRIAGE_TYPE_OPTIONS[record.passenger_carriage_info.type_of]
            ),
            width: 100,
        },
        {
            title: 'Клас вагону',
            dataIndex: 'passenger_carriage_quality_class',
            render: (_, record) => (
                CARRIAGE_QUALITY_CLASS_OPTIONS[record.passenger_carriage_info.quality_class]
            ),
            width: 100,
        },
        {
            title: 'Для жінок',
            dataIndex: 'is_for_woman',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="is_for_woman" valuePropName="checked" style={{ margin: 0 }}>
                        <Switch />
                    </Form.Item>
                ) : record.is_for_woman ? (
                    '✅'
                ) : (
                    '❌'
                ),
        },
        {
            title: "Для дітей",
            dataIndex: "is_for_children",
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="is_for_children" valuePropName="checked" style={{ margin: 0 }}>
                        <Switch />
                    </Form.Item>
                ) : record.is_for_children ? (
                    '✅'
                ) : (
                    '❌'
                ),
        },
        {
            title: "Wi-Fi",
            dataIndex: "factual_wi_fi",
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
            title: "Кондиціонування",
            dataIndex: "factual_air_conditioning",
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="factual_air_conditioning" valuePropName="checked" style={{ margin: 0 }}>
                        <Switch />
                    </Form.Item>
                ) : record.factual_air_conditioning ? (
                    '✅'
                ) : (
                    '❌'
                ),
        },
        {
            title: "Душ",
            dataIndex: "factual_shower_availability",
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="factual_shower_availability" valuePropName="checked" style={{ margin: 0 }}>
                        <Switch />
                    </Form.Item>
                ) : record.factual_shower_availability ? (
                    '✅'
                ) : (
                    '❌'
                ),
        },
        {
            title: "Інклюзивність",
            dataIndex: "factual_is_inclusive",
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="factual_is_inclusive" valuePropName="checked" style={{ margin: 0 }}>
                        <Switch />
                    </Form.Item>
                ) : record.factual_is_inclusive ? (
                    '✅'
                ) : (
                    '❌'
                ),
        },
        {
            title: "Харчування",
            dataIndex: "food_availability",
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="food_availability" valuePropName="checked" style={{ margin: 0 }}>
                        <Switch />
                    </Form.Item>
                ) : record.food_availability ? (
                    '✅'
                ) : (
                    '❌'
                ),
        },
        {
            title: "Інформація про пасажирів",
            dataIndex: "ticket_bookings_for_passenger_carriage",
            render: (_, record) => (
                <Button onClick={() => {}} type="link">
                    Квитки
                </Button>
            )
        },
        {
            title: 'Дії',
            dataIndex: 'actions',
            render: (_, record) =>
                isEdited(record) ? (
                    <>
                        <Popconfirm
                            title="Підтвердити збереження?"
                            onConfirm={() => saveUpdate(record.passenger_carriage_id, record.train_route_on_date_id)}
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
                            title="Ви впевнені, що хочете видалити цей маршрут?"
                            onConfirm={() => handleDelete(record.passenger_carriage_id)}
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
                    dataSource={carriageAssignments}
                    columns={columns}
                    rowKey="passenger_carriage_id"
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
export default AdminCarriageAssignmentsTable;