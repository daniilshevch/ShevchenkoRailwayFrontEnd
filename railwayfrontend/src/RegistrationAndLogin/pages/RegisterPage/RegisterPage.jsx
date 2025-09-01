import React from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import "./RegisterPage.css";
import {SERVER_URL} from "../../../../SystemUtils/ConnectionConfiguration/ConnectionConfiguration.js";

const LoginPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const handleRegister = async () => {
        try {
            const values = await form.validateFields();
            const response = await fetch(`${SERVER_URL}/Client-API/register`, {
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
            message.success("Реєстрацію успішно виконано");
            navigate('/login');
        }
        catch  {
            message.error("Помилка реєстрації");
        }
    };
    return (
        <div className="register-page">
            <div className="register-form-container">
                <h2>Реєстрація</h2>
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

                    <Form.Item
                        name="name"
                        label="Ім’я"
                        rules={[{ required: true, message: 'Введіть ім’я' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="surname"
                        label="Прізвище"
                        rules={[{ required: true, message: 'Введіть прізвище' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="user_name"
                        label="Ім’я користувача"
                        rules={[{ required: true, message: 'Введіть нікнейм' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="sex"
                        label="Стать"
                        rules={[{ required: true, message: 'Оберіть стать' }]}
                    >
                        <Select placeholder="Оберіть стать">
                            <Option value="male">Чоловіча</Option>
                            <Option value="female">Жіноча</Option>
                            <Option value="other">Інше</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="phone_number"
                        label="Номер телефону"
                        rules={[{ required: true, message: 'Введіть номер телефону' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" onClick={handleRegister} block>
                            Зареєструватись
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
export default LoginPage;