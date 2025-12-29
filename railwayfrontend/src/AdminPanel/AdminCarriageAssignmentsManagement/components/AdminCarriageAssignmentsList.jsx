import React, { useEffect, useState } from 'react';
import { Button, message, Card, Typography, Space } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, CopyOutlined, ReconciliationOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AdminCarriageAssignmentsTable from "./AdminCarriageAssignmentsTable.jsx";
import AdminCarriageAssignmentsCreateForm from "./AdminCarriageAssignmentsCreateForm.jsx";
import AdminCarriageAssignmentsCopyForm from "./AdminCarriageAssignmentsCopyForm.jsx";
import './AdminCarriageAssignmentsList.css';

const { Title } = Typography;

function AdminCarriageAssignmentsList({ train_race_id }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [carriageAssignments, setCarriageAssignments] = useState([]);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isCopySquadModalVisible, setIsCopySquadModalVisible] = useState(false);
    const navigate = useNavigate();

    const fetchCarriageAssignments = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://localhost:7230/Admin-API/get-carriage-assignments-for-train-race/${train_race_id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Не вдалося завантажити склад поїзда');
            const data = await res.json();
            setCarriageAssignments(data);
        } catch (err) {
            messageApi.error(err.message);
        }
    };

    useEffect(() => {
        fetchCarriageAssignments();
    }, [train_race_id]);

    return (
        <Card style={{ margin: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            {contextHolder}
            <Space style={{ marginBottom: 20, justifyContent: 'space-between', width: '100%' }}>
                <Space size="middle">
                    <Title level={3} style={{ margin: 0 }}>
                        <ReconciliationOutlined /> Склад поїзда: <span style={{ color: '#1890ff' }}>{train_race_id}</span>
                    </Title>
                </Space>

                <Space>
                    <Button
                        className="copy-squad-button"
                        type="primary"
                        style={{ backgroundColor: '#52c41a' }} // Зелений колір як в оригіналі
                        icon={<CopyOutlined />}
                        onClick={() => setIsCopySquadModalVisible(true)}
                    >
                        Скопіювати склад
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsCreateModalVisible(true)}
                    >
                        Додати вагон
                    </Button>
                </Space>
            </Space>

            <AdminCarriageAssignmentsTable
                train_race_id={train_race_id}
                carriageAssignments={carriageAssignments}
                fetchCarriageAssignments={fetchCarriageAssignments}
            />

            <AdminCarriageAssignmentsCreateForm
                train_race_id={train_race_id}
                fetchCarriageAssignments={fetchCarriageAssignments}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
            />

            <AdminCarriageAssignmentsCopyForm
                train_race_id={train_race_id}
                fetchCarriageAssignments={fetchCarriageAssignments}
                isCopySquadModalVisible={isCopySquadModalVisible}
                setIsCopySquadModalVisible={setIsCopySquadModalVisible}
            />
        </Card>
    );
}

export default AdminCarriageAssignmentsList;