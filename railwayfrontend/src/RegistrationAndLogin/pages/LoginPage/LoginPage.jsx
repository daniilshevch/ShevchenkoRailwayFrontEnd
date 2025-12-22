import React from 'react';
import { Form, Input, Button, message, Divider } from 'antd';
import { GoogleOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import "./LoginPage.css";
import { SERVER_URL } from "../../../../SystemUtils/ServerConnectionConfiguration/ConnectionConfiguration.js";

const LoginPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const location = useLocation();
    const fromPage = location.state?.from?.pathname || '/';
    const handleLogin = async () => {
        try {
            const values = await form.validateFields();
            const response = await fetch(`${SERVER_URL}/Client-API/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Невірні облікові дані");
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            if (data.user_Id) localStorage.setItem('userId', data.user_Id);

            message.success("Вхід успішно виконано");
            navigate(fromPage, { replace: true });
        } catch (error) {
            message.error(error.message || "Помилка входу");
        }
    };

    const handleGoogleLogin = () => {
        const returnOrigin = window.location.origin;
        const returnPath = fromPage === '/' ? '' : fromPage;
        const fullReturnUrl = `${returnOrigin}${returnPath}`;
        window.location.href = `${SERVER_URL}/Client-API/login-with-google?returnUrl=${fullReturnUrl}`;
    };

    return (
        <div className="login-page">
            <div className="login-overlay"></div>
            <div className="login-form-container">
                <div className="login-header">
                    <h2>Ласкаво просимо</h2>
                    <p className="login-subtitle">Увійдіть, щоб продовжити подорож</p>
                </div>

                <Form form={form} layout="vertical" size="large">
                    <Form.Item
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Введіть коректний email' }]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="Email"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Введіть пароль' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            placeholder="Пароль"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" onClick={handleLogin} block className="login-btn">
                            Увійти
                        </Button>
                    </Form.Item>
                </Form>

                <div className="social-login-section">
                    <Divider plain>Або увійти через</Divider>

                    <Button
                        icon={<GoogleOutlined />}
                        onClick={handleGoogleLogin}
                        block
                        className="google-btn"
                    >
                        Google
                    </Button>
                </div>

                <div className="register-prompt">
                    Немає акаунту? <Link to="/register">Зареєструватися</Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;