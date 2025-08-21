import React from 'react';
import {Form, AutoComplete, DatePicker, Button, message} from 'antd';
import {useNavigate} from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import locale from 'antd/locale/uk_UA';
import { ConfigProvider } from 'antd';
import { stationsList } from "../../InterpreterDictionaries/StationsDictionary.js";
import BackgroundImageCarousel from "../HomePageComponents/BackgroundImageCarousel.jsx";
import './TripsSearchForm.css';

const options = stationsList.map((station) => ({value: station.ukrainian, label: station.ukrainian}));

const TripSearchForm = ({initialStartStation = "", initialEndStation = "", initialTripDate = ""}) =>
{
    const navigate = useNavigate();
    const onFinish = (values) => {
        const {startUkrainian, endUkrainian, date} = values;
        const startStation = stationsList.find(station => station.ukrainian === startUkrainian)?.english;
        const endStation = stationsList.find(station => station.ukrainian === endUkrainian)?.english;
        if (!startStation || !endStation) {
            message.error("Оберіть станції зі списку підказок");
            return;
        }
        const departureDate = dayjs(date).format('YYYY-MM-DD');
        const url = `/search-trips/${encodeURIComponent(startStation)}/${encodeURIComponent(endStation)}?departure-date=${departureDate}`;
        console.log("works");
        navigate(url);
    }
    return (
        <ConfigProvider locale={locale}>
            <Form
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    startUkrainian: stationsList.find(s => s.english === initialStartStation)?.ukrainian || "",
                    endUkrainian: stationsList.find(s => s.english === initialEndStation)?.ukrainian || "",
                    date: initialTripDate ? dayjs(initialTripDate) : null
                }}
                className="trips-search-form antd"
            >
                <Form.Item
                    label="Звідки"
                    name="startUkrainian"
                    rules={[{ required: true, message: 'Вкажіть станцію відправлення' }]}
                >
                    <AutoComplete
                        options={options}
                        placeholder="Почніть вводити станцію"
                        filterOption={(inputValue, option) =>
                            option?.value?.toLowerCase().includes(inputValue.toLowerCase())
                        }
                    />
                </Form.Item>

                <Form.Item
                    label="Куди"
                    name="endUkrainian"
                    rules={[{ required: true, message: 'Вкажіть станцію призначення' }]}
                >
                    <AutoComplete
                        options={options}
                        placeholder="Почніть вводити станцію"
                        filterOption={(inputValue, option) =>
                            option?.value?.toLowerCase().includes(inputValue.toLowerCase())
                        }
                    />
                </Form.Item>

                <Form.Item
                    label="Дата"
                    name="date"
                    rules={[{ required: true, message: 'Оберіть дату відправлення' }]}
                >
                    <DatePicker
                        format="YYYY-MM-DD"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Button type="primary" htmlType="submit" block>
                    ПОШУК КВИТКІВ
                </Button>
            </Form>
        </ConfigProvider>
    );

}
export default TripSearchForm;