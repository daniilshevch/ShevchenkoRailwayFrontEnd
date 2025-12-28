import { Button, Form, Input, message, Popconfirm, Select, Switch, Table, Tag, Typography, Space } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { enumOptions, enumOptionsForStrings } from "../../GeneralComponents/EnumOptionConvertion.jsx";
import {
    ASSIGNMENT_TYPE_OPTIONS,
    FREQUENCY_TYPE_OPTIONS,
    RAILWAY_BRANCH_OPTIONS,
    SPEED_TYPE_OPTIONS,
    TRAIN_QUALITY_CLASS_OPTIONS,
    TRIP_TYPE_OPTIONS
} from "./AdminTrainRoutesEnums.js";
import 'antd/dist/reset.css';
const { Text } = Typography;

function AdminTrainRoutesTable({ routes, fetchRoutes }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [updateForm] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const navigate = useNavigate();

    const isEdited = (record) => record.id === editingKey;

    const saveUpdate = async (id) => {
        try {
            const row = await updateForm.validateFields();
            const token = localStorage.getItem('token');
            const updatedRoute = { ...routes.find(r => r.id === id), ...row };

            const res = await fetch(`https://localhost:7230/Admin-API/update-train-route/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedRoute),
            });

            if (!res.ok) throw new Error("Не вдалося оновити дані");

            messageApi.success(`Маршрут ${id} оновлено`);
            setEditingKey('');
            fetchRoutes();
        } catch (err) {
            messageApi.error(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://localhost:7230/Admin-API/delete-train-route/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Помилка при видаленні");
            messageApi.success("Видалено успішно");
            fetchRoutes();
        } catch (err) {
            messageApi.error(err.message);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            fixed: 'left', // Залишається зліва при скролі
            render: (id) => <Text strong>{id}</Text>
        },
        {
            title: 'Фірмова назва',
            dataIndex: 'branded_name',
            width: 150,
            ellipsis: true, // Додає "..." якщо текст задовгий
            render: (_, record) => isEdited(record) ?
                <Form.Item name="branded_name" style={{ margin: 0 }}><Input /></Form.Item> :
                <Text italic>{record.branded_name || "—"}</Text>
        },
        {
            title: 'Філія',
            dataIndex: 'railway_branch_title',
            width: 180,
            render: (_, record) => isEdited(record) ?
                <Form.Item name="railway_branch_title" style={{ margin: 0 }}><Select>{enumOptionsForStrings(RAILWAY_BRANCH_OPTIONS)}</Select></Form.Item> :
                <Tag color="blue" style={{ borderRadius: '4px' }}>{RAILWAY_BRANCH_OPTIONS[record.railway_branch_title]}</Tag>
        },
        {
            title: 'Клас',
            dataIndex: 'quality_class',
            width: 100,
            render: (_, record) => isEdited(record) ?
                <Form.Item name="quality_class" style={{ margin: 0 }}><Select>{enumOptions(TRAIN_QUALITY_CLASS_OPTIONS)}</Select></Form.Item> :
                <Tag color="purple">{TRAIN_QUALITY_CLASS_OPTIONS[record.quality_class]}</Tag>
        },
        {
            title: 'Коефіцієнт',
            dataIndex: 'train_route_coefficient',
            width: 100,
            render: (_, record) => isEdited(record) ?
                <Form.Item name="train_route_coefficient" style={{ margin: 0 }}><Input type="number" step="0.1"/></Form.Item> :
                <Text code>{record.train_route_coefficient}</Text>
        },
        {
            title: 'Тип подорожі',
            dataIndex: 'trip_type',
            width: 200,
            render: (_, record) => isEdited(record) ?
                <Form.Item name="trip_type" style={{ margin: 0 }}><Select>{enumOptions(TRIP_TYPE_OPTIONS)}</Select></Form.Item> :
                <Text style={{ fontSize: '13px' }}>{TRIP_TYPE_OPTIONS[record.trip_type]}</Text>
        },
        {
            title: 'Швидкість',
            dataIndex: 'speed_type',
            width: 150,
            render: (_, record) => isEdited(record) ?
                <Form.Item name="speed_type" style={{ margin: 0 }}><Select>{enumOptions(SPEED_TYPE_OPTIONS)}</Select></Form.Item> :
                <Tag color="cyan">{SPEED_TYPE_OPTIONS[record.speed_type]}</Tag>
        },
        {
            title: 'Частота',
            dataIndex: 'frequency_type',
            width: 150,
            render: (_, record) => isEdited(record) ?
                <Form.Item name="frequency_type" style={{ margin: 0 }}><Select>{enumOptions(FREQUENCY_TYPE_OPTIONS)}</Select></Form.Item> :
                FREQUENCY_TYPE_OPTIONS[record.frequency_type]
        },
        {
            title: 'Призначення',
            dataIndex: 'assignment_type',
            width: 150,
            render: (_, record) => isEdited(record) ?
                <Form.Item name="assignment_type" style={{ margin: 0 }}><Select>{enumOptions(ASSIGNMENT_TYPE_OPTIONS)}</Select></Form.Item> :
                <Text secondary>{ASSIGNMENT_TYPE_OPTIONS[record.assignment_type]}</Text>
        },
        {
            title: 'Фірмовий',
            dataIndex: 'is_branded',
            width: 100,
            align: 'center',
            render: (_, record) => isEdited(record) ?
                <Form.Item name="is_branded" valuePropName="checked" style={{ margin: 0 }}><Switch size="small" /></Form.Item> :
                (record.is_branded ? <Tag color="gold">ТАК</Tag> : <Tag>НІ</Tag>)
        },
        {
            title: 'Рейси',
            width: 110,
            align: 'center',
            render: (_, record) => <Button type="primary" ghost size="small" onClick={() => navigate(`/admin/${record.id}/train-races-list`)}>Рейси</Button>
        },
        {
            title: 'Дії',
            fixed: 'right', // Залишається справа при скролі
            width: 160,
            align: 'center',
            render: (_, record) => isEdited(record) ? (
                <Space>
                    <Button type="primary" size="small" onClick={() => saveUpdate(record.id)}>ОК</Button>
                    <Button size="small" onClick={() => setEditingKey('')}>Ні</Button>
                </Space>
            ) : (
                <Space>
                    <Button type="link" size="small" onClick={() => {
                        updateForm.setFieldsValue({ ...record });
                        setEditingKey(record.id);
                    }}>Змінити</Button>
                    <Popconfirm title="Видалити?" onConfirm={() => handleDelete(record.id)}>
                        <Button type="link" danger size="small">Видалити</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div className="table-container">
            {contextHolder}
            <Form form={updateForm} component={false}>
                <Table
                    dataSource={routes}
                    columns={columns}
                    rowKey="id"
                    bordered
                    size="large" // Зменшує відступи в комірках для економії місця
                    scroll={{ x: 1800 }} // Вмикає горизонтальний скрол (сума ширини всіх колонок)
                    pagination={{ pageSize: 10, showSizeChanger: false }}
                    rowClassName={(_, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
                />
            </Form>
        </div>
    );
}

export default AdminTrainRoutesTable;