import React, { useRef, useState } from 'react';
import { Form, AutoComplete, DatePicker, Button, message, Input, ConfigProvider } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import locale from 'antd/locale/uk_UA';
import { SwapOutlined, EnvironmentOutlined, CalendarOutlined, SearchOutlined } from '@ant-design/icons';
import { stationsList } from "../../../../SystemUtils/InterpreterMethodsAndDictionaries/StationsDictionary.js";
import './TripsSearchForm.css';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
dayjs.locale('uk');

const options = stationsList.map((station) => ({ value: station.ukrainian, label: station.ukrainian }));

const TripSearchForm = ({ initialStartStation = "", initialEndStation = "", initialTripDate = "" }) => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const startRef = useRef(null);
    const endRef = useRef(null);
    const dateRef = useRef(null);
    const [dateOpen, setDateOpen] = useState(false);

    const handleStationSwap = () => {
        const startStationUkrainian = (form.getFieldValue("startStationUkrainian") || "").trim();
        const endStationUkrainian = (form.getFieldValue("endStationUkrainian") || "").trim();
        form.setFieldsValue({ startStationUkrainian: endStationUkrainian, endStationUkrainian: startStationUkrainian });
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
                        colorPrimary: '#1890ff',
                        borderRadius: 8,
                        fontFamily: "'Inter', 'Segoe UI', sans-serif",
                    }
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        startStationUkrainian: stationsList.find(s => s.english === initialStartStation)?.ukrainian || "",
                        endStationUkrainian: stationsList.find(s => s.english === initialEndStation)?.ukrainian || "",
                        date: initialTripDate ? dayjs(initialTripDate) : null
                    }}
                    className="trips-search-form"
                >
                    <div className="form-header">
                        <h3>Пошук квитків</h3>
                    </div>

                    <div className="stations-container">
                        <Form.Item
                            label="Звідки"
                            name="startStationUkrainian"
                            rules={[{ required: true, message: 'Вкажіть станцію відправлення' }]}
                        >
                            <AutoComplete
                                ref={startRef}
                                spellCheck={false}
                                options={options}
                                popupClassName="trips-autocomplete-dropdown"
                                classNames={{ popup: "trips-autocomplete-dropdown" }}
                                filterOption={(inputValue, option) =>
                                    option?.value?.toLowerCase().includes(inputValue.trim().toLowerCase())
                                }
                                onSelect={() => endRef.current?.focus()}
                                onKeyDown={(event) => { if (event.key === "Enter") endRef.current?.focus(); }}
                            >
                                <Input
                                    size="large"
                                    prefix={<EnvironmentOutlined className="input-icon" />}
                                    placeholder="Звідки їдемо?"
                                />
                            </AutoComplete>
                        </Form.Item>

                        <div className="swap-row">
                            <Button
                                aria-label="Поміняти місцями станції"
                                shape="circle"
                                size="large"
                                icon={<SwapOutlined />}
                                onClick={handleStationSwap}
                                className="swap-button"
                            />
                        </div>

                        <Form.Item
                            label="Куди"
                            name="endStationUkrainian"
                            rules={[{ required: true, message: 'Вкажіть станцію призначення' }]}
                        >
                            <AutoComplete
                                ref={endRef}
                                spellCheck={false}
                                options={options}
                                popupClassName="trips-autocomplete-dropdown"
                                classNames={{ popup: "trips-autocomplete-dropdown" }}
                                filterOption={(inputValue, option) =>
                                    option?.value?.toLowerCase().includes(inputValue.trim().toLowerCase())
                                }
                                onSelect={() => {
                                    setDateOpen(true);
                                    dateRef.current?.focus();
                                }}
                            >
                                <Input
                                    size="large"
                                    prefix={<EnvironmentOutlined className="input-icon" />}
                                    placeholder="Куди прямуємо?"
                                />
                            </AutoComplete>
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="Дата відправлення"
                        name="date"
                        spellCheck={false}
                        rules={[{ required: true, message: 'Оберіть дату відправлення' }]}
                    >
                        <DatePicker
                            size="large"
                            ref={dateRef}
                            open={dateOpen}
                            onOpenChange={(o) => setDateOpen(o)}
                            format="dddd, DD MMMM YYYY"
                            placeholder="Оберіть дату"
                            style={{ width: '100%' }}
                            suffixIcon={<CalendarOutlined className="input-icon" />}
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                        className="search-submit-btn"
                        icon={<SearchOutlined />}
                    >
                        Знайти квитки
                    </Button>
                </Form>
            </ConfigProvider>
        </>
    );
}

export default TripSearchForm;