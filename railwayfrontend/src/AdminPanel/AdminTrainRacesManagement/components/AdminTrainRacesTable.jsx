import {Button, Popconfirm, Form, Input, message, Table} from "antd";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

function AdminTrainRacesTable({races, fetchRaces})
{
    const [messageApi, contextHolder] = message.useMessage();
    const [updateForm] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const navigate = useNavigate();
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

            messageApi.success(`Рейс ${id} успішно оновлено`);
            setEditingKey('');
            fetchRaces();
        } catch (err) {
            messageApi.error(err.message);
        }
    };
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://localhost:7230/Admin-API/delete-train-race/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error("Помилка при видаленні");
            messageApi.success(`Рейс ${id} успішно видалено`)
            fetchRaces();
        }
        catch (err) {
            messageApi.error(err);
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
                        <Input type="number"/>
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
            {contextHolder}
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
        </>
    );
}
export default  AdminTrainRacesTable;