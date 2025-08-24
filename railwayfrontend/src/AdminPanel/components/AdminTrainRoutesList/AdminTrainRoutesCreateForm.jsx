import {Form, Input, message, Modal, Select, Switch} from "antd";
import React from "react";
import {enumOptions, enumOptionsForStrings} from "../GeneralComponents/EnumOptionConvertion.jsx";
import {
    ASSIGNMENT_TYPE_OPTIONS,
    FREQUENCY_TYPE_OPTIONS,
    RAILWAY_BRANCH_OPTIONS,
    SPEED_TYPE_OPTIONS,
    TRAIN_QUALITY_CLASS_OPTIONS,
    TRIP_TYPE_OPTIONS
} from "./AdminTrainRoutesEnums.js";

function AdminTrainRoutesCreateForm({fetchRoutes, isCreateModalVisible, setIsCreateModalVisible})
{
    const [messageApi, contextHolder] = message.useMessage();
    const [createForm] = Form.useForm();
    const handleCreate = async () => {
        try {
            let values = await createForm.validateFields();
            const response = await fetch(`https://localhost:7230/Admin-API/add-train-route/${values.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!response.ok) throw new Error('Помилка при створенні маршруту');

            messageApi.success(`Маршрут ${values.id} успішно створено`);
            setIsCreateModalVisible(false);
            createForm.resetFields();
            fetchRoutes();
        } catch (err) {
            message.error(err);
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
                    <Form.Item label="ID" name="id" rules={[{required: true, message: 'Вкажіть ID маршруту' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Фірмова назва" name="branded_name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Філія" name="railway_branch_title" rules={[{ required: true }]}>
                        <Select>{enumOptionsForStrings(RAILWAY_BRANCH_OPTIONS)}</Select>
                    </Form.Item>
                    <Form.Item label="Клас якості" name="quality_class" rules={[{required:true}]}>
                        <Select>{enumOptions(TRAIN_QUALITY_CLASS_OPTIONS)}</Select>
                    </Form.Item>
                    <Form.Item label="Коефіцієнт маршруту" name="train_route_coefficient">
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item label="Тип подорожі" name="trip_type">
                        <Select>{enumOptions(TRIP_TYPE_OPTIONS)}</Select>
                    </Form.Item>
                    <Form.Item label="Швидкісний тип" name="speed_type">
                        <Select>{enumOptions(SPEED_TYPE_OPTIONS)}</Select>
                    </Form.Item>
                    <Form.Item label="Частота курсування" name="frequency_type">
                        <Select>{enumOptions(FREQUENCY_TYPE_OPTIONS)}</Select>
                    </Form.Item>
                    <Form.Item label="Тип призначення" name="assignment_type">
                        <Select>{enumOptions(ASSIGNMENT_TYPE_OPTIONS)}</Select>
                    </Form.Item>
                    <Form.Item label="Фірмовий" name="is_branded" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
};
export default AdminTrainRoutesCreateForm;