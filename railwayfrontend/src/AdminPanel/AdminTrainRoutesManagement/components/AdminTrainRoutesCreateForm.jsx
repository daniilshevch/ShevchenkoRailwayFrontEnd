import React, { useState } from "react";
import { Form, Input, message, Modal, Select, Switch, Row, Col, InputNumber, Divider } from "antd";
import {
    InfoCircleOutlined,
    GlobalOutlined,
    RocketOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { enumOptions, enumOptionsForStrings } from "../../GeneralComponents/EnumOptionConvertion.jsx";
import {
    ASSIGNMENT_TYPE_OPTIONS,
    FREQUENCY_TYPE_OPTIONS,
    RAILWAY_BRANCH_OPTIONS,
    SPEED_TYPE_OPTIONS,
    TRAIN_QUALITY_CLASS_OPTIONS,
    TRIP_TYPE_OPTIONS
} from "./AdminTrainRoutesEnums.js";

function AdminTrainRoutesCreateForm({ fetchRoutes, isCreateModalVisible, setIsCreateModalVisible }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [createForm] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        try {
            const values = await createForm.validateFields();
            setLoading(true);

            const token = localStorage.getItem('token');
            const response = await fetch(`https://localhost:7230/Admin-API/add-train-route/${values.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Помилка при створенні маршруту');
            }

            messageApi.success(`Маршрут ${values.id} успішно створено`);
            setIsCreateModalVisible(false);
            createForm.resetFields();
            fetchRoutes();
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
                title={<span><RocketOutlined /> Створення нового маршруту</span>}
                open={isCreateModalVisible}
                onCancel={() => {
                    setIsCreateModalVisible(false);
                    createForm.resetFields();
                }}
                onOk={handleCreate}
                confirmLoading={loading}
                okText="Створити"
                cancelText="Відміна"
                width={700}
                centered
            >
                <Divider orientation="left" plain style={{ marginTop: 0 }}>
                    <InfoCircleOutlined /> Основна інформація
                </Divider>

                <Form
                    form={createForm}
                    layout="vertical"
                    initialValues={{
                        is_branded: false,
                        train_route_coefficient: 1.0,
                        quality_class: 2
                    }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="ID Маршруту (номер)"
                                name="id"
                                rules={[{ required: true, message: 'Вкажіть номер маршруту' }]}
                            >
                                <Input placeholder="Наприклад: 001К" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Фірмова назва" name="branded_name">
                                <Input placeholder="Наприклад: Western Express" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Залізнична філія"
                                name="railway_branch_title"
                                rules={[{ required: true, message: 'Оберіть філію' }]}
                            >
                                <Select placeholder="Оберіть філію">
                                    {enumOptionsForStrings(RAILWAY_BRANCH_OPTIONS)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Коефіцієнт ціни" name="train_route_coefficient">
                                <InputNumber style={{ width: '100%'}} className="custom-coeff-input"  step={0.1} min={0.5} max={5.0}  />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left" plain>
                        <GlobalOutlined /> Характеристики подорожі
                    </Divider>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Клас якості" name="quality_class" rules={[{ required: true }]}>
                                <Select>{enumOptions(TRAIN_QUALITY_CLASS_OPTIONS)}</Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Тип подорожі" name="trip_type">
                                <Select>{enumOptions(TRIP_TYPE_OPTIONS)}</Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Швидкість" name="speed_type">
                                <Select>{enumOptions(SPEED_TYPE_OPTIONS)}</Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Фірмовий поїзд" name="is_branded" valuePropName="checked">
                                <Switch checkedChildren="ТАК" unCheckedChildren="НІ" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left" plain>
                        <CalendarOutlined /> Графік та призначення
                    </Divider>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Частота курсування" name="frequency_type">
                                <Select>{enumOptions(FREQUENCY_TYPE_OPTIONS)}</Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Тип призначення" name="assignment_type">
                                <Select>{enumOptions(ASSIGNMENT_TYPE_OPTIONS)}</Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
}

export default AdminTrainRoutesCreateForm;