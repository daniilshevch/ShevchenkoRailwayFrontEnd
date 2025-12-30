import React, { useState, useEffect, useCallback } from 'react';
import {useParams, useSearchParams} from "react-router-dom";
import { Layout, Spin, Alert, Typography, Breadcrumb } from 'antd';
import CarriageAssistantGroupedTicketsPanel from "../components/CarriageAssistantGroupedTicketsPanel.jsx";

const { Content } = Layout;
const { Title } = Typography;

const CarriageAssistantPage = () => {
    const { trainRouteId } = useParams();
    const [searchParams] = useSearchParams();
    const carriagePos = searchParams.get('carriage_number') || 1;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isArrivalMode, setIsArrivalMode] = useState(false);

    const fetchGroupedData = useCallback(async (mode) => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const baseUrl = `https://localhost:7230/Admin-API/get-grouped-ticket-bookings-by-stations-for-train-race/${trainRouteId}`;
            const params = new URLSearchParams({
                carriage_position_in_squad: carriagePos,
                group_by_ending_station_first: mode
            });

            const response = await fetch(`${baseUrl}?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Помилка API: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            setData(result);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [trainRouteId, carriagePos]);

    useEffect(() => {
        fetchGroupedData(isArrivalMode);
    }, [isArrivalMode, fetchGroupedData]);

    return (
        <Layout style={{ padding: '0 0px 0px', margin: 30, background: '#f0f2f5', minHeight: '100vh' }}>
            <Content style={{ padding: 24, margin: 0, background: '#fff' }}>
                <Title level={2}>Вагон № {carriagePos}</Title>

                {error && (
                    <Alert
                        message="Помилка завантаження даних"
                        description={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: '20px' }}
                    />
                )}

                {loading && !data ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <Spin size="large" tip="Завантаження списку пасажирів..." />
                    </div>
                ) : (
                    <CarriageAssistantGroupedTicketsPanel
                        data={data}
                        isArrivalMode={isArrivalMode}
                        onModeChange={setIsArrivalMode}
                    />
                )}
            </Content>
        </Layout>
    );
};

export default CarriageAssistantPage;