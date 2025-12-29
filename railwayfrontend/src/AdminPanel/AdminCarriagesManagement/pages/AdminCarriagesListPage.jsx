import React, { useEffect, useState } from 'react';
import { Button, message, Card, Typography, Space } from 'antd';
import { ContainerOutlined, PlusOutlined } from '@ant-design/icons';
import AdminCarriagesTable from "../components/AdminCarriagesTable.jsx";
import AdminCarriagesCreateForm from "../components/AdminCarriagesCreateForm.jsx";

const { Title } = Typography;

function AdminCarriagesListPage() {
    const [messageApi, contextHolder] = message.useMessage();
    const [carriages, setCarriages] = useState([]);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

    const fetchCarriages = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('https://localhost:7230/Admin-API/get-passenger-carriages', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Не вдалося завантажити список вагонів');

            const data = await res.json();
            setCarriages(data);
        } catch (err) {
            messageApi.error(err.message);
        }
    };

    useEffect(() => {
        fetchCarriages();
    }, []);

    return (
        <Card style={{ margin: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            {contextHolder}
            <Space style={{ marginBottom: 20, justifyContent: 'space-between', width: '100%' }}>
                <Title level={3} style={{ margin: 0 }}>
                    <ContainerOutlined /> Реєстр пасажирських вагонів
                </Title>
                <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)}>
                    Додати вагон
                </Button>
            </Space>

            <AdminCarriagesTable carriages={carriages} fetchCarriages={fetchCarriages} />

            <AdminCarriagesCreateForm
                fetchCarriages={fetchCarriages}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
            />
        </Card>
    );
}

export default AdminCarriagesListPage;