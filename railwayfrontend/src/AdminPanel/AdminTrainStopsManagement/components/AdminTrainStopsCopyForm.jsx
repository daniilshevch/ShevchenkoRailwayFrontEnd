import { DatePicker, Form, Input, message, Modal, Divider, Row, Col, Alert } from "antd";
import { CopyOutlined, HistoryOutlined, SwapOutlined, WarningOutlined } from '@ant-design/icons';
import React, { useState } from "react";
import { parseTrainRaceId } from "../../GeneralComponents/TrainRaceIdParser.js";

function AdminTrainStopsCopyForm({ train_race_id, fetchTrainStops, isCopyScheduleModalVisible, setIsCopyScheduleModalVisible }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [copyScheduleForm] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleScheduleCopy = async () => {
        try {
            const values = await copyScheduleForm.validateFields();
            setLoading(true);
            const token = localStorage.getItem('token');

            // Оригінальна логіка парсингу ID та дати
            const prototype_train_route_id = values.prototype_train_route_id;
            const new_train_route_id = parseTrainRaceId(train_race_id).trainRouteId;
            const prototype_date = values.prototype_date.format("YYYY-MM-DD");
            const new_date = parseTrainRaceId(train_race_id).date;

            // Оригінальний URL з вашого коду
            const url = `https://localhost:7230/Admin-API/TrainAssignment/Copy-Train-With-Schedule?prototype_train_route_id=${prototype_train_route_id}&new_train_route_id=${new_train_route_id}&prototype_date=${prototype_date}&new_date=${new_date}&creation_option=false`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Помилка при копіюванні складу поїзду');

            messageApi.success('Склад поїзда успішно скопійовано');
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
                title={<span><CopyOutlined /> Скопіювати розклад з прототипу</span>}
                open={isCopyScheduleModalVisible}
                onCancel={() => setIsCopyScheduleModalVisible(false)}
                onOk={handleScheduleCopy}
                confirmLoading={loading}
                okText="Скопіювати склад"
                okButtonProps={{ style: { backgroundColor: '#722ed1' } }}
                centered
            >
                <Alert
                    message="Важлива примітка"
                    description="Розклад буде скопійовано для маршруту поїзда разом із зупинками. Переконайтеся, що ID прототипу вказано вірно."
                    type="info"
                    showIcon
                    icon={<WarningOutlined />}
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
                        <Col span={24}>
                            <Form.Item
                                label={<span><HistoryOutlined /> Дата відправлення рейсу-прототипу</span>}
                                name="prototype_date"
                                rules={[{ required: true, message: 'Вкажіть дату відправлення рейсу-прототипу' }]}
                            >
                                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
}

export default AdminTrainStopsCopyForm;