import React, { useState, useEffect } from 'react';
import { Button, Select, Typography, DatePicker, InputNumber, Space, Row, Col, message } from 'antd';
import { SearchOutlined, RightOutlined, EnvironmentOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import BoardTable from '../BoardTable.jsx';
import './StationBoard.css';

import {
    stationsList,
    stationTitleIntoUkrainian
} from "../../../SystemUtils/InterpreterMethodsAndDictionaries/StationsDictionary.js";
import changeTrainRouteIdIntoUkrainian from "../../../SystemUtils/InterpreterMethodsAndDictionaries/TrainRoutesDictionary.js";

const { Title, Text } = Typography;

const StationBoard = () => {
    const stationOptions = stationsList.map((station) => ({
        value: station.english,
        label: station.ukrainian
    }));

    const [selectedStation, setSelectedStation] = useState("Odesa-Holovna");
    const [searchTime, setSearchTime] = useState(dayjs());
    const [leftInterval, setLeftInterval] = useState(2);
    const [rightInterval, setRightInterval] = useState(2);
    const [liveTime, setLiveTime] = useState(dayjs());
    const [isLoading, setIsLoading] = useState(false);

    const [departures, setDepartures] = useState([]);
    const [arrivals, setArrivals] = useState([]);

    useEffect(() => {
        const timer = setInterval(() => setLiveTime(dayjs()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        handleSearch();
    }, []);

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const timeParam = encodeURIComponent(searchTime.format('YYYY-MM-DDTHH:mm:ss'));

            const url = `https://localhost:7230/Client-API/TrainSearch/Search-Train-Routes-Through-Station/${selectedStation}?time=${timeParam}&left_interval=${leftInterval}&right_interval=${rightInterval}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error("Помилка при завантаженні даних з сервера");

            const data = await response.json();

            const departuresData = data
                .filter(item => item.departure_time_from_current_stop !== null)
                .map(item => ({
                    key: `dep-${item.train_race_id}`,
                    id: changeTrainRouteIdIntoUkrainian(item.train_route_id),
                    route: `${stationTitleIntoUkrainian(item.full_route_starting_station_title)} → ${stationTitleIntoUkrainian(item.full_route_ending_station_title)}`,
                    time: dayjs(item.departure_time_from_current_stop).format('HH:mm'),
                    platform: '-',
                    delay: 0
                }))
                .sort((a, b) => a.time.localeCompare(b.time));

            const arrivalsData = data
                .filter(item => item.arrival_time_to_current_stop !== null)
                .map(item => ({
                    key: `arr-${item.train_race_id}`,
                    id: changeTrainRouteIdIntoUkrainian(item.train_route_id),
                    route: `${stationTitleIntoUkrainian(item.full_route_starting_station_title)} → ${stationTitleIntoUkrainian(item.full_route_ending_station_title)}`,
                    time: dayjs(item.arrival_time_to_current_stop).format('HH:mm'),
                    platform: '-',
                    delay: 0
                }))
                .sort((a, b) => a.time.localeCompare(b.time));

            setDepartures(departuresData);
            setArrivals(arrivalsData);
            message.success(`Оновлено: ${data.length} рейсів знайдено`);

        } catch (error) {
            console.error(error);
            message.error("Не вдалося отримати дані для табло");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="board-container">
            <header className="board-header">
                <div className="header-left">
                    <Title level={2} className="station-title-in-schedule-board">
                        {stationTitleIntoUkrainian(selectedStation)}
                    </Title>
                </div>

                <div className="header-right">
                    <div className="clocks-container">
                        <div className="clock-wrapper live-theme">
                            <Text className="clock-label">ПОТОЧНИЙ ЧАС</Text>
                            <div className="clock-content">
                                <Title level={2} className="digital-clock">
                                    {liveTime.format('HH:mm:ss')}
                                </Title>
                                <Text className="clock-date">{liveTime.format('DD.MM.YYYY')}</Text>
                            </div>
                        </div>

                        <div className="clock-wrapper search-theme">
                            <Text className="clock-label">ЧАС ПОШУКУ</Text>
                            <div className="clock-content">
                                <Title level={2} className="digital-clock">
                                    {searchTime.format('HH:mm:ss')}
                                </Title>
                                <Text className="clock-date">{searchTime.format('DD.MM.YYYY')}</Text>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="board-controls">
                <Space size="middle" wrap>
                    <div className="control-item">
                        <Text className="control-label">Станція</Text>
                        <Select
                            showSearch
                            value={selectedStation}
                            onChange={setSelectedStation}
                            className="dark-select"
                            options={stationOptions}
                            optionFilterProp="label"
                        />
                    </div>

                    <div className="control-item">
                        <Text className="control-label">Дата та час</Text>
                        <DatePicker
                            showTime
                            value={searchTime}
                            onChange={(val) => val && setSearchTime(val)}
                            className="dark-datepicker"
                            format="YYYY-MM-DD HH:mm"
                            allowClear={false}
                        />
                    </div>

                    <div className="control-item">
                        <Text className="control-label">Інтервал (год)</Text>
                        <Space.Compact className="dark-compact">
                            <InputNumber
                                addonBefore="-"
                                value={leftInterval}
                                onChange={setLeftInterval}
                                min={0} max={24}
                            />
                            <InputNumber
                                addonBefore="+"
                                value={rightInterval}
                                onChange={setRightInterval}
                                min={0} max={24}
                            />
                        </Space.Compact>
                    </div>

                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={handleSearch}
                        loading={isLoading}
                        className="board-search-btn"
                    >
                        ОНОВИТИ ТАБЛО
                    </Button>
                </Space>
            </div>

            <div className="board-content">
                <Row gutter={32}>
                    {/* ПРИБУТТЯ тепер зліва */}
                    <Col span={12}>
                        <div className="column-header arrival-theme">
                            <RightOutlined /> ПРИБУТТЯ
                        </div>
                        <BoardTable data={arrivals} type="arrival" />
                    </Col>
                    {/* ВІДПРАВЛЕННЯ тепер справа */}
                    <Col span={12}>
                        <div className="column-header departure-theme">
                            {/* Прибрав icon-rotate-180, щоб стрілка вказувала направо (на виїзд) */}
                            <RightOutlined /> ВІДПРАВЛЕННЯ
                        </div>
                        <BoardTable data={departures} type="departure" />
                    </Col>
                </Row>
            </div>

            <footer className="board-footer">
                <Text className="footer-info">* Дані отримуються безпосередньо з системи керування залізницею.</Text>
            </footer>
        </div>
    );
};

export default StationBoard;