import {DatePicker, Form, Input, message, Modal} from "antd";
import React from "react";

function AdminCarriageAssignmentsCreateForm({fetchCarriageAssignments, isCreateModalVisible, setIsCreateModalVisible})
{
    const [messageApi, contextHolder] = message.useMessage();
    const [createForm] = Form.useForm();
    const handleCreate = async () => {
        try {
            let values = await createForm.validateFields();
            const payload = {
                ...values,
                departure_date: values.departure_date.format("YYYY-MM-DD"),
                train_race_coefficient: parseFloat(values.train_race_coefficient),
            };
            const response = await fetch(`https://localhost:7230/Admin-API/add-train-race`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            console.log(JSON.stringify(payload));

            if (!response.ok) throw new Error('Помилка при створенні рейсу');

            message.success('Рейс створено');
            setIsCreateModalVisible(false);
            createForm.resetFields();
            fetchCarriageAssignments();
        } catch (err) {
            console.error(err);
            message.error('Не вдалося створити маршрут');
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
                    <Form.Item label="ID маршруту" name="train_route_id" rules={[{ required: true, message: 'Вкажіть ID маршруту' }]}>
                        <Input />
                    </Form.Item>
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
export default AdminCarriageAssignmentsCreateForm;