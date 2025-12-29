import React, { useEffect, useState } from 'react';
import { Button, message, Card, Typography, Space, Tooltip } from 'antd';
import {
    PlusOutlined,
    CopyOutlined,
    ArrowLeftOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AdminTrainStopsTable from "./AdminTrainStopsTable.jsx";
import AdminTrainStopsCreateForm from "./AdminTrainStopsCreateForm.jsx";
import AdminTrainStopsCopyForm from "./AdminTrainStopsCopyForm.jsx";
import './AdminTrainStopsList.css';

const { Title } = Typography;

function AdminTrainStopsList({ train_race_id }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [trainStops, setTrainStops] = useState([]);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isCopyScheduleModalVisible, setIsCopyScheduleModalVisible] = useState(false);
    const navigate = useNavigate();

    const fetchTrainStops = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://localhost:7230/Admin-API/get-train-stops-for-train-race/${train_race_id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Не вдалося завантажити розклад зупинок');
            const data = await res.json();
            setTrainStops(data);
        } catch (err) {
            messageApi.error(err.message);
        }
    };

    useEffect(() => {
        fetchTrainStops();
    }, [train_race_id]);

    return (
        <Card style={{ margin: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            {contextHolder}
            <Space style={{ marginBottom: 20, justifyContent: 'space-between', width: '100%' }}>
                <Space size="middle">
                    <Title level={3} style={{ margin: 0 }}>
                        <EnvironmentOutlined /> Розклад зупинок рейсу: <span style={{ color: '#1890ff' }}>{train_race_id}</span>
                    </Title>
                </Space>

                <Space>
                    <Button
                        className="copy-schedule-button"
                        type="primary"
                        style={{ backgroundColor: '#722ed1' }} // Пурпуровий колір
                        icon={<CopyOutlined />}
                        onClick={() => setIsCopyScheduleModalVisible(true)}
                    >
                        Скопіювати з прототипу
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsCreateModalVisible(true)}
                    >
                        Додати зупинку
                    </Button>
                </Space>
            </Space>

            <AdminTrainStopsTable trainStops={trainStops} fetchTrainStops={fetchTrainStops} />

            <AdminTrainStopsCreateForm
                trainStops={trainStops}
                train_race_id={train_race_id}
                fetchTrainStops={fetchTrainStops}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
            />
            <AdminTrainStopsCopyForm
                train_race_id={train_race_id}
                fetchTrainStops={fetchTrainStops}
                isCopyScheduleModalVisible={isCopyScheduleModalVisible}
                setIsCopyScheduleModalVisible={setIsCopyScheduleModalVisible}
            />
        </Card>
    );
}

export default AdminTrainStopsList;