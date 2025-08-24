import {DatePicker, Form, Input, message, Modal} from "antd";
import React from "react";

function AdminTrainRacesCreateForm({train_route_id, fetchRaces, isCreateModalVisible, setIsCreateModalVisible})
{
    const [messageApi, contextHolder] = message.useMessage();
    const [createForm] = Form.useForm();
    const handleCreate = async () => {
        try {
            let values = await createForm.validateFields();
            const payload = {
                train_route_id: train_route_id,
                departure_date: values.departure_date.format("YYYY-MM-DD"),
                train_race_coefficient: parseFloat(values.train_race_coefficient),
            };
            const response = await fetch(`https://localhost:7230/Admin-API/add-train-race`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error('Помилка при створенні рейсу');
            messageApi.success(`Рейс ${(await response.json()).id} успішно створено`);
            setIsCreateModalVisible(false);
            createForm.resetFields();
            fetchRaces();
        } catch (err) {
            messageApi.error(err.message);
        }
    };
    return (
        <>
            {contextHolder}
            <Modal
                title={`Новий рейс для маршруту ${train_route_id}`}
                open={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                onOk={handleCreate}
                okText="Створити"
            >
                <Form form={createForm} layout="vertical">
                    <Form.Item
                        label="Дата відправлення"
                        name="departure_date"
                        rules={[{ required: true, message: 'Вкажіть дату відправлення' }]}
                    >
                        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Коефіцієнт рейсу" name="train_race_coefficient">
                        <Input type="number" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
export default  AdminTrainRacesCreateForm;