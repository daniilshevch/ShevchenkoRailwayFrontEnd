import React, { useState } from "react";
import { Form, Input, message, Modal, Switch, Row, Col, Divider, InputNumber, Select } from "antd";
import { PlusCircleOutlined, SettingOutlined, SafetyOutlined, ToolOutlined } from '@ant-design/icons';
import { enumOptions } from "../../GeneralComponents/EnumOptionConvertion.jsx";
import { CARRIAGE_TYPE_OPTIONS, CARRIAGE_QUALITY_CLASS_OPTIONS, CARRIAGE_MANUFACTURER_OPTIONS } from "./AdminCarriagesEnums.js";

function AdminCarriagesCreateForm({ fetchCarriages, isCreateModalVisible, setIsCreateModalVisible }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [createForm] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        try {
            const values = await createForm.validateFields();
            setLoading(true);
            const token = localStorage.getItem('token');

            const response = await fetch(`https://localhost:7230/Admin-API/add-passenger-carriage/${values.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) throw new Error('Помилка при створенні вагона');

            messageApi.success(`Вагон ${values.id} успішно додано до парку`);
            setIsCreateModalVisible(false);
            createForm.resetFields();
            fetchCarriages();
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
                title={<span><PlusCircleOutlined /> Реєстрація нового вагона</span>}
                open={isCreateModalVisible}
                onCancel={() => {
                    setIsCreateModalVisible(false);
                    createForm.resetFields();
                }}
                onOk={handleCreate}
                confirmLoading={loading}
                okText="Зареєструвати"
                width={700}
                centered
            >
                <Form form={createForm} layout="vertical" initialValues={{
                    air_conditioning: false,
                    is_inclusive: false,
                    in_current_use: true,
                    renewal_fact: false
                }}>
                    <Divider orientation="left" plain><SettingOutlined /> Основні дані</Divider>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item label="ID вагона (номер)" name="id" rules={[{ required: true, message: 'Вкажіть номер' }]}>
                                <Input placeholder="01634536" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Тип вагона" name="type_of" rules={[{ required: true }]}>
                                <Select placeholder="Оберіть тип">{enumOptions(CARRIAGE_TYPE_OPTIONS)}</Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Клас якості" name="quality_class" rules={[{ required: true }]}>
                                <Select placeholder="Оберіть клас">{enumOptions(CARRIAGE_QUALITY_CLASS_OPTIONS)}</Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item label="Виробник" name="manufacturer">
                                <Select placeholder="Виробник">{enumOptions(CARRIAGE_MANUFACTURER_OPTIONS)}</Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Рік виробництва" name="production_year">
                                <InputNumber className="custom-coeff-input" style={{ width: '100%' }} min={1950} max={2025} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Місткість" name="capacity" rules={[{ required: true }]}>
                                <InputNumber className="custom-coeff-input" style={{ width: '100%' }} min={1} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left" plain><SafetyOutlined /> Оснащення</Divider>
                    <Row gutter={[16, 16]}>
                        <Col span={6}><Form.Item label="Кондиціонер" name="air_conditioning" valuePropName="checked"><Switch /></Form.Item></Col>
                        <Col span={6}><Form.Item label="Інклюзивний" name="is_inclusive" valuePropName="checked"><Switch /></Form.Item></Col>
                        <Col span={6}><Form.Item label="Душ" name="shower_availability" valuePropName="checked"><Switch /></Form.Item></Col>
                        <Col span={6}><Form.Item label="В роботі" name="in_current_use" valuePropName="checked"><Switch /></Form.Item></Col>
                    </Row>

                    <Divider orientation="left" plain><ToolOutlined /> Капітальний ремонт (КВР)</Divider>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item label="Факт ремонту" name="renewal_fact" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Рік КВР" name="renewal_year">
                                <InputNumber className="custom-number-input" style={{ width: '100%', height: 32 }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Виконавець КВР" name="renewal_performer">
                                <Select placeholder="Оберіть завод">{enumOptions(CARRIAGE_MANUFACTURER_OPTIONS)}</Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
}

export default AdminCarriagesCreateForm;