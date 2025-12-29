import React, { useState } from "react";
import { Button, Form, Input, message, Popconfirm, Table, Typography, Space, Tag, InputNumber, Switch, Select } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { CARRIAGE_TYPE_OPTIONS, CARRIAGE_QUALITY_CLASS_OPTIONS, CARRIAGE_MANUFACTURER_OPTIONS } from "./AdminCarriagesEnums.js";
import { enumOptions } from "../../GeneralComponents/EnumOptionConvertion.jsx";

const { Text } = Typography;

function AdminCarriagesTable({ carriages, fetchCarriages }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [updateForm] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');

    const isEdited = (record) => record.id === editingKey;

    const saveUpdate = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const row = await updateForm.validateFields();
            const original = carriages.find(c => c.id === id);
            const updated = { ...original, ...row };

            const response = await fetch(`https://localhost:7230/Admin-API/update-passenger-carriage/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updated)
            });

            if (!response.ok) throw new Error('Помилка при оновленні даних вагона');

            messageApi.success(`Вагон ${id} успішно оновлено`);
            setEditingKey('');
            fetchCarriages();
        } catch (err) {
            messageApi.error(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://localhost:7230/Admin-API/delete-passenger-carriage/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Не вдалося видалити вагон");

            messageApi.success(`Вагон ${id} видалено з бази`);
            fetchCarriages();
        } catch (err) {
            messageApi.error(err.message);
        }
    };

    const renderBoolean = (val) => val ? <Tag color="success">ТАК</Tag> : <Tag color="default">НІ</Tag>;

    const columns = [
        {
            title: 'ID Вагона',
            dataIndex: 'id',
            key: 'id',
            fixed: 'left',
            width: 140,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Пошук за ID"
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
            onFilter: (value, record) => record.id.toString().includes(value),
            render: (id) => <Text strong>{id}</Text>
        },
        {
            title: 'Тип',
            dataIndex: 'type_of',
            width: 140,
            render: (val, record) => isEdited(record) ? (
                <Form.Item name="type_of" style={{ margin: 0 }}>
                    <Select size="small" style={{ width: '100%' }}>
                        {enumOptions(CARRIAGE_TYPE_OPTIONS)}
                    </Select>
                </Form.Item>
            ) : <Tag color="blue">{CARRIAGE_TYPE_OPTIONS[val]}</Tag>
        },
        {
            title: 'Клас',
            dataIndex: 'quality_class',
            width: 100,
            align: 'center',
            render: (val, record) => isEdited(record) ? (
                <Form.Item name="quality_class" style={{ margin: 0 }}>
                    <Select size="small" style={{ width: '100%' }}>
                        {enumOptions(CARRIAGE_QUALITY_CLASS_OPTIONS)}
                    </Select>
                </Form.Item>
            ) : <Tag color="purple">{CARRIAGE_QUALITY_CLASS_OPTIONS[val]}</Tag>
        },
        {
            title: 'Місць',
            dataIndex: 'capacity',
            width: 90,
            align: 'center',
            render: (val, record) => isEdited(record) ? (
                <Form.Item name="capacity" style={{ margin: 0 }}>
                    <InputNumber className="custom-number-input" size="small" style={{ width: '100%' }} />
                </Form.Item>
            ) : <Text code>{val}</Text>
        },
        {
            title: 'Виробник',
            dataIndex: 'manufacturer',
            width: 140,
            render: (val, record) => isEdited(record) ? (
                <Form.Item name="manufacturer" style={{ margin: 0 }}>
                    <Select size="small" style={{ width: '100%' }}>
                        {enumOptions(CARRIAGE_MANUFACTURER_OPTIONS)}
                    </Select>
                </Form.Item>
            ) : (CARRIAGE_MANUFACTURER_OPTIONS[val] || "—")
        },
        {
            title: 'Рік',
            dataIndex: 'production_year',
            width: 100,
            render: (val, record) => isEdited(record) ? (
                <Form.Item name="production_year" style={{ margin: 0 }}>
                    <InputNumber className="custom-number-input" size="small" style={{ width: '100%' }} min={1950} max={2026} />
                </Form.Item>
            ) : (val || "—")
        },
        {
            title: 'Конд.',
            dataIndex: 'air_conditioning',
            width: 80,
            align: 'center',
            render: (val, record) => isEdited(record) ? (
                <Form.Item name="air_conditioning" valuePropName="checked" style={{ margin: 0 }}>
                    <Switch size="small" />
                </Form.Item>
            ) : renderBoolean(val)
        },
        {
            title: 'Інклюзив.',
            dataIndex: 'is_inclusive',
            width: 100,
            align: 'center',
            render: (val, record) => isEdited(record) ? (
                <Form.Item name="is_inclusive" valuePropName="checked" style={{ margin: 0 }}>
                    <Switch size="small" />
                </Form.Item>
            ) : renderBoolean(val)
        },
        {
            title: 'В експлуатації',
            dataIndex: 'in_current_use',
            width: 130,
            align: 'center',
            render: (val, record) => isEdited(record) ? (
                <Form.Item name="in_current_use" valuePropName="checked" style={{ margin: 0 }}>
                    <Switch size="small" />
                </Form.Item>
            ) : (val ? <Tag color="green">АКТИВНИЙ</Tag> : <Tag color="error">РЕМОНТ/ДЕПО</Tag>)
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
                    <Popconfirm title="Видалити вагон з бази?" onConfirm={() => handleDelete(record.id)}>
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
                    dataSource={carriages}
                    columns={columns}
                    rowKey="id"
                    bordered
                    scroll={{ x: 1400 }}
                    pagination={{ pageSize: 10 }}
                    rowClassName={(_, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
                />
            </Form>
        </div>
    );
}

export default AdminCarriagesTable;