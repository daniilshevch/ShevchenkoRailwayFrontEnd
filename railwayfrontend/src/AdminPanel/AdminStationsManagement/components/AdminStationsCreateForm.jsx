import React, { useState } from "react";
import { Form, Input, message, Modal, Row, Col, Divider, Select, InputNumber } from "antd";
import { PlusCircleOutlined, InfoCircleOutlined, BankOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { enumOptions } from "../../GeneralComponents/EnumOptionConvertion.jsx";
import { STATION_TYPE_OPTIONS, REGION_OPTIONS } from "./AdminStationsEnums.js";

function AdminStationsCreateForm({ fetchStations, isCreateModalVisible, setIsCreateModalVisible }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [createForm] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        try {
            const values = await createForm.validateFields();
            setLoading(true);
            const token = localStorage.getItem('token');

            const response = await fetch(`https://localhost:7230/Admin-API/create-station/${values.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) throw new Error('Помилка при створенні станції');

            messageApi.success(`Станцію ${values.title} успішно створено`);
            setIsCreateModalVisible(false);
            createForm.resetFields();
            fetchStations();
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
                title={<span><PlusCircleOutlined /> Додати нову станцію</span>}
                open={isCreateModalVisible}
                onCancel={() => {
                    setIsCreateModalVisible(false);
                    createForm.resetFields();
                }}
                onOk={handleCreate}
                confirmLoading={loading}
                okText="Створити"
                width={700}
                centered
            >
                <Form form={createForm} layout="vertical" initialValues={{ type_of: 0, region: 1 }}>
                    <Divider orientation="left" plain><InfoCircleOutlined /> Основні дані</Divider>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item label="Внутрішній ID" name="id" rules={[{ required: true, message: 'ID обов’язковий' }]}>
                                <InputNumber className="custom-number-input" style={{ width: '100%', height: 31 }} />
                            </Form.Item>
                        </Col>
                        <Col span={9}>
                            <Form.Item label="Назва (English)" name="title" rules={[{ required: true, message: 'Вкажіть назву' }]}>
                                <Input placeholder="Odesa-Holovna" />
                            </Form.Item>
                        </Col>
                        <Col span={9}>
                            <Form.Item label="Реєстровий ID" name="register_id">
                                <Input placeholder="Напр. 400201" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Тип станції" name="type_of">
                                <Select>{enumOptions(STATION_TYPE_OPTIONS)}</Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Область (Регіон)" name="region">
                                <Select showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                                    {enumOptions(REGION_OPTIONS)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left" plain><BankOutlined /> Приналежність та Депо</Divider>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="Назва залізничної філії" name="railway_branch_title" rules={[{ required: true }]}>
                                <Input placeholder="Південно-Західна залізниця" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Локомотивне депо" name="locomotive_depot">
                                <Input placeholder="Назва ТЧ" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Вагонне депо" name="carriage_depot">
                                <Input placeholder="Назва ВЧД" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left" plain><EnvironmentOutlined /> Географія</Divider>
                    <Form.Item label="Точна локація / Координати" name="location">
                        <Input.TextArea rows={2} placeholder="Вул. Привокзальна, 1..." />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default AdminStationsCreateForm;