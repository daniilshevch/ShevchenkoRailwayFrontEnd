import React, { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
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
import './AdminCarriageAssignmentsList.css';

const { Option } = Select;

const CARRIAGE_TYPES = {
    0: "Платскарт",
    1: "Купе",
    2: "СВ",
    3: "Сидячий"
};
const CARRIAGE_QUALITY_CLASS = {
    0: "S",
    1: "A",
    2: "B",
    3: "C"
};
const CARRIAGE_MANUFACTURER = {
    0: "КВБЗ",
    1: "Амендорф"
};
function parseTrainRaceId(trainRaceId) {
    const parts = trainRaceId.split('_');

    if (parts.length !== 4) {
        throw new Error("Невірний формат ідентифікатора рейсу");
    }

    const [trainRouteId, year, month, day] = parts;
    const date = `${year}-${month}-${day}`;

    return {
        trainRouteId,
        date
    };
}
function AdminCarriageAssignmentsList({train_race_id}) {
    const [carriageAssignments, setCarriageAssignments] = useState([]);
    const [updateForm] = Form.useForm();
    const [createForm] = Form.useForm();
    const [copySquadForm] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isCopySquadModalVisible, setIsCopySquadModalVisible] = useState(false);


    const fetchCarriageAssignments = async () => {
        const res = await fetch(`https://localhost:7230/Admin-API/get-carriage-assignments-for-train-race/${train_race_id}`);
        const data = await res.json();
        setCarriageAssignments(data);
    };

    useEffect(() => {
        fetchCarriageAssignments();
    }, []);

    const isEdited = (record) => record.passenger_carriage_id === editingKey;

    const update = (record) => {
        updateForm.setFieldsValue({ ...record });
        setEditingKey(record.passenger_carriage_id);
    };

    const cancelUpdate = () => setEditingKey('');

    const saveUpdate = async (passenger_carriage_id, train_route_on_date_id) => {
        try {
            const row = await updateForm.validateFields();
            const updatedCarriageAssignment = { ...carriageAssignments.find((r) => r.passenger_carriage_id === passenger_carriage_id), ...row };
            const response = await fetch(`https://localhost:7230/Admin-API/update-carriage-assignment/${train_route_on_date_id}/${passenger_carriage_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedCarriageAssignment)
            });
            console.log(`https://localhost:7230/Admin-API/update-carriage-assignment/${train_route_on_date_id}/${passenger_carriage_id}`)
            if (!response.ok) throw new Error('Помилка при оновленні');
            message.success('Оновлено');
            setEditingKey('');
            fetchCarriageAssignments();
        } catch (err) {
            console.error(err);
            message.error('Помилка при збереженні');
        }
    };

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
    const handleSquadCopy = async () =>
    {
        try
        {
            let values = await copySquadForm.validateFields();
            const prototype_train_route_id = values.prototype_train_route_id;
            const new_train_route_id = parseTrainRaceId(train_race_id).trainRouteId;
            const prototype_date = values.prototype_date.format("YYYY-MM-DD");
            const new_date = parseTrainRaceId(train_race_id).date;
            const response = await fetch(`https://localhost:7230/Admin-API/TrainAssignment/Copy-Train-With-Squad?prototype_train_route_id=${prototype_train_route_id}&new_train_route_id=${new_train_route_id}&prototype_date=${prototype_date}&new_date=${new_date}&creation_option=false`,
                {
                    method: 'POST'
                });
            if (!response.ok) throw new Error('Помилка при копіюванні складу поїзду');

            message.success('Склад поїзда скопійовано');
            setIsCopySquadModalVisible(false);
            copySquadForm.resetFields();
            fetchCarriageAssignments();
        }
        catch(err)
        {
            console.error(err);
            message.error('Не вдалося скопіювати склад');
        }
    }
    const handleDelete = async (passenger_carriage_id) => {
        try {
            const response = await fetch(`https://localhost:7230/Admin-API/delete-carriage-assignment/${train_race_id}/${passenger_carriage_id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error("Помилка при видаленні");
            fetchCarriageAssignments();
        }
        catch (err) {
            console.error(err);
            message.error("Не вдалося видалити маршрут");
        }
    }


    const columns = [
        {
            title: 'ID вагону',
            dataIndex: 'passenger_carriage_id',
        },
        {
            title: 'ID рейсу',
            dataIndex: 'train_route_on_date_id',
        },
        {
            title: 'Номер в складі',
            dataIndex: 'position_in_squad',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="position_in_squad" style={{ margin: 0 }}>
                        <Input />
                    </Form.Item>
                ) : (
                    record.position_in_squad
                ),
            width: 100,
        },
        {
            title: 'Тип вагону',
            dataIndex: 'passenger_carriage_type',
            render: (_, record) => (
                    CARRIAGE_TYPES[record.passenger_carriage_info.type_of]
                ),
            width: 100,
        },
        {
            title: 'Клас вагону',
            dataIndex: 'passenger_carriage_quality_class',
            render: (_, record) => (
                CARRIAGE_QUALITY_CLASS[record.passenger_carriage_info.quality_class]
            ),
            width: 100,
        },
        {
            title: 'Для жінок',
            dataIndex: 'is_for_woman',
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="is_for_woman" valuePropName="checked" style={{ margin: 0 }}>
                        <Switch />
                    </Form.Item>
                ) : record.is_for_woman ? (
                    '✅'
                ) : (
                    '❌'
                ),
        },
        {
            title: "Для дітей",
            dataIndex: "is_for_children",
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="is_for_children" valuePropName="checked" style={{ margin: 0 }}>
                        <Switch />
                    </Form.Item>
                ) : record.is_for_children ? (
                    '✅'
                ) : (
                    '❌'
                ),
        },
        {
            title: "Wi-Fi",
            dataIndex: "factual_wi_fi",
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="factual_wi_fi" valuePropName="checked" style={{ margin: 0 }}>
                        <Switch />
                    </Form.Item>
                ) : record.factual_wi_fi ? (
                    '✅'
                ) : (
                    '❌'
                ),
        },
        {
            title: "Кондиціонування",
            dataIndex: "factual_air_conditioning",
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="factual_air_conditioning" valuePropName="checked" style={{ margin: 0 }}>
                        <Switch />
                    </Form.Item>
                ) : record.factual_air_conditioning ? (
                    '✅'
                ) : (
                    '❌'
                ),
        },
        {
            title: "Душ",
            dataIndex: "factual_shower_availability",
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="factual_shower_availability" valuePropName="checked" style={{ margin: 0 }}>
                        <Switch />
                    </Form.Item>
                ) : record.factual_shower_availability ? (
                    '✅'
                ) : (
                    '❌'
                ),
        },
        {
            title: "Інклюзивність",
            dataIndex: "factual_is_inclusive",
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="factual_is_inclusive" valuePropName="checked" style={{ margin: 0 }}>
                        <Switch />
                    </Form.Item>
                ) : record.factual_is_inclusive ? (
                    '✅'
                ) : (
                    '❌'
                ),
        },
        {
            title: "Харчування",
            dataIndex: "food_availability",
            editable: true,
            render: (_, record) =>
                isEdited(record) ? (
                    <Form.Item name="food_availability" valuePropName="checked" style={{ margin: 0 }}>
                        <Switch />
                    </Form.Item>
                ) : record.food_availability ? (
                    '✅'
                ) : (
                    '❌'
                ),
        },
        {
            title: 'Дії',
            dataIndex: 'actions',
            render: (_, record) =>
                isEdited(record) ? (
                    <>
                        <Popconfirm
                            title="Підтвердити збереження?"
                            onConfirm={() => saveUpdate(record.passenger_carriage_id, record.train_route_on_date_id)}
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
                        <Button disabled={editingKey !== ''} onClick={() => {
                            update(record);
                        }} type="link">
                            Редагувати
                        </Button>
                        <Popconfirm
                            title="Ви впевнені, що хочете видалити цей маршрут?"
                            onConfirm={() => handleDelete(record.passenger_carriage_id)}
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
            <div className="create-button-wrapper">
                <Button type="primary" onClick={() => setIsCreateModalVisible(true)} style={{ marginBottom: 16 }}>
                    + Додати вагон в склад
                </Button>
            </div>
            <div className="create-button-wrapper">
                <Button className="copy-squad-button" type="primary" onClick={() => setIsCopySquadModalVisible(true)} style={{ marginBottom: 16 }}>
                    + Скопіювати склад поїзда з прототипу
                </Button>
            </div>

            <Form form={updateForm} component={false}>
                <Table
                    dataSource={carriageAssignments}
                    columns={columns}
                    rowKey="passenger_carriage_id"
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
            <Modal
                title="Копіювання складу з прототипу"
                open={isCopySquadModalVisible}
                onCancel={() => setIsCopySquadModalVisible(false)}
                onOk={handleSquadCopy}
                okText="Скопіювати склад"
            >
                <Form form={copySquadForm} layout="vertical">
                    <Form.Item label="ID маршруту-прототипу" name="prototype_train_route_id" rules={[{ required: true, message: 'Вкажіть ID маршруту-прототипу' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Дата відправлення рейсу-прототипу"
                        name="prototype_date"
                        rules={[{ required: true, message: 'Вкажіть дату відправлення рейсу-прототипу' }]}
                    >
                        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default AdminCarriageAssignmentsList;
