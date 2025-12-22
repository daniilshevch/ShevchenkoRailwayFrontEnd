import React, { useRef, useState, useEffect } from 'react';
import { Form, AutoComplete, DatePicker, Button, message, Input, ConfigProvider, Popover, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import locale from 'antd/locale/uk_UA';
import { SwapOutlined, SearchOutlined, EnvironmentOutlined, CalendarOutlined, FilterOutlined } from '@ant-design/icons';
import { stationsList } from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/StationsDictionary.js";
import './CompactTripsSearchForm.css';

const options = stationsList.map((station) => ({ value: station.ukrainian, label: station.ukrainian }));

const CompactTripSearchForm = ({
                                   initialStartStation = "",
                                   initialEndStation = "",
                                   initialTripDate = "",
                                   onShowTrainsWithoutFreePlacesChange
}) => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const startRef = useRef(null);
    const endRef = useRef(null);
    const dateRef = useRef(null);
    const [dateOpen, setDateOpen] = useState(false);
    const [showTrainsWithoutFreePlaces, setShowTrainsWithoutFreePlaces] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            startStationUkrainian: stationsList.find(s => s.english === initialStartStation)?.ukrainian || '',
            endStationUkrainian: stationsList.find(s => s.english === initialEndStation)?.ukrainian || '',
            date: initialTripDate ? dayjs(initialTripDate) : null
        });
    }, [initialStartStation, initialEndStation, initialTripDate, form]);

    const handleStationSwap = () => {
        const startStationUkrainian = (form.getFieldValue("startStationUkrainian") || "").trim();
        const endStationUkrainian = (form.getFieldValue("endStationUkrainian") || "").trim();
        form.setFieldsValue({ startStationUkrainian: endStationUkrainian, endStationUkrainian: startStationUkrainian });
    };
    const handleShowTrainsWithoutFreePlacesChange = (e) => {
        const checked = e.target.checked;
        setShowTrainsWithoutFreePlaces(checked);
        if (onShowTrainsWithoutFreePlacesChange) {
            onShowTrainsWithoutFreePlacesChange(checked);
        }
    };

    const onFinish = (values) => {
        const { startStationUkrainian, endStationUkrainian, date } = values;
        const startStation = stationsList.find(station => station.ukrainian === startStationUkrainian)?.english;
        const endStation = stationsList.find(station => station.ukrainian === endStationUkrainian)?.english;
        if (!startStation || !endStation) {
            messageApi.error("Оберіть станції зі списку підказок");
            return;
        }
        const departureDate = dayjs(date).format('YYYY-MM-DD');
        const url = `/search-trips/${encodeURIComponent(startStation)}/${encodeURIComponent(endStation)}?departure-date=${departureDate}`;
        navigate(url);
    }

    return (
        <>
            {contextHolder}
            <ConfigProvider
                locale={locale}
                theme={{
                    token: {
                        colorPrimary: '#0052cc',
                        borderRadius: 8,
                        fontFamily: "'Inter', 'Segoe UI', sans-serif",
                    }
                }}
            >
                <div className="compact-form-container">
                    <Form
                        form={form}
                        layout="inline"
                        onFinish={onFinish}
                        className="compact-trips-search-form"
                        initialValues={{
                            startStationUkrainian: stationsList.find(s => s.english === initialStartStation)?.ukrainian || '',
                            endStationUkrainian: stationsList.find(s => s.english === initialEndStation)?.ukrainian || '',
                            date: initialTripDate ? dayjs(initialTripDate) : null
                        }}
                    >
                        {/* ... (Інші Form.Item залишаються без змін) ... */}

                        <Form.Item
                            name="startStationUkrainian"
                            rules={[{ required: true, message: 'Вкажіть звідки' }]}
                            className="cts-item"
                        >
                            <AutoComplete
                                ref={startRef}
                                options={options}
                                spellCheck={false}
                                popupClassName="trips-autocomplete-dropdown"
                                filterOption={(input, option) =>
                                    option?.value?.toLowerCase().includes(input.trim().toLowerCase())
                                }
                                onSelect={() => endRef.current?.focus()}
                            >
                                <Input
                                    size="large"
                                    prefix={<EnvironmentOutlined className="compact-icon" />}
                                    placeholder="Звідки"
                                />
                            </AutoComplete>
                        </Form.Item>

                        <div className="cts-swap-container">
                            <Button
                                aria-label="Поміняти місцями"
                                icon={<SwapOutlined />}
                                className="cts-swap-btn"
                                onClick={handleStationSwap}
                                shape="circle"
                            />
                        </div>

                        <Form.Item
                            name="endStationUkrainian"
                            rules={[{ required: true, message: 'Вкажіть куди' }]}
                            className="cts-item"
                        >
                            <AutoComplete
                                ref={endRef}
                                options={options}
                                spellCheck={false}
                                popupClassName="trips-autocomplete-dropdown"
                                filterOption={(input, option) =>
                                    option?.value?.toLowerCase().includes(input.trim().toLowerCase())
                                }
                                onSelect={() => { setDateOpen(true); dateRef.current?.focus(); }}
                            >
                                <Input
                                    size="large"
                                    prefix={<EnvironmentOutlined className="compact-icon" />}
                                    placeholder="Куди"
                                />
                            </AutoComplete>
                        </Form.Item>

                        <Form.Item
                            name="date"
                            rules={[{ required: true, message: 'Оберіть дату' }]}
                            className="cts-item cts-date"
                        >
                            <DatePicker
                                ref={dateRef}
                                size="large"
                                open={dateOpen}
                                onOpenChange={(o) => setDateOpen(o)}
                                placeholder="Дата поїздки"
                                format="DD MMMM YYYY"
                                suffixIcon={<CalendarOutlined className="compact-icon" />}
                            />
                        </Form.Item>

                        {/* --- ТУТ ОСНОВНІ ЗМІНИ --- */}
                        <Form.Item className="cts-submit">
                            {/* Обгортка div для горизонтального розміщення кнопок */}
                            <div style={{ display: 'flex', gap: '8px' }}>

                                <Popover
                                    content={
                                        <div style={{ padding: '4px 0' }}>
                                            <Checkbox
                                                checked={showTrainsWithoutFreePlaces}
                                                onChange={handleShowTrainsWithoutFreePlacesChange}
                                            >
                                                Без вільних місць
                                            </Checkbox>
                                        </div>
                                    }
                                    trigger="hover"
                                    placement="bottomRight"
                                >
                                    <Button
                                        icon={<FilterOutlined />}
                                        size="large"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontWeight: 500,

                                            // Гібридна логіка:
                                            // 1. Фон: Сірий (якщо вимкнено) / Світло-блакитний (якщо увімкнено)
                                            backgroundColor: showTrainsWithoutFreePlaces ? '#e6f7ff' : '#f5f5f5',

                                            // 2. Текст: Темно-сірий / Яскраво-синій
                                            color: showTrainsWithoutFreePlaces ? '#0052cc' : '#595959',

                                            // 3. Рамка: Прозора (щоб кнопка не "стрибала") / Синя
                                            border: `1px solid ${showTrainsWithoutFreePlaces ? '#0052cc' : 'transparent'}`,

                                            transition: 'all 0.3s' // Плавна анімація переходу кольорів
                                        }}
                                    >
                                        Фільтри
                                    </Button>
                                </Popover>

                                {/* Кнопка пошуку */}
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SearchOutlined />}
                                    size="large"
                                    className="compact-search-btn"
                                >
                                    Знайти
                                </Button>
                            </div>
                        </Form.Item>
                        {/* --- КІНЕЦЬ ЗМІН --- */}

                    </Form>
                </div>
            </ConfigProvider>
        </>
    );
};

export default CompactTripSearchForm;