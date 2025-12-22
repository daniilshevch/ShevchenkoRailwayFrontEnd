import React from 'react';
import { Form, Input, Button, Row, Col, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const UserDataForm = ({ form, onFinish }) => {
    return (
        <div style={{ padding: '0 10px' }}>
            <Title level={2} style={{ marginBottom: 30, color: '#001529' }}>
                Налаштування профілю
            </Title>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                size="large"
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Ім'я"
                            rules={[{ required: true, message: 'Введіть ім\'я!' }]}
                        >
                            <Input placeholder="Ваше ім'я" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="surname"
                            label="Прізвище"
                            rules={[{ required: true, message: 'Введіть прізвище!' }]}
                        >
                            <Input placeholder="Ваше прізвище" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="user_name"
                    label="Нікнейм"
                    rules={[{ required: true, message: 'Введіть нікнейм!' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="daniilshevch" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Введіть Email!' },
                        { type: 'email', message: 'Некоректний Email!' }
                    ]}
                >
                    <Input disabled placeholder="email@example.com" />
                </Form.Item>

                <Form.Item
                    name="phone_number"
                    label="Телефон"
                    rules={[{ required: true, message: 'Введіть номер телефону!' }]}
                >
                    <Input placeholder="+380..." />
                </Form.Item>

                <Form.Item style={{ marginTop: 20 }}>
                    <Button type="primary" htmlType="submit" size="large" block>
                        Зберегти зміни
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UserDataForm;