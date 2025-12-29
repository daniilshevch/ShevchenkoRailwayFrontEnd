import React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Divider, Card, Tabs, Button, Space, Tag, Descriptions } from 'antd';
import {
    ArrowLeftOutlined,
    HistoryOutlined,
    ContainerOutlined,
    InfoCircleOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import AdminTrainStopsList from "../../../AdminTrainStopsManagement/components/AdminTrainStopsList.jsx";
import AdminCarriageAssignmentsList from "../../../AdminCarriageAssignmentsManagement/components/AdminCarriageAssignmentsList.jsx";

const { Title, Text } = Typography;

function AdminTrainRaceInfoPage() {
    const { train_race_id } = useParams();
    const navigate = useNavigate();


    const tabItems = [
        {
            key: '1',
            label: (
                <span>
                    <EnvironmentOutlined /> Розклад зупинок
                </span>
            ),
            children: <AdminTrainStopsList train_race_id={train_race_id} />,
        },
        {
            key: '2',
            label: (
                <span>
                    <ContainerOutlined /> Склад поїзда
                </span>
            ),
            children: <AdminCarriageAssignmentsList train_race_id={train_race_id} />,
        },
    ];

    return (
        <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            {/* Навігаційна панель */}
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Space size="large">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                        type="default"
                        shape="circle"
                    />
                    <div>
                        <Title level={2} style={{ margin: 0 }}>Характеристика рейсу</Title>
                        <Text type="secondary" style = {{fontWeight: 500}}>Керування розкладом та складом рейсу поїзда</Text>
                    </div>
                </Space>
                <Tag color="blue" style={{ fontSize: '16px', padding: '4px 12px' }}>
                    ID: {train_race_id}
                </Tag>
            </div>

            {/* Верхня картка зі зведеною інформацією */}
            <Card
                style={{ marginBottom: 24, borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                title={<span><InfoCircleOutlined /> Загальні відомості</span>}
            >
                <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
                    <Descriptions.Item label="Рейс">{train_race_id}</Descriptions.Item>
                    <Descriptions.Item label="Статус">
                        <Tag color="processing">Активний</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Тип управління">Адміністративний</Descriptions.Item>
                </Descriptions>
            </Card>

            {/* Основна робоча область із вкладками */}
            <Card
                style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                bodyStyle={{ padding: '0 24px 24px 24px' }}
            >
                <Tabs
                    defaultActiveKey="1"
                    items={tabItems}
                    size="large"
                    animated={{ inkBar: true, tabPane: true }}
                />
            </Card>
        </div>
    );
}

export default AdminTrainRaceInfoPage;