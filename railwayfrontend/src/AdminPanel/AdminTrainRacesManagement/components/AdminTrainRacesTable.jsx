import { Button, Popconfirm, Form, Input, message, Table, Typography, Space, Tag } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

function AdminTrainRacesTable({ races, fetchRaces }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [updateForm] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const navigate = useNavigate();

    const isEdited = (record) => record.id === editingKey;

    const saveUpdate = async (id) => {
        try {
            const row = await updateForm.validateFields();
            const token = localStorage.getItem('token');
            // Використовуємо PATCH як у вашому оригіналі
            const res = await fetch(`https://localhost:7230/Admin-API/update-train-race-price-coefficient/${id}?train_race_coefficient=${row.train_race_coefficient}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Помилка при оновленні коефіцієнта');

            messageApi.success(`Рейс ${id} оновлено`);
            setEditingKey('');
            fetchRaces();
        } catch (err) {
            messageApi.error(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://localhost:7230/Admin-API/delete-train-race/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Помилка при видаленні");
            messageApi.success(`Рейс ${id} видалено`);
            fetchRaces();
        } catch (err) {
            messageApi.error(err.message);
        }
    };

    const columns = [
        {
            title: 'ID рейсу',
            dataIndex: 'id',
            key: 'id',
            width: 120,
            fixed: 'left',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="ID рейсу"
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button type="primary" onClick={() => confirm()} size="small" style={{ width: 80 }}>Пошук</Button>
                        <Button onClick={() => clearFilters()} size="small" style={{ width: 80 }}>Скинути</Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) => record.id.toString().includes(value),
            render: (id) => <Text strong>{id}</Text>
        },
        {
            title: 'Дата відправлення',
            dataIndex: 'departure_date',
            width: 180,
            render: (date) => <Tag color="blue">{new Date(date).toLocaleDateString()}</Tag>
        },
        {
            title: 'Коефіцієнт рейсу',
            dataIndex: 'train_race_coefficient',
            width: 150,
            render: (_, record) => isEdited(record) ? (
                <Form.Item name="train_race_coefficient" style={{ margin: 0 }}>
                    <Input type="number" step="0.1" />
                </Form.Item>
            ) : (
                <Text code>{record.train_race_coefficient}</Text>
            ),
        },
        {
            title: "Деталізація",
            width: 150,
            align: 'center',
            render: (_, record) => (
                <Button
                    icon={<InfoCircleOutlined />}
                    onClick={() => navigate(`/admin/${record.id}/info`)}
                    type="link"
                >
                    Деталі
                </Button>
            )
        },
        {
            title: 'Дії',
            fixed: 'right',
            width: 180,
            align: 'center',
            render: (_, record) => isEdited(record) ? (
                <Space>
                    <Button type="primary" size="small" onClick={() => saveUpdate(record.id)}>Зберегти</Button>
                    <Button size="small" onClick={() => setEditingKey('')}>Відміна</Button>
                </Space>
            ) : (
                <Space>
                    <Button type="link" icon={<EditOutlined />} onClick={() => {
                        updateForm.setFieldsValue({ ...record });
                        setEditingKey(record.id);
                    }}>Редагувати</Button>
                    <Popconfirm title="Видалити цей рейс?" onConfirm={() => handleDelete(record.id)}>
                        <Button type="link" danger icon={<DeleteOutlined />}>Видалити</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            {contextHolder}
            <Form form={updateForm} component={false}>
                <Table
                    dataSource={races}
                    columns={columns}
                    rowKey="id"
                    bordered
                    scroll={{ x: 800 }}
                    rowClassName={(_, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
                    pagination={{ pageSize: 10 }}
                />
            </Form>
        </>
    );
}

export default AdminTrainRacesTable;