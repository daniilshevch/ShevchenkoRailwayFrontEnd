import { Form, Input, message, Modal, Switch, Row, Col, Divider, InputNumber } from "antd";
import { PlusCircleOutlined, SettingOutlined, SafetyOutlined } from '@ant-design/icons';
import React, { useState } from "react";

function AdminCarriageAssignmentsCreateForm({ train_race_id, fetchCarriageAssignments, isCreateModalVisible, setIsCreateModalVisible }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [createForm] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        try {
            const values = await createForm.validateFields();
            setLoading(true);
            const token = localStorage.getItem('token');

            const payload = {
                train_route_on_date_id: train_race_id,
                ...values
            };

            const response = await fetch(`https://localhost:7230/Admin-API/assign-carriage-to-train-race-squad`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Додано авторизацію
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Помилка при призначенні вагону');

            messageApi.success(`Вагон ${values.passenger_carriage_id} успішно призначено в склад`);
            setIsCreateModalVisible(false);
            createForm.resetFields();
            fetchCarriageAssignments();
        } catch (err) {
            messageApi.error(err.message || "Сталася помилка");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {contextHolder}
            <Modal
                title={<span><PlusCircleOutlined /> Призначення нового вагону</span>}
                open={isCreateModalVisible}
                onCancel={() => {
                    setIsCreateModalVisible(false);
                    createForm.resetFields();
                }}
                onOk={handleCreate}
                confirmLoading={loading}
                okText="Додати в склад"
                cancelText="Відміна"
                width={650}
                centered
            >
                <Form form={createForm} layout="vertical">
                    <Divider orientation="left" plain><SettingOutlined /> Ідентифікація</Divider>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="ID вагону" name="passenger_carriage_id" rules={[{ required: true, message: 'Вкажіть ID вагону' }]}>
                                <Input placeholder="Наприклад: 01634536" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Номер у складі (позиція)" name="position_in_squad" rules={[{ required: true, message: 'Вкажіть номер у складі' }]}>
                                <InputNumber className = "custom-coeff-input" style={{ width: '100%' }} min={1} placeholder="1" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left" plain><SafetyOutlined /> Характеристики та комфорт</Divider>
                    <Row gutter={[16, 8]}>
                        <Col span={8}>
                            <Form.Item label="Жіночий" name="is_for_woman" valuePropName="checked">
                                <Switch checkedChildren="ТАК" unCheckedChildren="НІ" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Дитячий" name="is_for_children" valuePropName="checked">
                                <Switch checkedChildren="ТАК" unCheckedChildren="НІ" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="WI-FI" name="factual_wi_fi" valuePropName="checked">
                                <Switch checkedChildren="ТАК" unCheckedChildren="НІ" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Кондиціонер" name="factual_air_conditioning" valuePropName="checked">
                                <Switch checkedChildren="ТАК" unCheckedChildren="НІ" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Інклюзивний" name="factual_is_inclusive" valuePropName="checked">
                                <Switch checkedChildren="ТАК" unCheckedChildren="НІ" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Душ" name="factual_shower_availability" valuePropName="checked">
                                <Switch checkedChildren="ТАК" unCheckedChildren="НІ" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Продаж їжі" name="food_availability" valuePropName="checked">
                                <Switch checkedChildren="ТАК" unCheckedChildren="НІ" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
}

export default AdminCarriageAssignmentsCreateForm;