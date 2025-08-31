import React, {useRef, useState} from 'react';
import {Form, AutoComplete, DatePicker, Button, message} from 'antd';
import {useNavigate} from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import locale from 'antd/locale/uk_UA';
import { ConfigProvider } from 'antd';
import { SwapOutlined, SearchOutlined } from '@ant-design/icons';
import { stationsList } from "../../InterpreterDictionaries/StationsDictionary.js";
import './CompactTripsSearchForm.css';



const options = stationsList.map((station) => ({value: station.ukrainian, label: station.ukrainian}));

const CompactTripSearchForm = ({initialStartStation = "", initialEndStation = "", initialTripDate = ""}) =>
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
                    layout="inline"
                    onFinish={onFinish}
                    className="compact-trips-search-form"
                    initialValues={{
                        startStationUkrainian: stationsList.find(s => s.english === initialStartStation)?.ukrainian || '',
                        endStationUkrainian:   stationsList.find(s => s.english === initialEndStation)?.ukrainian   || '',
                        date: initialTripDate ? dayjs(initialTripDate) : null
                    }}
                >
                    <Form.Item
                        name="startStationUkrainian"
                        rules={[{ required: true, message: 'Вкажіть станцію відправлення' }]}
                        className="cts-item"
                    >
                        <AutoComplete
                            ref={startRef}
                            options={options}
                            placeholder="Звідки"
                            allowClear
                            spellCheck={false}
                            classNames={{ popup: { root: 'trips-autocomplete-dropdown' } }}
                            filterOption={(input, option) =>
                                option?.value?.toLowerCase().includes(input.trim().toLowerCase())
                            }
                            onSelect={() => endRef.current?.focus()}
                            onKeyDown={(e) => { if (e.key === 'Enter') endRef.current?.focus(); }}
                        />
                    </Form.Item>

                    <Button
                        aria-label="Поміняти місцями станції"
                        icon={<SwapOutlined />}
                        className="cts-swap"
                        onClick={handleStationSwap}
                        type="default"
                        size="middle"
                        shape="circle"
                    />

                    <Form.Item
                        name="endStationUkrainian"
                        rules={[{ required: true, message: 'Вкажіть станцію призначення' }]}
                        className="cts-item"
                    >
                        <AutoComplete
                            ref={endRef}
                            options={options}
                            placeholder="Куди"
                            allowClear
                            spellCheck={false}
                            classNames={{ popup: { root: 'trips-autocomplete-dropdown' } }}
                            filterOption={(input, option) =>
                                option?.value?.toLowerCase().includes(input.trim().toLowerCase())
                            }
                            onSelect={() => { setDateOpen(true); dateRef.current?.focus(); }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') { setDateOpen(true); dateRef.current?.focus(); }
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="date"
                        rules={[{ required: true, message: 'Оберіть дату відправлення' }]}
                        className="cts-item"
                    >
                        <DatePicker
                            ref={dateRef}
                            open={dateOpen}
                            onOpenChange={(o) => setDateOpen(o)}
                            placeholder="Дата"
                            format="dddd, DD MMMM YYYY"
                            style={{ width: 220 }}
                        />
                    </Form.Item>

                    <Form.Item className="cts-submit">
                        <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                            ОНОВИТИ ДАНІ
                        </Button>
                    </Form.Item>
                </Form>
            </ConfigProvider>
        </>
    );
};

export default CompactTripSearchForm;