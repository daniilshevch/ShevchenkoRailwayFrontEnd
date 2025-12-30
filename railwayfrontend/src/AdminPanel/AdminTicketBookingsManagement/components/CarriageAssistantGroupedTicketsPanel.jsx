import React from 'react';
import { Card, Table, Collapse, Badge, Tag, Typography, Space, Empty, Divider, Tabs, Descriptions, Avatar } from 'antd';
import {
    UserOutlined,
    EnvironmentOutlined,
    InfoCircleOutlined,
    CheckCircleOutlined,
    LoginOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import {
    stationTitleIntoUkrainian
} from "../../../../SystemUtils/InterpreterMethodsAndDictionaries/StationsDictionary.js";
import {
    changeCarriageTypeIntoUkrainian
} from "../../../../SystemUtils/InterpreterMethodsAndDictionaries/CarriagesDictionaries.js";

const { Text } = Typography;
const { Panel } = Collapse;

const CarriageAssistantGroupedTicketsPanel = ({ data, isArrivalMode, onModeChange }) => {
    if (!data) return (
        <Card style={{ borderRadius: '12px', textAlign: 'center', padding: '40px' }}>
            <Empty description="Дані про бронювання відсутні" />
        </Card>
    );

    const { passenger_carriage_bookings_info, ticket_groups_by_starting_station, ticket_groups_by_ending_station } = data;
    const currentGroups = isArrivalMode ? ticket_groups_by_ending_station : ticket_groups_by_starting_station;

    const columns = [
        {
            title: 'МІСЦЕ',
            dataIndex: 'place_in_carriage',
            key: 'place',
            width: 100,
            align: 'center',
            render: (val) => (
                <Text style={{
                    fontFamily: 'monospace',
                    fontSize: '15px',
                    fontWeight: 'bold',
                    color: '#1890ff'
                }}>
                    №{val}
                </Text>
            ),
        },
        {
            title: 'ПАСАЖИР',
            key: 'passenger',
            width: 320, // Фіксуємо ширину, щоб прибрати дірку між колонками
            render: (record) => (
                <Space size="middle">
                    <Avatar size="small" style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }} icon={<UserOutlined />} />
                    <Text strong style={{ fontSize: '14px', letterSpacing: '0.2px' }}>
                        {record.passenger_trip_info.passenger_surname} {record.passenger_trip_info.passenger_name}
                    </Text>
                </Space>
            ),
        },
        {
            title: isArrivalMode ? 'СТАНЦІЯ ПОСАДКИ' : 'СТАНЦІЯ ВИСАДКИ',
            key: 'sub_station',
            // Тут не ставимо фіксовану ширину, щоб вона займала весь вільний простір
            render: (record) => (
                <Space>
                    <EnvironmentOutlined style={{ color: '#bfbfbf' }} />
                    <Text type="secondary" style={{ fontSize: '14px', fontWeight: 'bold' }}>
                        {isArrivalMode
                            ? stationTitleIntoUkrainian(record.passenger_trip_info.trip_starting_station)
                            : stationTitleIntoUkrainian(record.passenger_trip_info.trip_ending_station)}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'СТАТУС',
            key: 'action',
            width: 160,
            align: 'right',
            render: () => (
                <Tag
                    icon={<CheckCircleOutlined />}
                    color="success"
                    style={{ borderRadius: '4px', padding: '2px 8px', margin: 0, border: 'none', fontWeight: 600 }}
                >
                    ПЕРЕВІРЕНО
                </Tag>
            ),
        }
    ];

    const renderCollapseContent = () => (
        <Collapse accordion ghost expandIconPosition="right">
            {currentGroups.map((group, idx) => {
                const mainTitle = isArrivalMode ? group.trip_ending_station_title : group.trip_starting_station_title;
                const subGroups = isArrivalMode ? group.starting_station_groups : group.destination_groups;
                const totalInGroup = subGroups.reduce((acc, sg) => acc + sg.passenger_trips_info.length, 0);

                // Визначаємо основний колір для поточної секції
                const themeColor = isArrivalMode ? '#fa8c16' : '#52c41a';

                return (
                    <Panel
                        header={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <Space size="large">
                                    <div style={{
                                        padding: '10px',
                                        backgroundColor: isArrivalMode ? '#fff7e6' : '#f6ffed',
                                        borderRadius: '10px',
                                        display: 'flex'
                                    }}>
                                        <EnvironmentOutlined style={{ color: themeColor, fontSize: '20px' }} />
                                    </div>
                                    <div>
                                        <Text strong style={{ fontSize: '18px', display: 'block', lineHeight: '1.2' }}>
                                            {stationTitleIntoUkrainian(mainTitle)}
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500 }}>
                                            {isArrivalMode ? 'Станція висадки пасажирів' : 'Станція посадки пасажирів'}
                                        </Text>
                                    </div>
                                </Space>
                                <Badge count={totalInGroup} style={{ backgroundColor: themeColor }} />
                            </div>
                        }
                        key={idx}
                        style={{ marginBottom: '16px', borderBottom: '1px solid #f0f0f0' }}
                    >
                        {subGroups.map((sub, sIdx) => (
                            <div key={sIdx} style={{
                                marginBottom: '32px',
                                paddingLeft: '12px',
                                borderLeft: `3px solid ${themeColor}40` // 40 — це прозорість лінії
                            }}>
                                {/* Оновлений заголовок під-секції */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '16px',
                                    gap: '12px'
                                }}>
                                    <Text style={{
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        color: '#8c8c8c',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1.5px'
                                    }}>
                                        {isArrivalMode ? 'Станція посадки:' : 'Станція висадки:'}
                                    </Text>
                                    <Tag color={isArrivalMode ? "orange-pure" : "green-pure"} style={{
                                        margin: 0,
                                        borderRadius: '6px',
                                        fontWeight: 600,
                                        border: 'none',
                                        backgroundColor: isArrivalMode ? '#fff7e6' : '#f6ffed',
                                        color: themeColor,
                                        fontSize: '13px'
                                    }}>
                                        {stationTitleIntoUkrainian(isArrivalMode ? sub.trip_starting_station_title : sub.trip_ending_station_title)}
                                    </Tag>
                                    <div style={{ flex: 1, height: '1px', backgroundColor: '#f0f0f0' }} />
                                </div>

                                <Table
                                    dataSource={sub.passenger_trips_info}
                                    columns={columns}
                                    pagination={false}
                                    size="middle"
                                    rowClassName={() => 'custom-table-row'}
                                    rowKey={(r) => `${r.place_in_carriage}-${r.passenger_trip_info.user_id}`}
                                />
                            </div>
                        ))}
                    </Panel>
                );
            })}
        </Collapse>
    );
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <style>{`
                .ant-table-thead > tr > th {
                    background-color: #fafafa !important;
                    color: #8c8c8c !important;
                    font-size: 11px !important;
                    font-weight: 700 !important;
                    letter-spacing: 0.8px !important;
                    text-transform: uppercase !important;
                    border-bottom: 2px solid #f0f0f0 !important;
                }
                .custom-table-row:hover {
                    background-color: #f0f7ff !important;
                    cursor: pointer;
                }
            `}</style>

            <Card
                style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                title={<span><InfoCircleOutlined /> Загальні відомості вагона</span>}
                extra={<Tag color="blue" style={{ fontFamily: 'monospace' }}>ID: {passenger_carriage_bookings_info.passenger_carriage_id}</Tag>}
            >
                <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }} size="small">
                    <Descriptions.Item label="Тип вагона">
                        <Text strong>{changeCarriageTypeIntoUkrainian(passenger_carriage_bookings_info.carriage_type)}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Клас якості">
                        <Tag color="purple">{passenger_carriage_bookings_info.carriage_quality_class || 'Стандарт'}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Позиція у складі">
                        <Text strong style={{ fontSize: '15px' }}>№ {passenger_carriage_bookings_info.carriage_position_in_squad}</Text>
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Card
                style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                bodyStyle={{ padding: '8px 24px 24px 24px' }}
            >
                <Tabs
                    activeKey={isArrivalMode ? 'arrival' : 'departure'}
                    onChange={(key) => onModeChange(key === 'arrival')}
                    size="large"
                    tabBarStyle={{ marginBottom: '24px', fontWeight: 600 }}
                    items={[
                        {
                            key: 'departure',
                            label: <span><LoginOutlined /> ПОСАДКА ПАСАЖИРІВ</span>,
                            children: renderCollapseContent(),
                        },
                        {
                            key: 'arrival',
                            label: <span><LogoutOutlined /> ВИСАДКА ПАСАЖИРІВ</span>,
                            children: renderCollapseContent(),
                        },
                    ]}
                />
            </Card>
        </div>
    );
};

export default CarriageAssistantGroupedTicketsPanel;