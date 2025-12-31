import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Layout, Spin, Alert, Typography, Space, Button, Card, Radio, Tag } from 'antd';
import { ArrowLeftOutlined, BorderOutlined, ContainerOutlined } from '@ant-design/icons'; // Виправлено імпорт
import CarriageAssistantGroupedTicketsPanel from "../components/CarriageAssistantGroupedTicketsPanel.jsx";

const { Content } = Layout;
const { Title, Text } = Typography;

const CarriageAssistantPage = () => {
    const { trainRaceId } = useParams(); // Переконайся, що в App.js вказано :trainRaceId
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const carriagePos = parseInt(searchParams.get('carriage_number') || "1");

    const [data, setData] = useState(null);
    const [allCarriages, setAllCarriages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isArrivalMode, setIsArrivalMode] = useState(false);

    const fetchCarriageList = useCallback(async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`https://localhost:7230/Admin-API/get-carriage-assignments-for-train-race/${trainRaceId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Не вдалося завантажити склад поїзда');
            const carriages = await res.json();
            setAllCarriages(carriages.sort((a, b) => a.position_in_squad - b.position_in_squad));
        } catch (err) {
            console.error("Помилка навігації:", err.message);
        }
    }, [trainRaceId]);

    const fetchGroupedData = useCallback(async (mode, pos) => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const baseUrl = `https://localhost:7230/Admin-API/get-grouped-ticket-bookings-by-stations-for-train-race/${trainRaceId}`;
            const params = new URLSearchParams({
                carriage_position_in_squad: pos,
                group_by_ending_station_first: mode
            });

            const response = await fetch(`${baseUrl}?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error(`Помилка API: ${response.status}`);
            const result = await response.json();
            setData(result);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [trainRaceId]);

    useEffect(() => { fetchCarriageList(); }, [fetchCarriageList]);
    useEffect(() => { fetchGroupedData(isArrivalMode, carriagePos); }, [isArrivalMode, carriagePos, fetchGroupedData]);

    return (
        <Layout style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
            <Content>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Space size="large">
                            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} shape="circle" />
                            <div>
                                <Title level={2} style={{ margin: 0 }}>Помічник провідника</Title>
                                <Text type="secondary">Керування пасажирами вагона</Text>
                            </div>
                        </Space>
                        <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>РЕЙС: {trainRaceId}</Tag>
                    </div>

                    <Card size="small" style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Space><BorderOutlined style={{ color: '#1890ff' }} /><Text strong>Оберіть номер вагона:</Text></Space>
                            <Radio.Group value={carriagePos} onChange={(e) => setSearchParams({ carriage_number: e.target.value })} buttonStyle="solid" size="large">
                                {allCarriages.map(c => (
                                    <Radio.Button key={c.passenger_carriage_id} value={c.position_in_squad} style={{ minWidth: '60px', textAlign: 'center' }}>
                                        {c.position_in_squad}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </Space>
                    </Card>

                    {error && <Alert message="Помилка" description={error} type="error" showIcon />}
                    {loading && !data ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" tip="Завантаження..." /></div>
                    ) : (
                        <CarriageAssistantGroupedTicketsPanel trainRaceId={trainRaceId} data={data} isArrivalMode={isArrivalMode} onModeChange={setIsArrivalMode} />
                    )}
                </Space>
            </Content>
        </Layout>
    );
};

export default CarriageAssistantPage;