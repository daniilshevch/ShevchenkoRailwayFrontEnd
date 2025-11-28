import React, { useState } from 'react';
import { Form, Input, Button, Select, message, Typography, Row, Col, Divider } from 'antd';
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    RocketOutlined, // Або інша іконка для бренду
    ManOutlined,
    WomanOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import "./RegisterPage.css";
import { SERVER_URL } from "../../../../SystemUtils/ConnectionConfiguration/ConnectionConfiguration.js";

const { Title, Text } = Typography;
const { Option } = Select;

const RegisterPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            const response = await fetch(`${SERVER_URL}/Client-API/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error("Невірні дані або користувач вже існує");
            }

            // const data = await response.json();
            message.success("Реєстрацію успішно виконано! Увійдіть у свій акаунт.");
            navigate('/login');
        } catch (error) {
            message.error(error.message || "Помилка реєстрації");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <Row className="register-row">
                <Col xs={0} md={10} lg={10} className="register-sidebar">
                    <div className="sidebar-content">
                        <div className="brand-logo">
                            <RocketOutlined style={{ fontSize: '48px', color: '#fff' }} />
                            <Title level={2} style={{ color: '#fff', margin: '10px 0' }}>Shevchenko Railway</Title>
                        </div>
                        <Text className="slogan">
                            Перша приватна залізнична компанія України.<br />
                        </Text>
                    </div>
                    <div className="sidebar-overlay"></div>
                </Col>

                <Col xs={24} md={14} lg={14} className="register-form-section">
                    <div className="form-wrapper">
                        <Title level={2} style={{ marginBottom: '5px', color: '#001529' }}>Створити акаунт</Title>
                        <Text type="secondary">Заповніть дані для доступу до бронювання квитків</Text>

                        <Divider />

                        <Form
                            form={form}
                            layout="vertical"
                            size="large"
                            requiredMark="optional"
                        >
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="name"
                                        label="Ім’я"
                                        rules={[{ required: true, message: 'Введіть ім’я' }]}
                                    >
                                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Тарас" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="surname"
                                        label="Прізвище"
                                        rules={[{ required: true, message: 'Введіть прізвище' }]}
                                    >
                                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Шевченко" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="user_name"
                                label="Нікнейм (User Name)"
                                rules={[{ required: true, message: 'Придумайте нікнейм' }]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="taras_trains" />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{ required: true, type: 'email', message: 'Введіть коректний email' }]}
                            >
                                <Input prefix={<MailOutlined />} placeholder="example@mail.com" />
                            </Form.Item>

                            <Form.Item
                                name="phone_number"
                                label="Номер телефону"
                                rules={[{ required: true, message: 'Введіть номер телефону' }]}
                            >
                                <Input prefix={<PhoneOutlined />} placeholder="+380..." />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="sex"
                                        label="Стать"
                                        rules={[{ required: true, message: 'Оберіть стать' }]}
                                    >
                                        <Select placeholder="Оберіть...">
                                            <Option value="male"><ManOutlined /> Чоловіча</Option>
                                            <Option value="female"><WomanOutlined /> Жіноча</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="password"
                                        label="Пароль"
                                        rules={[{ required: true, message: 'Введіть пароль' }, { min: 6, message: 'Мінімум 6 символів' }]}
                                    >
                                        <Input.Password prefix={<LockOutlined />} placeholder="******" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item style={{ marginTop: '20px' }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={handleRegister}
                                    loading={loading}
                                    block
                                    style={{ height: '45px', fontSize: '16px', fontWeight: '500' }}
                                >
                                    Зареєструватись
                                </Button>
                            </Form.Item>

                            <div style={{ textAlign: 'center' }}>
                                <Text>Вже маєте акаунт? <Link to="/login">Увійти</Link></Text>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default RegisterPage;