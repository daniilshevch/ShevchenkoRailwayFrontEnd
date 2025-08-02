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
import './AdminTrainRoutesList.css';

const { Option } = Select;

const SPEED_TYPE_OPTIONS = {
    0: 'Експрес',
    1: 'Швидкий',
    2: 'Звичайного курсування',
};

const TRIP_TYPE_OPTIONS = {
    0: 'Нічний далекого сполучення',
    1: 'Денний далекого сполучення',
    2: 'Нічний Інтерсіті',
    3: 'Денний Інтерсіті',
    4: 'Нічний регіональний',
    5: 'Денний регіональний',
    6: 'Місцевий',
};

const FREQUENCY_TYPE_OPTIONS = {
    0: 'Щоденний',
    1: 'Через день',
    2: 'По особливим датам',
};

const ASSIGNEMENT_TYPE_OPTIONS = {
    0: 'Цілорічний',
    1: 'Сезонний',
    2: 'Додатковий',
    3: 'Спеціальний',
};

const TRAIN_QUALITY_CLASS = {
    0: 'S',
    1: 'A',
    2: 'B',
    3: 'C',
};
const RAILWAY_BRANCHES = {
    "Lviv Railway": "Львівська Залізниця",
    "Odesa Railway": "Одеська Залізниця",
    "South-Western Railway": "Південно-Західна Залізниця",
    "South Railway": "Південна Залізниця",
    "Dnipro Railway": "Дніпровська Залізниця",
    "Donetsk Railway": "Донецька Залізниця",
}

const enumOptions = (enumObj) =>
    Object.entries(enumObj).map(([key, value]) => (
        <Option key={key} value={parseInt(key)}>
            {value}
        </Option>
    ));

const enumOptionsForStrings = (enumObj) =>
    Object.entries(enumObj).map(([key, value]) => (
        <Option key={key} value={key}>
            {value}
        </Option>
    ));

function AdminTrainRoutesList() {
    const [routes, setRoutes] = useState([]);
    const [updateForm] = Form.useForm();
    const [createForm] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const navigate = useNavigate();

    const fetchRoutes = async () => {
        const res = await fetch('https://localhost:7230/Admin-API/get-train-routes');
        const data = await res.json();
        setRoutes(data);
    };

    useEffect(() => {
        fetchRoutes();
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
            const updatedRoute = { ...routes.find((r) => r.id === id), ...row };

            const response = await fetch(`https://localhost:7230/Admin-API/update-train-route/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedRoute),
            });

            if (!response.ok) throw new Error('Помилка при оновленні');

            message.success('Оновлено');
            setEditingKey('');
            fetchRoutes();
        } catch (err) {
            console.error(err);
            message.error('Помилка при збереженні');
        }
    };

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
    const handleDelete = async (id) =>
    {
        try
        {
            const response = await fetch(`https://localhost:7230/Admin-API/delete-train-route/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error("Помилка при видаленні");
            fetchRoutes();
        }
        catch (err)
        {
            console.error(err);
            message.error("Не вдалося видалити маршрут");
        }
    }
    const showTrainRaces = async (train_route_id) =>
    {
        navigate(`/admin/${train_route_id}/train-races-list`);
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 50,
        },
        {
            title: 'Фірмова назва',
            dataIndex: 'branded_name',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="branded_name" style={{ margin: 0 }}>
                        <Input />
                    </Form.Item>
                ) : (
                    record.branded_name
                ),
        },
        {
            title: 'Філія',
            dataIndex: 'railway_branch_title',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="railway_branch_title" style={{ margin: 0 }}>
                        <Select>{enumOptionsForStrings(RAILWAY_BRANCHES)}</Select>
                    </Form.Item>
                ) : (
                    RAILWAY_BRANCHES[record.railway_branch_title]
                ),
            width: 50,
        },
        {
            title: 'Клас',
            dataIndex: 'quality_class',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="quality_class" style={{ margin: 0 }}>
                        <Select>{enumOptions(TRAIN_QUALITY_CLASS)}</Select>
                    </Form.Item>
                ) : (
                    TRAIN_QUALITY_CLASS[record.quality_class]
                ),
        },
        {
            title: 'Коефіцієнт маршруту',
            dataIndex: 'train_route_coefficient',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="train_route_coefficient" style={{ margin: 0 }}>
                        <Input />
                    </Form.Item>
                ) : (
                    record.train_route_coefficient
                ),
            width: 50,
        },
        {
            title: 'Тип подорожі',
            dataIndex: 'trip_type',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="trip_type" style={{ margin: 0 }}>
                        <Select>{enumOptions(TRIP_TYPE_OPTIONS)}</Select>
                    </Form.Item>
                ) : (
                    TRIP_TYPE_OPTIONS[record.trip_type]
                ),
            width: 100,
        },
        {
            title: 'Швидкісний тип',
            dataIndex: 'speed_type',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="speed_type" style={{ margin: 0 }}>
                        <Select>{enumOptions(SPEED_TYPE_OPTIONS)}</Select>
                    </Form.Item>
                ) : (
                    SPEED_TYPE_OPTIONS[record.speed_type]
                ),
            width: 100,
        },
        {
            title: 'Частота курсування',
            dataIndex: 'frequency_type',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="frequency_type" style={{ margin: 0 }}>
                        <Select>{enumOptions(FREQUENCY_TYPE_OPTIONS)}</Select>
                    </Form.Item>
                ) : (
                    FREQUENCY_TYPE_OPTIONS[record.frequency_type]
                ),
            width: 100,
        },
        {
            title: 'Тип призначення',
            dataIndex: 'assignment_type',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="assignment_type" style={{ margin: 0 }}>
                        <Select>{enumOptions(ASSIGNEMENT_TYPE_OPTIONS)}</Select>
                    </Form.Item>
                ) : (
                    ASSIGNEMENT_TYPE_OPTIONS[record.assignment_type]
                ),
            width: 100,
        },
        {
            title: 'Фірмовий',
            dataIndex: 'is_branded',
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="is_branded" valuePropName="checked" style={{ margin: 0 }}>
                        <Switch />
                    </Form.Item>
                ) : record.is_branded ? (
                    '✅'
                ) : (
                    '❌'
                ),
        },

        {
            title: 'Рейси',
            dataIndex: 'train_races',
            render: (_, record) => (
                    <Button onClick={() => showTrainRaces(record.id)} type="link">
                        Переглянути рейси
                    </Button>
            ),
            width: 10,
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
                + Додати маршрут
            </Button>
        </div>

            <Form form={updateForm} component={false}>
                <Table
                    dataSource={routes}
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
                        <Select>{enumOptionsForStrings(RAILWAY_BRANCHES)}</Select>
                    </Form.Item>
                    <Form.Item label="Клас якості" name="quality_class" rules={[{required:true}]}>
                        <Select>{enumOptions(TRAIN_QUALITY_CLASS)}</Select>
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
                        <Select>{enumOptions(ASSIGNEMENT_TYPE_OPTIONS)}</Select>
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
