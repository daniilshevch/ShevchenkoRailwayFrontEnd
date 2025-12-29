import { DatePicker, Form, Input, message, Modal, Divider, Row, Col, InputNumber } from "antd";
import { CalendarOutlined, PercentageOutlined, RocketOutlined } from '@ant-design/icons';
import React, { useState } from "react";

function AdminTrainRacesCreateForm({ train_route_id, fetchRaces, isCreateModalVisible, setIsCreateModalVisible }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [createForm] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        try {
            const values = await createForm.validateFields();
            setLoading(true);
            const token = localStorage.getItem('token');

            const payload = {
                train_route_id: train_route_id,
                departure_date: values.departure_date.format("YYYY-MM-DD"),
                train_race_coefficient: parseFloat(values.train_race_coefficient),
            };

            const response = await fetch(`https://localhost:7230/Admin-API/add-train-race`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Не вдалося створити новий рейс');

            const result = await response.json();
            messageApi.success(`Рейс ${result.id} успішно додано до розкладу`);

            setIsCreateModalVisible(false);
            createForm.resetFields();
            fetchRaces();
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
                title={<span><RocketOutlined /> Новий рейс для маршруту {train_route_id}</span>}
                open={isCreateModalVisible}
                onCancel={() => {
                    setIsCreateModalVisible(false);
                    createForm.resetFields();
                }}
                onOk={handleCreate}
                confirmLoading={loading}
                okText="Створити рейс"
                cancelText="Скасувати"
                centered
            >
                <Form
                    form={createForm}
                    layout="vertical"
                    initialValues={{ train_race_coefficient: 1.0 }}
                >
                    <Divider orientation="left" plain><CalendarOutlined /> Час відправлення</Divider>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Дата відправлення"
                                name="departure_date"
                                rules={[{ required: true, message: 'Будь ласка, оберіть дату' }]}
                            >
                                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} size="large" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left" plain><PercentageOutlined /> Економічні показники</Divider>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Коефіцієнт вартості рейсу"
                                name="train_race_coefficient"
                                tooltip="Додатковий множник ціни саме для цього дня"
                            >
                                <InputNumber className="custom-coeff-input" style={{ width: '100%' }} step={0.1} min={0.1} size="large" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
}

export default AdminTrainRacesCreateForm;