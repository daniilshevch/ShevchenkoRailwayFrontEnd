import {Button, Form, Input, message, Popconfirm, Select, Switch, Table} from "antd";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {enumOptions, enumOptionsForStrings} from "../../GeneralComponents/EnumOptionConvertion.jsx";
import {
    ASSIGNMENT_TYPE_OPTIONS,
    FREQUENCY_TYPE_OPTIONS,
    RAILWAY_BRANCH_OPTIONS,
    SPEED_TYPE_OPTIONS,
    TRAIN_QUALITY_CLASS_OPTIONS,
    TRIP_TYPE_OPTIONS
} from "./AdminTrainRoutesEnums.js";
import 'antd/dist/reset.css';

function AdminTrainRoutesTable({routes, fetchRoutes})
{
    const [messageApi, contextHolder] = message.useMessage();
    const [updateForm] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchRoutes();
    }, []);

    const isEdited = (record) => record.id === editingKey;
    const update = (record) => {
        updateForm.setFieldsValue({...record});
        setEditingKey(record.id);
    }
    const saveUpdate = async (id) => {
        try {
            const row = await updateForm.validateFields();
            const updatedRoute = { ...routes.find(route => route.id === id), ...row };
            const response = await fetch(`https://localhost:7230/Admin-API/update-train-route/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedRoute),
            });
            if (!response.ok) throw new Error(`Помилка при оновленні`);
            messageApi.success(`Маршрут ${id} успішно оновлено`);
            setEditingKey('');
            fetchRoutes();
        } catch (err) {
            messageApi.error(err.message);
        }
    };
    const cancelUpdate = () => setEditingKey('');

    const handleDelete = async (id) =>
    {
        try
        {
            const response = await fetch(`https://localhost:7230/Admin-API/delete-train-route/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error("Помилка при видаленні");
            messageApi.success(`Маршрут ${id}  успішно видалено`);
            fetchRoutes();
        }
        catch (err)
        {
            console.error(err);
            messageApi.error(err);
        }
    }
    const showTrainRaces = async (train_route_id) =>
    {
        navigate(`/admin/${train_route_id}/train-races-list`);
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 50,
        },
        {
            title: 'Фірмова назва',
            dataIndex: 'branded_name',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="branded_name" style={{ margin: 0 }}>
                        <Input />
                    </Form.Item>
                ) : (
                    record.branded_name
                ),
        },
        {
            title: 'Філія',
            dataIndex: 'railway_branch_title',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="railway_branch_title" style={{ margin: 0 }}>
                        <Select>{enumOptionsForStrings(RAILWAY_BRANCH_OPTIONS)}</Select>
                    </Form.Item>
                ) : (
                    RAILWAY_BRANCH_OPTIONS[record.railway_branch_title]
                ),
            width: 50,
        },
        {
            title: 'Клас',
            dataIndex: 'quality_class',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="quality_class" style={{ margin: 0 }}>
                        <Select>{enumOptions(TRAIN_QUALITY_CLASS_OPTIONS)}</Select>
                    </Form.Item>
                ) : (
                    TRAIN_QUALITY_CLASS_OPTIONS[record.quality_class]
                ),
        },
        {
            title: 'Коефіцієнт маршруту',
            dataIndex: 'train_route_coefficient',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="train_route_coefficient" style={{ margin: 0 }}>
                        <Input type="number" />
                    </Form.Item>
                ) : (
                    record.train_route_coefficient
                ),
            width: 50,
        },
        {
            title: 'Тип подорожі',
            dataIndex: 'trip_type',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="trip_type" style={{ margin: 0 }}>
                        <Select>{enumOptions(TRIP_TYPE_OPTIONS)}</Select>
                    </Form.Item>
                ) : (
                    TRIP_TYPE_OPTIONS[record.trip_type]
                ),
            width: 100,
        },
        {
            title: 'Швидкісний тип',
            dataIndex: 'speed_type',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="speed_type" style={{ margin: 0 }}>
                        <Select>{enumOptions(SPEED_TYPE_OPTIONS)}</Select>
                    </Form.Item>
                ) : (
                    SPEED_TYPE_OPTIONS[record.speed_type]
                ),
            width: 100,
        },
        {
            title: 'Частота курсування',
            dataIndex: 'frequency_type',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="frequency_type" style={{ margin: 0 }}>
                        <Select>{enumOptions(FREQUENCY_TYPE_OPTIONS)}</Select>
                    </Form.Item>
                ) : (
                    FREQUENCY_TYPE_OPTIONS[record.frequency_type]
                ),
            width: 100,
        },
        {
            title: 'Тип призначення',
            dataIndex: 'assignment_type',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="assignment_type" style={{ margin: 0 }}>
                        <Select>{enumOptions(ASSIGNMENT_TYPE_OPTIONS)}</Select>
                    </Form.Item>
                ) : (
                    ASSIGNMENT_TYPE_OPTIONS[record.assignment_type]
                ),
            width: 100,
        },
        {
            title: 'Фірмовий',
            dataIndex: 'is_branded',
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="is_branded" valuePropName="checked" style={{ margin: 0 }}>
                        <Switch />
                    </Form.Item>
                ) : record.is_branded ? (
                    '✅'
                ) : (
                    '❌'
                ),
        },

        {
            title: 'Рейси',
            dataIndex: 'train_races',
            render: (_, record) => (
                <Button onClick={() => showTrainRaces(record.id)} type="link">
                    Переглянути рейси
                </Button>
            ),
            width: 10,
        },
        {
            title: 'Дії',
            dataIndex: 'actions',
            render: (_, record) =>
                isEdited(record) ? (
                    <>
                        <Popconfirm
                            title="Підтвердити збереження?"
                            onConfirm={() => saveUpdate(record.id)}
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
                        <Button disabled={editingKey !== ''} onClick={() => update(record)} type="link">
                            Редагувати
                        </Button>
                        <Popconfirm
                            title="Ви впевнені, що хочете видалити цей маршрут?"
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
            {contextHolder}
            <Form form={updateForm} component={false}>
                <Table
                    dataSource={routes}
                    columns={columns}
                    rowKey="id"
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
export default AdminTrainRoutesTable;