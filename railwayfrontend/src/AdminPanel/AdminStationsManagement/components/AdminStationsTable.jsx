import React, { useState } from "react";
import { Button, Form, Input, message, Popconfirm, Table, Typography, Space, Tag, Select } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { STATION_TYPE_OPTIONS, REGION_OPTIONS } from "./AdminStationsEnums.js";
import { enumOptions } from "../../GeneralComponents/EnumOptionConvertion.jsx";
import {
    stationTitleIntoUkrainian
} from "../../../../SystemUtils/InterpreterMethodsAndDictionaries/StationsDictionary.js";

const { Text } = Typography;

function AdminStationsTable({ stations, fetchStations }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [updateForm] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');

    const isEdited = (record) => record.id === editingKey;

    const saveUpdate = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const row = await updateForm.validateFields();
            const original = stations.find(s => s.id === id);
            const updated = { ...original, ...row };

            const response = await fetch(`https://localhost:7230/Admin-API/update-station/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updated)
            });

            if (!response.ok) throw new Error('Помилка при оновленні станції');

            messageApi.success(`Станцію ${updated.title} оновлено`);
            setEditingKey('');
            fetchStations();
        } catch (err) {
            messageApi.error(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://localhost:7230/Admin-API/delete-station/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Не вдалося видалити станцію");

            messageApi.success(`Станцію видалено`);
            fetchStations();
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
            fixed: 'left',
            render: (text) => <Text style = {{fontWeight: 500}}>{text}</Text>
        },
        {
            title: 'Назва',
            dataIndex: 'title',
            key: 'title',
            width: 180,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Пошук назви"
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button type="primary" onClick={() => confirm()} size="small" style={{ width: 80 }}>ОК</Button>
                        <Button onClick={() => clearFilters()} size="small" style={{ width: 80 }}>Скинути</Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) => record.title.toLowerCase().includes(value.toLowerCase()),
            render: (text, record) => isEdited(record) ? (
                <Form.Item name="title" style={{ margin: 0 }} rules={[{ required: true }]}>
                    <Input size="small" />
                </Form.Item>
            ) : <Text strong>{stationTitleIntoUkrainian(text)}</Text>
        },
        {
            title: 'Тип',
            dataIndex: 'type_of',
            width: 180,
            render: (val, record) => isEdited(record) ? (
                <Form.Item name="type_of" style={{ margin: 0 }}>
                    <Select size="small">{enumOptions(STATION_TYPE_OPTIONS)}</Select>
                </Form.Item>
            ) : <Tag color="blue">{STATION_TYPE_OPTIONS[val]}</Tag>
        },
        {
            title: 'Область',
            dataIndex: 'region',
            width: 160,
            render: (val, record) => isEdited(record) ? (
                <Form.Item name="region" style={{ margin: 0 }}>
                    <Select size="small" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                        {enumOptions(REGION_OPTIONS)}
                    </Select>
                </Form.Item>
            ) : REGION_OPTIONS[val]
        },
        {
            title: 'Філія (Залізниця)',
            dataIndex: 'railway_branch_title',
            width: 180,
            render: (text, record) => isEdited(record) ? (
                <Form.Item name="railway_branch_title" style={{ margin: 0 }} rules={[{ required: true }]}>
                    <Input size="small" />
                </Form.Item>
            ) : text
        },
        {
            title: 'Локація/Адреса',
            dataIndex: 'location',
            width: 200,
            render: (text, record) => isEdited(record) ? (
                <Form.Item name="location" style={{ margin: 0 }}>
                    <Input size="small" />
                </Form.Item>
            ) : <Text type="secondary"><EnvironmentOutlined /> {text || '—'}</Text>
        },
        {
            title: 'Дії',
            fixed: 'right',
            width: 180,
            align: 'center',
            render: (_, record) => isEdited(record) ? (
                <Space>
                    <Button type="primary" size="small" onClick={() => saveUpdate(record.id)}>ОК</Button>
                    <Button size="small" onClick={() => setEditingKey('')}>Ні</Button>
                </Space>
            ) : (
                <Space split={<span style={{ color: '#ccc' }}>|</span>}>
                    <Button type="link" icon={<EditOutlined />} style={{ padding: 0 }} onClick={() => {
                        updateForm.setFieldsValue({ ...record });
                        setEditingKey(record.id);
                    }}>Змінити</Button>
                    <Popconfirm title="Видалити станцію?" onConfirm={() => handleDelete(record.id)}>
                        <Button type="link" danger icon={<DeleteOutlined />} style={{ padding: 0 }}>Видалити</Button>
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
                    dataSource={stations}
                    columns={columns}
                    rowKey="id"
                    bordered
                    scroll={{ x: 1400 }}
                    pagination={{ pageSize: 15 }}
                    rowClassName={(_, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
                />
            </Form>
        </div>
    );
}

export default AdminStationsTable;