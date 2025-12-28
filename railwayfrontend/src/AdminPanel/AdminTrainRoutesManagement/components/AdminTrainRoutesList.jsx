import React, { useEffect, useState } from 'react';
import { Button, message, Card, Typography, Space } from 'antd';
import AdminTrainRoutesTable from "./AdminTrainRoutesTable.jsx";
import AdminTrainRoutesCreateForm from "./AdminTrainRoutesCreateForm.jsx";
import './AdminTrainRoutesList.css';

const { Title } = Typography;

function AdminTrainRoutesList() {
    const [messageApi, contextHolder] = message.useMessage();
    const [routes, setRoutes] = useState([]);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

    const fetchRoutes = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('https://localhost:7230/Admin-API/get-train-routes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error(`Помилка ${res.status}: Доступ обмежено`);

            const data = await res.json();
            setRoutes(data);
        }
        catch(err) {
            messageApi.error(err.message);
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    return (
        <Card style={{ margin: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            {contextHolder}
            <Space style={{ marginBottom: 20, justifyContent: 'space-between', width: '100%' }}>
                <Title level={3} style={{ margin: 0 }}>Управління маршрутами</Title>
                <Button type="primary" size="large" onClick={() => setIsCreateModalVisible(true)}>
                    + Створити маршрут
                </Button>
            </Space>

            <AdminTrainRoutesTable routes={routes} fetchRoutes={fetchRoutes} />

            <AdminTrainRoutesCreateForm
                fetchRoutes={fetchRoutes}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
            />
        </Card>
    );
}

export default AdminTrainRoutesList;