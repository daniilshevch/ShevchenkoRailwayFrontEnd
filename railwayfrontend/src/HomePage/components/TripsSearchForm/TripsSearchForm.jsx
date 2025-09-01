import React, {useRef, useState} from 'react';
import {Form, AutoComplete, DatePicker, Button, message} from 'antd';
import {useNavigate} from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import locale from 'antd/locale/uk_UA';
import { ConfigProvider } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { stationsList } from "../../../../SystemUtils/InterpreterDictionaries/StationsDictionary.js";
import './TripsSearchForm.css';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
dayjs.locale('uk');


const options = stationsList.map((station) => ({value: station.ukrainian, label: station.ukrainian}));

const TripSearchForm = ({initialStartStation = "", initialEndStation = "", initialTripDate = ""}) =>
{
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const startRef = useRef(null);
    const endRef = useRef(null);
    const dateRef = useRef(null);
    const [dateOpen, setDateOpen] = useState(false);

    const handleStationSwap = () =>
    {
        const startStationUkrainian = (form.getFieldValue("startStationUkrainian") || "").trim();
        const endStationUkrainian = (form.getFieldValue("endStationUkrainian") || "").trim();
        form.setFieldsValue({startStationUkrainian: endStationUkrainian, endStationUkrainian: startStationUkrainian});
    };
    const onFinish = (values) => {
        const {startStationUkrainian, endStationUkrainian, date} = values;
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
            <ConfigProvider locale={locale}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        startStationUkrainian: stationsList.find(s => s.english === initialStartStation)?.ukrainian || "",
                        endStationUkrainian: stationsList.find(s => s.english === initialEndStation)?.ukrainian || "",
                        date: initialTripDate ? dayjs(initialTripDate) : null
                    }}
                    className="trips-search-form antd"
                >
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
                                placeholder="Введіть початкову станцію поїздки"
                                classNames={{
                                    popup: {
                                        root: "trips-autocomplete-dropdown"
                                    }
                                }}
                                filterOption={(inputValue, option) =>
                                    option?.value?.toLowerCase().includes(inputValue.trim().toLowerCase())
                                }
                                onSelect={() => endRef.current?.focus()}
                                onKeyDown={(event) =>{ if (event.key === "Enter") endRef.current?.focus();}}
                            />
                        </Form.Item>
                        <div className="swap-row">
                            <Button
                                aria-label="Поміняти місцями станції"
                                shape="circle"
                                size= "middle"
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
                                placeholder="Введіть кінцеву станцію поїздки"
                                classNames={{
                                    popup: {
                                        root: "trips-autocomplete-dropdown"
                                    }
                                }}
                                filterOption={(inputValue, option) =>
                                    option?.value?.toLowerCase().includes(inputValue.trim().toLowerCase())
                                }
                                onSelect={() => {
                                    setDateOpen(true);
                                    dateRef.current?.focus();
                                }}
                            />
                        </Form.Item>
                    </div>
                    <Form.Item
                        label="Дата"
                        name="date"
                        spellCheck={false}
                        rules={[{ required: true, message: 'Оберіть дату відправлення' }]}
                    >
                        <DatePicker
                            ref={dateRef}
                            open={dateOpen}
                            onOpenChange={(o) => setDateOpen(o)}
                            format="dddd, DD MMMM YYYY"
                            placeholder = "Оберіть дату поїздки"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        ПОШУК КВИТКІВ
                    </Button>
                </Form>
            </ConfigProvider>
        </>
    );

}
export default TripSearchForm;