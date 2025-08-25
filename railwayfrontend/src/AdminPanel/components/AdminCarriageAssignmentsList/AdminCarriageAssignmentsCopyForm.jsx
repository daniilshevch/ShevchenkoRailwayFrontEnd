import {DatePicker, Form, Input, message, Modal} from "antd";
import {parseTrainRaceId} from "../GeneralComponents/TrainRaceIdParser.js";
import React from "react";
import AdminCarriageAssignmentsCreateForm from "./AdminCarriageAssignmentsCreateForm.jsx";
function AdminCarriageAssignmentsCopyForm({train_race_id, fetchCarriageAssignments, isCopySquadModalVisible, setIsCopySquadModalVisible})
{
    const [messageApi, contextHolder] = message.useMessage();
    const [copySquadForm] = Form.useForm();
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

            messageApi.success('Склад поїзда успішно скопійовано');
            setIsCopySquadModalVisible(false);
            copySquadForm.resetFields();
            fetchCarriageAssignments();
        }
        catch(err)
        {
            messageApi.error(err.message);
        }
    }
    return (
        <>
            {contextHolder}
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
    )
}
export default AdminCarriageAssignmentsCopyForm;