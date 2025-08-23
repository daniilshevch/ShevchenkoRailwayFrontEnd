import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    Input,
    Select,
    Switch,
    Button,
    Popconfirm,
    Form,
    Modal,
    message,
} from 'antd';
import {enumOptions, enumOptionsForStrings} from "../GeneralComponents/EnumOptionConvertion.jsx"
import {SPEED_TYPE_OPTIONS, TRIP_TYPE_OPTIONS, FREQUENCY_TYPE_OPTIONS,
    ASSIGNMENT_TYPE_OPTIONS, TRAIN_QUALITY_CLASS_OPTIONS, RAILWAY_BRANCH_OPTIONS} from "./AdminTrainRoutesEnums.js";
import AdminTrainRoutesTable from "./AdminTrainRoutesTable.jsx";

import './AdminTrainRoutesList.css';

const { Option } = Select;




function AdminTrainRoutesList() {
    const [routes, setRoutes] = useState([]);
    const [createForm] = Form.useForm();
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    
    const fetchRoutes = async () => {
        const res = await fetch('https://localhost:7230/Admin-API/get-train-routes');
        const data = await res.json();
        setRoutes(data);
    };
    useEffect(() => {
        fetchRoutes();
    }, []);




    const handleCreate = async () => {
        try {
            let values = await createForm.validateFields();
            const response = await fetch(`https://localhost:7230/Admin-API/add-train-route/${values.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!response.ok) throw new Error('Помилка при створенні маршруту');

            message.success('Маршрут створено');
            setIsCreateModalVisible(false);
            createForm.resetFields();
            fetchRoutes();
        } catch (err) {
            console.error(err);
            message.error('Не вдалося створити маршрут');
        }
    };

  return (
        <>
        <div className = "create-button-wrapper">
            <Button type="primary" onClick={() => setIsCreateModalVisible(true)} style={{ marginBottom: 16 }}>
                + Додати маршрут
            </Button>
        </div>
            <AdminTrainRoutesTable routes={routes} fetchRoutes={fetchRoutes}  />

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
    );
}

export default AdminTrainRoutesList;
