import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import "./LoginPage.css"
import {SERVER_URL} from "../utils/ConnectionConfiguration.js";
const LoginPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
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
            if(!response.ok)
            {
                throw new Error("Невірні облікові дані");
            }
            const data = await response.json();
            localStorage.setItem('token', data.token);
            message.success("Вхід успішно виконано");
            navigate('/');
        }
        catch  {
            message.error("Помилка входу");
        }
    };
    return (
        <div className="login-page">
            <div className="login-form-container">
                <h2>Вхід</h2>
                <Form form = {form} layout="vertical">
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, type: 'email', message: 'Введіть коректний email' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Пароль"
                        rules={[{ required: true, message: 'Введіть пароль' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" onClick={handleLogin} block>
                            Увійти
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
export default LoginPage;