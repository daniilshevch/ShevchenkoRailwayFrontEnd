import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    DatePicker
} from 'antd';
import './AdminTrainRoutesList/AdminTrainRoutesList.css';

const { Option } = Select;


function AdminTrainRacesList() {
    const [races, setRaces] = useState([]);
    const [updateForm] = Form.useForm();
    const [createForm] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const navigate = useNavigate();
    const { train_route_id } = useParams();

    const fetchRaces = async () => {
        const res = await fetch(`https://localhost:7230/Admin-API/get-races-for-train-route/${train_route_id}`);
        const data = await res.json();
        setRaces(data);
    };

    useEffect(() => {
        console.log("train_route_id:", train_route_id);
        fetchRaces();
    }, []);

    const isEdited = (record) => record.id === editingKey;

    const update = (record) => {
        updateForm.setFieldsValue({ ...record });
        setEditingKey(record.id);
    };

    const cancelUpdate = () => setEditingKey('');

    const saveUpdate = async (id) => {
        try {
            const row = await updateForm.validateFields();
            const response = await fetch(`https://localhost:7230/Admin-API/update-train-race-price-coefficient/${id}?train_race_coefficient=${row.train_race_coefficient}`, {
                method: 'PATCH',
            });

            if (!response.ok) throw new Error('Помилка при оновленні');

            message.success('Оновлено');
            setEditingKey('');
            fetchRaces();
        } catch (err) {
            console.error(err);
            message.error('Помилка при збереженні');
        }
    };

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
            console.log(JSON.stringify(payload));

            if (!response.ok) throw new Error('Помилка при створенні рейсу');

            message.success('Рейс створено');
            setIsCreateModalVisible(false);
            createForm.resetFields();
            fetchRaces();
        } catch (err) {
            console.error(err);
            message.error('Не вдалося створити маршрут');
        }
    };
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://localhost:7230/Admin-API/delete-train-race/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error("Помилка при видаленні");
            fetchRaces();
        }
        catch (err) {
            console.error(err);
            message.error("Не вдалося видалити маршрут");
        }
    }
    const showTrainRaceInfo = async (id) =>
    {
        navigate(`/admin/${id}/info`);
    }

    const columns = [
        {
            title: 'ID рейсу',
            dataIndex: 'id',
        },
        {
            title: 'ID маршруту',
            dataIndex: 'train_route_id',
        },
        {
            title: 'Дата відправлення',
            dataIndex: 'departure_date',
        },
        {
            title: 'Коефіцієнт рейсу',
            dataIndex: 'train_race_coefficient',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="train_race_coefficient" style={{ margin: 0 }}>
                        <Input />
                    </Form.Item>
                ) : (
                    record.train_race_coefficient
                ),
        },
        {
            title: "Інформація про рейс",
            dataIndex: "details",
            render: (_, record) => (
                <Button onClick={() => showTrainRaceInfo(record.id)} type="link">
                    Деталі
                </Button>
            )
        },
        {
            title: 'Дії',
            dataIndex: 'actions',
            render: (_, record) =>
                isEdited(record) ? (
                    <>
                        <Popconfirm
                            title="Підтвердити збереження?"
                            onConfirm={() => saveUpdate(record.id)}
                            okText="Так"
                            cancelText="Ні"
                        >
                            <Button type="link">Зберегти</Button>
                        </Popconfirm>
                        <Popconfirm
                            title="Скасувати зміни?"
                            onConfirm={cancelUpdate}
                            okText="Так"
                            cancelText="Ні"
                        >
                            <Button type="link">Скасувати</Button>
                        </Popconfirm>
                    </>
                ) : (
                    <>
                        <Button disabled={editingKey !== ''} onClick={() => update(record)} type="link">
                            Редагувати
                            </Button>
                        <Popconfirm
                            title="Ви впевнені, що хочете видалити цей маршрут?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Так"
                            cancelText="Ні"
                        >
                            <Button type="link" danger>
                                Видалити
                            </Button>
                        </Popconfirm>
                    </>
                ),
        },
    ];

    return (
        <>
        <div className = "create-button-wrapper">
            <Button type="primary" onClick={() => setIsCreateModalVisible(true)} style={{ marginBottom: 16 }}>
                + Додати рейс
            </Button>
        </div>

            <Form form={updateForm} component={false}>
                <Table
                    dataSource={races}
                    columns={columns}
                    rowKey="id"
                    bordered
                    pagination={false}
                    components={{
                        body: {
                            cell: ({ children }) => <td>{children}</td>,
                        },
                    }}
                    rowClassName={(_, index) => (index % 2 === 0 ? 'light-blue-row' : 'dark-blue-row')}
                />
            </Form>

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
    );
}

export default AdminTrainRacesList;
