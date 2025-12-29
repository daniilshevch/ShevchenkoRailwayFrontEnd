import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, message, Card, Typography, Space } from 'antd';
import { RocketOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import AdminTrainRacesTable from "../../components/AdminTrainRacesTable.jsx";
import AdminTrainRacesCreateForm from "../../components/AdminTrainRacesCreateForm.jsx";
import { useNavigate } from "react-router-dom";
import changeTrainRouteIdIntoUkrainian
    from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TrainRoutesDictionary.js";

const { Title } = Typography;

function AdminTrainRacesListPage() {
    const [messageApi, contextHolder] = message.useMessage();
    const [races, setRaces] = useState([]);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const { train_route_id } = useParams();
    const navigate = useNavigate();

    const fetchRaces = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://localhost:7230/Admin-API/get-races-for-train-route/${train_route_id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error(`Помилка ${res.status}: Не вдалося завантажити рейси`);

            const data = await res.json();
            setRaces(data);
        } catch (err) {
            messageApi.error(err.message);
        }
    };

    useEffect(() => {
        fetchRaces();
    }, [train_route_id]);

    return (
        <Card style={{ margin: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            {contextHolder}
            <Space style={{ marginBottom: 20, justifyContent: 'space-between', width: '100%' }}>
                <Space size="middle">
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/train-routes-list")} />
                    <Title level={3} style={{ margin: 0 }}>
                        Рейси маршруту: <span style={{ color: '#1890ff' }}>{changeTrainRouteIdIntoUkrainian(train_route_id)}</span>
                    </Title>
                </Space>
                <Button type="primary" size="large" icon={<RocketOutlined />} onClick={() => setIsCreateModalVisible(true)}>
                    + Додати рейс
                </Button>
            </Space>
            <AdminTrainRacesTable races={races} fetchRaces={fetchRaces} />
            <AdminTrainRacesCreateForm
                train_route_id={train_route_id}
                fetchRaces={fetchRaces}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
            />
        </Card>
    );
}

export default AdminTrainRacesListPage;