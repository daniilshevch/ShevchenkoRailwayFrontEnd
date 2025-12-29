import React, { useState } from "react";
import { Button, Form, Input, message, Popconfirm, Switch, Table, Typography, Space, Tag, InputNumber } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, IdcardOutlined } from "@ant-design/icons";
import { CARRIAGE_TYPE_OPTIONS, CARRIAGE_QUALITY_CLASS_OPTIONS } from "./AdminCarriageAssignmentsEnums.js";
import "./AdminCarriageAssignmentsList.css";
const { Text } = Typography;

function AdminCarriageAssignmentsTable({ train_race_id, carriageAssignments, fetchCarriageAssignments }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [updateForm] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');

    const isEdited = (record) => record.passenger_carriage_id === editingKey;

    const saveUpdate = async (passenger_carriage_id, train_route_on_date_id) => {
        try {
            const token = localStorage.getItem('token');
            const row = await updateForm.validateFields();
            const original = carriageAssignments.find(c => c.passenger_carriage_id === passenger_carriage_id);
            const updated = { ...original, ...row };

            const response = await fetch(`https://localhost:7230/Admin-API/update-carriage-assignment/${train_route_on_date_id}/${passenger_carriage_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updated)
            });

            if (!response.ok) throw new Error('Помилка при оновленні');
            messageApi.success(`Вагон ${passenger_carriage_id} оновлено`);
            setEditingKey('');
            fetchCarriageAssignments();
        } catch (err) {
            messageApi.error(err.message);
        }
    };

    const handleDelete = async (passenger_carriage_id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://localhost:7230/Admin-API/delete-carriage-assignment/${train_race_id}/${passenger_carriage_id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Помилка при видаленні");
            messageApi.success(`Вагон ${passenger_carriage_id} видалено`);
            fetchCarriageAssignments();
        } catch (err) {
            messageApi.error(err.message);
        }
    };

    const renderBoolean = (val) => val ? <Tag color="success">ТАК</Tag> : <Tag color="default">НІ</Tag>;

    const columns = [
        {
            title: 'ID вагону',
            dataIndex: 'passenger_carriage_id',
            key: 'passenger_carriage_id',
            fixed: 'left',
            width: 80,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="ID вагону"
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
            onFilter: (value, record) => record.passenger_carriage_id.toString().includes(value),
            render: (id) => <Text strong>{id}</Text>
        },
        {
            title: '№',
            dataIndex: 'position_in_squad',
            width: 55,
            align: 'center',
            render: (val, record) => isEdited(record) ? (
                <Form.Item name="position_in_squad" style={{ margin: 0 }}>
                    <InputNumber style = {{width: "100%" }} min={1} className="custom-number-input" size="small" />
                </Form.Item>
            ) : <Text code>{val}</Text>
        },
        {
            title: 'Тип',
            dataIndex: ['passenger_carriage_info', 'type_of'],
            width: 90,
            render: (val) => CARRIAGE_TYPE_OPTIONS[val]
        },
        {
            title: 'Клас',
            dataIndex: ['passenger_carriage_info', 'quality_class'],
            width: 55,
            render: (val) => <Tag color="purple">{CARRIAGE_QUALITY_CLASS_OPTIONS[val]}</Tag>
        },
        { title: 'Жін.', dataIndex: 'is_for_woman', width: 55, align: 'center', render: (val, record) => isEdited(record) ? <Form.Item name="is_for_woman" valuePropName="checked" style={{ margin: 0 }}><Switch size="small"/></Form.Item> : renderBoolean(val) },
        { title: 'Дит.', dataIndex: 'is_for_children', width: 55, align: 'center', render: (val, record) => isEdited(record) ? <Form.Item name="is_for_children" valuePropName="checked" style={{ margin: 0 }}><Switch size="small"/></Form.Item> : renderBoolean(val) },
        { title: 'Wi-Fi', dataIndex: 'factual_wi_fi', width: 55, align: 'center', render: (val, record) => isEdited(record) ? <Form.Item name="factual_wi_fi" valuePropName="checked" style={{ margin: 0 }}><Switch size="small"/></Form.Item> : renderBoolean(val) },
        { title: 'Конд.', dataIndex: 'factual_air_conditioning', width: 55, align: 'center', render: (val, record) => isEdited(record) ? <Form.Item name="factual_air_conditioning" valuePropName="checked" style={{ margin: 0 }}><Switch size="small"/></Form.Item> : renderBoolean(val) },
        { title: 'Душ', dataIndex: 'factual_shower_availability', width: 55, align: 'center', render: (val, record) => isEdited(record) ? <Form.Item name="factual_shower_availability" valuePropName="checked" style={{ margin: 0 }}><Switch size="small"/></Form.Item> : renderBoolean(val) },
        { title: 'Інкл.', dataIndex: 'factual_is_inclusive', width: 55, align: 'center', render: (val, record) => isEdited(record) ? <Form.Item name="factual_is_inclusive" valuePropName="checked" style={{ margin: 0 }}><Switch size="small"/></Form.Item> : renderBoolean(val) },
        { title: 'Їжа', dataIndex: 'food_availability', width: 55, align: 'center', render: (val, record) => isEdited(record) ? <Form.Item name="food_availability" valuePropName="checked" style={{ margin: 0 }}><Switch size="small"/></Form.Item> : renderBoolean(val) },

        {
            title: "Квитки",
            width: 100,
            align: 'center',
            render: (_, record) => <Button icon={<IdcardOutlined />} type="link">Квитки</Button>
        },
        {
            title: 'Дії',
            fixed: 'right',
            width: 160,
            align: 'center',
            render: (_, record) => isEdited(record) ? (
                <Space>
                    <Button type="primary" size="small" onClick={() => saveUpdate(record.passenger_carriage_id, record.train_route_on_date_id)}>ОК</Button>
                    <Button size="small" onClick={() => setEditingKey('')}>Ні</Button>
                </Space>
            ) : (
                <Space split={<span style={{ color: '#ccc' }}>|</span>}>
                    <Button type="link" icon={<EditOutlined />} style={{ padding: 0 }} onClick={() => {
                        updateForm.setFieldsValue({ ...record });
                        setEditingKey(record.passenger_carriage_id);
                    }}>Змінити</Button>
                    <Popconfirm title="Видалити вагон зі складу?" onConfirm={() => handleDelete(record.passenger_carriage_id)}>
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
                    dataSource={carriageAssignments}
                    columns={columns}
                    rowKey="passenger_carriage_id"
                    bordered
                    scroll={{ x: 1500 }}
                    pagination={false}
                    rowClassName={(_, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
                />
            </Form>
        </div>
    );
}

export default AdminCarriageAssignmentsTable;