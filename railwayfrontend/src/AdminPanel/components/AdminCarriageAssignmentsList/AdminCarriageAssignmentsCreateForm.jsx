import {Form, Input, message, Modal, Switch, Row, Col} from "antd";
import React from "react";

function AdminCarriageAssignmentsCreateForm({train_race_id, fetchCarriageAssignments, isCreateModalVisible, setIsCreateModalVisible})
{
    const [messageApi, contextHolder] = message.useMessage();
    const [createForm] = Form.useForm();
    const handleCreate = async () => {
        try {
            let values = await createForm.validateFields();
            const payload = {
                train_route_on_date_id: train_race_id,
                ...values
            };
            const response = await fetch(`https://localhost:7230/Admin-API/assign-carriage-to-train-race-squad`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            console.log(JSON.stringify(payload));

            if (!response.ok) throw new Error('Помилка при створенні рейсу');

            messageApi.success(`Вагон ${values.passenger_carriage_id} призначено в склад поїзда`);
            setIsCreateModalVisible(false);
            createForm.resetFields();
            fetchCarriageAssignments();
        } catch (err) {
            messageApi.error(err.message);
        }
    };
    return (
        <>
            {contextHolder}
            <Modal
                title="Новий маршрут"
                open={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                onOk={handleCreate}
                okText="Створити"
            >
                <Form form={createForm} layout="vertical">
                    <Form.Item label="ID вагону" name="passenger_carriage_id" rules={[{ required: true, message: 'Вкажіть ID вагону' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Номер вагона в складі" name="position_in_squad" rules={[{ required: true, message: 'Вкажіть номер вагону в складі' }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Row gutter ={[16, 8]}>
                        <Col span={8}>
                            <Form.Item label="Жіночий вагон" name="is_for_woman" valuePropName="checked" >
                                <Switch />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Дитячий вагон" name="is_for_children" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>
                        <Form.Item label="WI-FI" name="factual_wi_fi" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        <Col span={8}>
                            <Form.Item label="Кондиціонер" name="factual_air_conditioning" valuePropName="checked" >
                                <Switch />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Інклюзивний" name="factual_is_inclusive" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                        <Form.Item label="Душ" name="factual_shower_availability" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Продаж їжі" name="food_availability" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}
export default AdminCarriageAssignmentsCreateForm;