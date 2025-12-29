import React, { useEffect, useState } from 'react';
import { Button, message, Card, Typography, Space } from 'antd';
import { GlobalOutlined, PlusOutlined } from '@ant-design/icons';
import AdminStationsTable from "../components/AdminStationsTable.jsx";
import AdminStationsCreateForm from "../components/AdminStationsCreateForm.jsx";

const { Title } = Typography;

function AdminStationsListPage() {
    const [messageApi, contextHolder] = message.useMessage();
    const [stations, setStations] = useState([]);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

    const fetchStations = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('https://localhost:7230/Admin-API/get-stations', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Помилка завантаження станцій');

            const data = await res.json();
            setStations(data);
        } catch (err) {
            messageApi.error(err.message);
        }
    };

    useEffect(() => {
        fetchStations();
    }, []);

    return (
        <Card style={{ margin: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            {contextHolder}
            <Space style={{ marginBottom: 20, justifyContent: 'space-between', width: '100%' }}>
                <Title level={3} style={{ margin: 0 }}>
                    <GlobalOutlined /> Реєстр залізничних станцій
                </Title>
                <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)}>
                    Створити станцію
                </Button>
            </Space>

            <AdminStationsTable stations={stations} fetchStations={fetchStations} />

            <AdminStationsCreateForm
                fetchStations={fetchStations}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
            />
        </Card>
    );
}

export default AdminStationsListPage;