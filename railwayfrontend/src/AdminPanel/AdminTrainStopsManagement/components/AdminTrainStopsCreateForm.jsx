import { DatePicker, Form, Input, message, Modal, AutoComplete, Switch, Divider, Row, Col, Space } from "antd";
import React, { useEffect, useState } from "react";
import { PlusCircleOutlined, EnvironmentOutlined, ClockCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { stationsList, stationTitleIntoUkrainian } from "../../../../SystemUtils/InterpreterMethodsAndDictionaries/StationsDictionary.js";
import dayjs from 'dayjs';
import { parseTrainRaceId } from "../../GeneralComponents/TrainRaceIdParser.js";

const options = stationsList.map((station) => ({ value: station.ukrainian, label: station.ukrainian }));

function AdminTrainStopsCreateForm({ train_race_id, fetchTrainStops, isCreateModalVisible, setIsCreateModalVisible }) {
    const [createForm] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);

    const isStartStop = Form.useWatch("is_starting_stop", createForm) ?? false;
    const isEndStop = Form.useWatch("is_ending_stop", createForm) ?? false;

    // Оригінальна логіка очищення часу при перемиканні Switch
    useEffect(() => {
        if (isStartStop) createForm.setFieldsValue({ arrival_time: null });
        if (isEndStop) createForm.setFieldsValue({ departure_time: null });
    }, [isStartStop, isEndStop, createForm]);

    const handleCreate = async () => {
        try {
            const values = await createForm.validateFields();
            setLoading(true);
            const token = localStorage.getItem('token');

            const toLocalTimeFormat = (time) => time ? time.format("YYYY-MM-DDTHH:mm:ss") : null;
            let stationTitle = stationsList.find(station => station.ukrainian === values.station_title)?.english;

            const payload = {
                ...values,
                train_route_on_date_id: train_race_id,
                station_title: stationTitle,
                arrival_time: toLocalTimeFormat(values.arrival_time),
                departure_time: toLocalTimeFormat(values.departure_time),
                stop_type: 0,
            };

            const response = await fetch(`https://localhost:7230/Admin-API/add-train-stop-for-train-race`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Помилка при створенні зупинки');

            messageApi.success(`Зупинку ${stationTitleIntoUkrainian(stationTitle)} створено`);
            setIsCreateModalVisible(false);
            createForm.resetFields();
            fetchTrainStops();
        } catch (err) {
            messageApi.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {contextHolder}
            <Modal
                title={<span><PlusCircleOutlined /> Додати зупинку в розклад</span>}
                open={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                onOk={handleCreate}
                confirmLoading={loading}
                okText="Створити"
                width={650}
                centered
            >
                <Form
                    form={createForm}
                    layout="vertical"
                    initialValues={{
                        arrival_time: dayjs(`${parseTrainRaceId(train_race_id).date} 00:00`, 'YYYY-MM-DD HH:mm'),
                        departure_time: dayjs(`${parseTrainRaceId(train_race_id).date} 00:00`, 'YYYY-MM-DD HH:mm'),
                        is_starting_stop: false,
                        is_ending_stop: false
                    }}
                >
                    <Divider orientation="left" plain><EnvironmentOutlined /> Локація</Divider>
                    <Form.Item label="Назва зупинки" name="station_title" rules={[{ required: true, message: 'Вкажіть назву зупинки' }]}>
                        <AutoComplete
                            options={options}
                            placeholder="Почніть вводити назву станції українською..."
                            filterOption={(inputValue, option) => option?.value?.toLowerCase().includes(inputValue.toLowerCase())}
                        />
                    </Form.Item>

                    <Divider orientation="left" plain><ClockCircleOutlined /> Часовий графік</Divider>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Form.Item label="Початкова зупинка" name="is_starting_stop" valuePropName="checked" style={{ marginBottom: 8 }}>
                                    <Switch checkedChildren="ТАК" unCheckedChildren="НІ" />
                                </Form.Item>
                                <Form.Item label="Час прибуття" name="arrival_time">
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: "100%" }} disabled={isStartStop} />
                                </Form.Item>
                            </Space>
                        </Col>
                        <Col span={12}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Form.Item label="Кінцева зупинка" name="is_ending_stop" valuePropName="checked" style={{ marginBottom: 8 }}>
                                    <Switch checkedChildren="ТАК" unCheckedChildren="НІ" />
                                </Form.Item>
                                <Form.Item label="Час відправлення" name="departure_time">
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: "100%" }} disabled={isEndStop} />
                                </Form.Item>
                            </Space>
                        </Col>
                    </Row>

                    <Divider orientation="left" plain><SettingOutlined /> Технічні дані</Divider>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Відстань від початку (км)" name="distance_from_starting_station">
                                <Input type="number" placeholder="0.0" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
}

export default AdminTrainStopsCreateForm;