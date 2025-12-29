import { DatePicker, Form, Input, message, Modal, Divider, Alert } from "antd";
import { CopyOutlined, HistoryOutlined, SwapOutlined, WarningOutlined } from '@ant-design/icons';
import { parseTrainRaceId } from "../../GeneralComponents/TrainRaceIdParser.js";
import React, { useState } from "react";

function AdminCarriageAssignmentsCopyForm({ train_race_id, fetchCarriageAssignments, isCopySquadModalVisible, setIsCopySquadModalVisible }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [copySquadForm] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSquadCopy = async () => {
        try {
            const values = await copySquadForm.validateFields();
            setLoading(true);
            const token = localStorage.getItem('token');

            // Оригінальна логіка парсингу
            const prototype_train_route_id = values.prototype_train_route_id;
            const new_train_route_id = parseTrainRaceId(train_race_id).trainRouteId;
            const prototype_date = values.prototype_date.format("YYYY-MM-DD");
            const new_date = parseTrainRaceId(train_race_id).date;

            // Оригінальний URL з вашого коду
            const url = `https://localhost:7230/Admin-API/TrainAssignment/Copy-Train-With-Squad?prototype_train_route_id=${prototype_train_route_id}&new_train_route_id=${new_train_route_id}&prototype_date=${prototype_date}&new_date=${new_date}&creation_option=false`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` } // Додано авторизацію
            });

            if (!response.ok) throw new Error('Помилка при копіюванні складу поїзду');

            messageApi.success('Склад поїзда успішно скопійовано');
            setIsCopySquadModalVisible(false);
            copySquadForm.resetFields();
            fetchCarriageAssignments();
        } catch (err) {
            messageApi.error(err.message || "Не вдалося скопіювати склад");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {contextHolder}
            <Modal
                title={<span><CopyOutlined /> Копіювання складу з прототипу</span>}
                open={isCopySquadModalVisible}
                onCancel={() => setIsCopySquadModalVisible(false)}
                onOk={handleSquadCopy}
                confirmLoading={loading}
                okText="Скопіювати склад"
                okButtonProps={{ style: { backgroundColor: '#52c41a', borderColor: '#52c41a' } }} // Зелена кнопка
                centered
            >
                <Alert
                    message="Важливо"
                    description="Ця дія замінить поточний склад вагонів копією з обраного рейсу-прототипу."
                    type="warning"
                    showIcon
                    icon={<WarningOutlined />}
                    style={{ marginBottom: 20 }}
                />

                <Form form={copySquadForm} layout="vertical">
                    <Form.Item
                        label={<span><SwapOutlined /> ID маршруту-прототипу</span>}
                        name="prototype_train_route_id"
                        rules={[{ required: true, message: 'Вкажіть ID маршруту-прототипу' }]}
                    >
                        <Input placeholder="Наприклад: 12SH" />
                    </Form.Item>

                    <Form.Item
                        label={<span><HistoryOutlined /> Дата відправлення рейсу-прототипу</span>}
                        name="prototype_date"
                        rules={[{ required: true, message: 'Вкажіть дату відправлення рейсу-прототипу' }]}
                    >
                        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} placeholder="Оберіть дату" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default AdminCarriageAssignmentsCopyForm;