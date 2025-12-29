import { Button, DatePicker, Form, Input, message, Popconfirm, Select, Table, Tag, Typography, Space } from "antd";
import React, { useState } from "react";
import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { stationTitleIntoUkrainian } from "../../../../SystemUtils/InterpreterMethodsAndDictionaries/StationsDictionary.js";
import { enumOptions } from "../../GeneralComponents/EnumOptionConvertion.jsx";
import { TRAIN_STOP_TYPE_OPTIONS } from "./AdminTrainStopsEnums.js";
import dayjs from 'dayjs';

const { Text } = Typography;

function AdminTrainStopsTable({ trainStops, fetchTrainStops }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [updateForm] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');

    const isEdited = (record) => record.station_title === editingKey;

    const toLocalTimeFormat = (time) => time ? time.format("YYYY-MM-DDTHH:mm:ss") : null;

    const saveUpdate = async (station_title, train_route_on_date_id) => {
        try {
            const token = localStorage.getItem('token');
            const row = await updateForm.validateFields();
            const updatedTrainStop = {
                ...trainStops.find(ts => ts.station_title === station_title),
                ...row,
                arrival_time: toLocalTimeFormat(row.arrival_time),
                departure_time: toLocalTimeFormat(row.departure_time)
            };

            const response = await fetch(`https://localhost:7230/Admin-API/update-train-stop/${train_route_on_date_id}/${station_title}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedTrainStop)
            });

            if (!response.ok) throw new Error('Помилка при оновленні зупинки');

            messageApi.success(`Зупинку ${stationTitleIntoUkrainian(station_title)} оновлено`);
            setEditingKey('');
            fetchTrainStops();
        } catch (err) {
            messageApi.error(err.message);
        }
    };

    const handleDelete = async (train_route_on_date_id, station_title) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://localhost:7230/Admin-API/delete-train-stop/${train_route_on_date_id}/${station_title}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Не вдалося видалити зупинку");
            messageApi.success(`Зупинку видалено`);
            fetchTrainStops();
        } catch (err) {
            messageApi.error(err.message);
        }
    };

    const columns = [
        {
            title: 'Станція',
            dataIndex: 'station_title',
            key: 'station_title',
            fixed: 'left',
            width: 200,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Назва станції"
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
            onFilter: (value, record) =>
                stationTitleIntoUkrainian(record.station_title).toLowerCase().includes(value.toLowerCase()),
            render: (text) => <Text strong>{stationTitleIntoUkrainian(text)}</Text>
        },
        {
            title: 'Прибуття',
            dataIndex: 'arrival_time',
            width: 180,
            render: (_, record) => isEdited(record) ? (
                <Form.Item name="arrival_time" style={{ margin: 0 }}>
                    <DatePicker showTime={{ format: 'HH:mm' }} format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} />
                </Form.Item>
            ) : (
                record.arrival_time ? dayjs(record.arrival_time).format("DD.MM.YYYY HH:mm") : "✖️"
            )
        },
        {
            title: 'Відправлення',
            dataIndex: 'departure_time',
            width: 180,
            render: (_, record) => isEdited(record) ? (
                <Form.Item name="departure_time" style={{ margin: 0 }}>
                    <DatePicker showTime={{ format: 'HH:mm' }} format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} />
                </Form.Item>
            ) : (
                record.departure_time ? dayjs(record.departure_time).format("DD.MM.YYYY HH:mm") : "✖️"
            )
        },
        {
            title: 'Стоянка',
            width: 90,
            align: 'center',
            render: (_, record) => {
                if (!record.arrival_time || !record.departure_time) return "✖️";
                const diff = dayjs(record.departure_time).diff(dayjs(record.arrival_time), 'minute');
                return `${diff} хв`;
            }
        },
        {
            title: 'Тип',
            dataIndex: 'stop_type',
            width: 135,
            render: (_, record) => isEdited(record) ? (
                <Form.Item name="stop_type" style={{ margin: 0 }}>
                    <Select>{enumOptions(TRAIN_STOP_TYPE_OPTIONS)}</Select>
                </Form.Item>
            ) : (
                <Tag color={record.stop_type === 0 ? "gold" : "blue"}>{TRAIN_STOP_TYPE_OPTIONS[record.stop_type]}</Tag>
            )
        },
        {
            title: "Відстань (км)",
            dataIndex: "distance_from_starting_station",
            width: 90,
            render: (_, record) => isEdited(record) ? (
                <Form.Item name="distance_from_starting_station" style={{ margin: 0 }}><Input /></Form.Item>
            ) : <Text italic>{record.distance_from_starting_station} км</Text>
        },
        {
            title: "Швидкість (км/год)",
            dataIndex: "speed_on_section",
            width: 140,
            render: (value) => value != null ? `${value.toFixed(2)} км/год` : "✖️"
        },
        {
            title: 'Дії',
            fixed: 'right',
            width: 200, // Збільшили ширину для комфортного розміщення
            align: 'center',
            render: (_, record) => isEdited(record) ? (
                <Space size="middle">
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => saveUpdate(record.station_title, record.train_route_on_date_id)}
                    >
                        Зберегти
                    </Button>
                    <Button
                        size="small"
                        onClick={() => setEditingKey('')}
                    >
                        Відміна
                    </Button>
                </Space>
            ) : (
                /* Використовуємо Space з розділювачем */
                <Space split={<span style={{ color: '#ccc' }}>|</span>}>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        style={{ padding: 0 }}
                        onClick={() => {
                            updateForm.setFieldsValue({
                                ...record,
                                arrival_time: record.arrival_time ? dayjs(record.arrival_time) : null,
                                departure_time: record.departure_time ? dayjs(record.departure_time) : null,
                            });
                            setEditingKey(record.station_title);
                        }}
                    >
                        Змінити
                    </Button>
                    <Popconfirm
                        title="Видалити зупинку?"
                        onConfirm={() => handleDelete(record.train_route_on_date_id, record.station_title)}
                        okText="Так"
                        cancelText="Ні"
                    >
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            style={{ padding: 0 }}
                        >
                            Видалити
                        </Button>
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
                    dataSource={trainStops}
                    columns={columns}
                    rowKey="station_title"
                    bordered
                    scroll={{ x: 1100 }}
                    pagination={false}
                    rowClassName={(_, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
                />
            </Form>
        </div>
    );
}

export default AdminTrainStopsTable;