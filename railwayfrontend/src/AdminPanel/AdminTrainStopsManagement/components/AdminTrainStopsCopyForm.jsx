import { DatePicker, Form, Input, message, Modal, Divider, Row, Col, Alert, Radio, TimePicker } from "antd";
import { CopyOutlined, HistoryOutlined, SwapOutlined, WarningOutlined, RetweetOutlined, ClockCircleOutlined } from '@ant-design/icons';
import React, { useState } from "react";
import { parseTrainRaceId } from "../../GeneralComponents/TrainRaceIdParser.js";
import dayjs from "dayjs";

function AdminTrainStopsCopyForm({ train_race_id, fetchTrainStops, isCopyScheduleModalVisible, setIsCopyScheduleModalVisible }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [copyScheduleForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [copyType, setCopyType] = useState('normal'); // 'normal' або 'inverted'

    const handleScheduleCopy = async () => {
        try {
            const values = await copyScheduleForm.validateFields();
            setLoading(true);
            const token = localStorage.getItem('token');

            // Парсинг цільового рейсу
            const parsedTarget = parseTrainRaceId(train_race_id);
            const new_train_route_id = parsedTarget.trainRouteId;
            const new_date = parsedTarget.date; // "YYYY-MM-DD"

            // Дані прототипу
            const prototype_train_route_id = values.prototype_train_route_id;
            const prototype_date = values.prototype_date.format("YYYY-MM-DD");

            let url = "";

            if (copyType === 'normal') {
                // Звичайне копіювання
                url = `https://localhost:7230/Admin-API/TrainAssignment/Copy-Train-With-Schedule?` +
                    `prototype_train_route_id=${prototype_train_route_id}&` +
                    `new_train_route_id=${new_train_route_id}&` +
                    `prototype_date=${prototype_date}&` +
                    `new_date=${new_date}&` +
                    `creation_option=false`;
            } else {
                // Інвертоване копіювання
                // Формуємо DateTime для нового відправлення: дата цільового рейсу + обраний час
                const departureTime = values.new_departure_time.format("HH:mm:ss");
                const new_date_and_departure_time = `${new_date}T${departureTime}`;

                url = `https://localhost:7230/Admin-API/TrainAssignment/Copy-Train-With-Inverted-Schedule?` +
                    `prototype_train_route_id=${prototype_train_route_id}&` +
                    `new_inverted_train_route_id=${new_train_route_id}&` +
                    `prototype_date=${prototype_date}&` +
                    `new_date_and_departure_time=${encodeURIComponent(new_date_and_departure_time)}&` +
                    `creation_option=false`;
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Помилка при копіюванні розкладу');
            }

            messageApi.success(copyType === 'normal' ? 'Розклад успішно скопійовано' : 'Інвертований розклад успішно створено');
            setIsCopyScheduleModalVisible(false);
            copyScheduleForm.resetFields();
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
                title={
                    <span>
                        {copyType === 'normal' ? <CopyOutlined /> : <RetweetOutlined />}
                        {copyType === 'normal' ? " Скопіювати розклад з прототипу" : " Створити зворотний рейс (Інверсія)"}
                    </span>
                }
                open={isCopyScheduleModalVisible}
                onCancel={() => setIsCopyScheduleModalVisible(false)}
                onOk={handleScheduleCopy}
                confirmLoading={loading}
                okText="Виконати копіювання"
                okButtonProps={{ style: { backgroundColor: copyType === 'normal' ? '#722ed1' : '#fa8c16' } }}
                centered
                width={500}
            >
                <div style={{ marginBottom: 20, textAlign: 'center' }}>
                    <Radio.Group
                        value={copyType}
                        onChange={(e) => setCopyType(e.target.value)}
                        buttonStyle="solid"
                    >
                        <Radio.Button value="normal">Звичайне</Radio.Button>
                        <Radio.Button value="inverted">Інвертоване (Зворотний рейс)</Radio.Button>
                    </Radio.Group>
                </div>

                <Alert
                    message={copyType === 'normal' ? "Пряме копіювання" : "Інвертування маршруту"}
                    description={
                        copyType === 'normal'
                            ? "Розклад буде перенесено 1-в-1 з коригуванням дати."
                            : "Система розгорне станції у зворотному порядку та перерахує час на основі нового часу відправлення."
                    }
                    type={copyType === 'normal' ? "info" : "warning"}
                    showIcon
                    style={{ marginBottom: 20 }}
                />

                <Form form={copyScheduleForm} layout="vertical">
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label={<span><SwapOutlined /> ID маршруту-прототипу</span>}
                                name="prototype_train_route_id"
                                rules={[{ required: true, message: 'Вкажіть ID маршруту-прототипу' }]}
                            >
                                <Input placeholder="Наприклад: 12SH" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span><HistoryOutlined /> Дата прототипу</span>}
                                name="prototype_date"
                                rules={[{ required: true, message: 'Вкажіть дату' }]}
                            >
                                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        {/* Поле часу з'являється лише при інверсії */}
                        {copyType === 'inverted' && (
                            <Col span={12}>
                                <Form.Item
                                    label={<span><ClockCircleOutlined /> Час відправлення</span>}
                                    name="new_departure_time"
                                    rules={[{ required: true, message: 'Вкажіть час відправлення' }]}
                                    initialValue={dayjs('08:00', 'HH:mm')}
                                >
                                    <TimePicker format="HH:mm" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        )}
                    </Row>
                </Form>
            </Modal>
        </>
    );
}

export default AdminTrainStopsCopyForm;