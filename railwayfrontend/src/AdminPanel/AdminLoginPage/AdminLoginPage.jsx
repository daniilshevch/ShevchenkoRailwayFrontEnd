import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Typography, Divider, Card, Space } from 'antd';
import {
    LockOutlined,
    SafetyCertificateOutlined,
    GoogleOutlined,
    LogoutOutlined,
    ArrowRightOutlined,
    UserOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import "./AdminLoginPage.css";
import { SERVER_URL } from "../../../SystemUtils/ServerConnectionConfiguration/ConnectionConfiguration.js";

const { Title, Text } = Typography;

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    // Стан для перевірки, чи вже є активна сесія
    const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState(false);
    const [adminName, setAdminName] = useState("");

    const fromPage = location.state?.from?.pathname || '/admin/dashboard';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const role = decoded["role"] || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

                if (role === 'Administrator') {
                    setIsAlreadyLoggedIn(true);
                    // Спробуємо дістати ім'я з токена для персоналізації
                    const name = decoded["unique_name"] || decoded["sub"] || "Адміністратор";
                    setAdminName(name);
                } else {
                    messageApi.error("Даний google-акаунт не є адміністратором")
                    localStorage.removeItem('token');
                }
            } catch (e) {
                localStorage.removeItem('token');
            }
        }
    }, []);

    const handleAdminLogin = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            const response = await fetch(`${SERVER_URL}/Client-API/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!response.ok) throw new Error("Невірний логін або пароль");

            const data = await response.json();
            const token = data.token;
            const decoded = jwtDecode(token);
            const role = decoded["role"] || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            if (role !== 'Administrator') {
                throw new Error("Доступ заборонено: Ви не є адміністратором");
            }

            localStorage.setItem('token', token);
            if (data.user_Id) localStorage.setItem('userId', data.user_Id);

            messageApi.success("Авторизація успішна");
            navigate(fromPage, { replace: true });
        } catch (error) {
            messageApi.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Логіка входу через Google
    const handleGoogleLogin = () => {
        const returnOrigin = window.location.origin;
        const returnPath = window.location.pathname;
        const fullReturnUrl = `${returnOrigin}${returnPath}`;
        // Додаємо prompt=select_account, щоб Google завжди питав, який акаунт вибрати
        window.location.href = `${SERVER_URL}/Client-API/login-with-google?returnUrl=${fullReturnUrl}`;
    };

    // Функція розлогіну для входу під іншим акаунтом
    const handleLogoutAndStay = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsAlreadyLoggedIn(false);
        setAdminName("");
        messageApi.info("Ви вийшли з акаунта. Тепер ви можете увійти під іншими даними.");
    };

    return (
        <>
            {contextHolder}
            <div className="admin-login-page">
                <div className="admin-login-sidebar">
                    <div className="admin-logo-section">
                        <SafetyCertificateOutlined className="admin-icon-logo" />
                        <Title level={2} className="admin-logo-text">Shevchenko Railway Administration</Title>
                        <Text className="admin-logo-subtext">Панель керування системою</Text>
                    </div>
                </div>

                <div className="admin-login-content">
                    <div className="admin-login-box">
                        {isAlreadyLoggedIn ? (
                            <div className="already-logged-in-container" style={{ textAlign: 'center', padding: '20px 0' }}>
                                <div style={{ marginBottom: 24 }}>
                                    <UserOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: 16 }} />
                                    <Title level={3}>Вітаємо, {adminName}!</Title>
                                    <Text type="secondary">Ви вже авторизовані в системі як адміністратор.</Text>
                                </div>

                                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                    <Button
                                        type="primary"
                                        icon={<ArrowRightOutlined />}
                                        size="large"
                                        block
                                        onClick={() => navigate(fromPage)}
                                    >
                                        Перейти до панелі керування
                                    </Button>

                                    <Button
                                        icon={<LogoutOutlined />}
                                        size="large"
                                        block
                                        onClick={handleLogoutAndStay}
                                    >
                                        Увійти під іншим акаунтом
                                    </Button>
                                </Space>
                            </div>
                        ) : (
                            <>
                                <Title level={3}>Вхід адміністратора</Title>
                                <Text type="secondary">Будь ласка, авторизуйтесь для доступу до функцій керування</Text>

                                <Form
                                    form={form}
                                    layout="vertical"
                                    size="large"
                                    style={{ marginTop: 30 }}
                                    onFinish={handleAdminLogin}
                                >
                                    <Form.Item
                                        name="email"
                                        rules={[{ required: true, type: 'email', message: 'Введіть коректний Email' }]}
                                    >
                                        <Input prefix={<LockOutlined />} placeholder="Системний Email" />
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        rules={[{ required: true, message: 'Введіть пароль' }]}
                                    >
                                        <Input.Password placeholder="Пароль" />
                                    </Form.Item>

                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        block
                                        loading={loading}
                                        className="admin-login-btn"
                                    >
                                        Увійти через пароль
                                    </Button>

                                    <Divider plain>Або</Divider>

                                    <Button
                                        icon={<GoogleOutlined />}
                                        onClick={handleGoogleLogin}
                                        block
                                        className="admin-google-btn"
                                    >
                                        Увійти через Google
                                    </Button>
                                </Form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminLoginPage;