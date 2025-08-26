import {DatePicker, Form, Input, message, Modal, AutoComplete, Switch} from "antd";
import React, {useEffect} from "react";
import {stationsList, stationTitleIntoUkrainian} from "../../../InterpreterDictionaries/StationsDictionary.js";
import dayjs from 'dayjs';
import {parseTrainRaceId} from "../GeneralComponents/TrainRaceIdParser.js";

const options = stationsList.map((station) => ({value: station.ukrainian, label: station.ukrainian}));
function AdminTrainStopsCreateForm({train_race_id, fetchTrainStops, isCreateModalVisible, setIsCreateModalVisible})
{
    const [createForm] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const isStartStop = Form.useWatch("is_starting_stop", createForm) ?? false;
    const isEndStop = Form.useWatch("is_ending_stop", createForm) ?? false;

    useEffect(() => {
        if(isStartStop)
        {
            createForm.setFieldsValue({arrival_time: null});
        }
        if(isEndStop)
        {
            createForm.setFieldsValue({departure_time: null});
        }
    })



    const handleCreate = async () => {
        try {
            let values = await createForm.validateFields();
            const toLocalTimeFormat = (time) => {
                if(time == null)
                {
                    return null;
                }
                else
                {
                    return time.format("YYYY-MM-DDTHH:mm:ss")
                }
            };
            let stationTitle = stationsList.find(station => station.ukrainian === values.station_title)?.english;
            const payload = {
                ...values,
                train_route_on_date_id: train_race_id,
                station_title: stationTitle,
                arrival_time: toLocalTimeFormat(values.arrival_time),
                departure_time: toLocalTimeFormat(values.departure_time),
                stop_type: 0,
            };
            const response = await fetch(`https://localhost:7230/Admin-API/add-train-stop-for-train-race`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Помилка при створенні зупинки');

            messageApi.success(`Зупинку ${stationTitleIntoUkrainian(stationTitle)} успішно створено`);
            setIsCreateModalVisible(false);
            createForm.resetFields();
            fetchTrainStops();
        } catch (err) {
            messageApi.error(err.message);
        }
    };
    return (
        <>
            {contextHolder}
            <Modal
                title="Нова зупинка"
                open={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                onOk={handleCreate}
                okText="Створити"
            >
                <Form form={createForm} layout="vertical"
                      initialValues={{
                          arrival_time: dayjs(`${parseTrainRaceId(train_race_id).date} 00:00`, 'YYYY-MM-DD HH:mm'),
                          departure_time: dayjs(`${parseTrainRaceId(train_race_id).date} 00:00`, 'YYYY-MM-DD HH:mm')
                      }}>
                    <Form.Item label="Назва зупинки" name="station_title" rules={[{ required: true, message: 'Вкажіть назву зупинки' }]}>
                        <AutoComplete
                            options={options}
                            placeholder="Почніть вводити станцію"
                            filterOption={(inputValue, option) =>
                                option?.value?.toLowerCase().includes(inputValue.toLowerCase())
                            }
                        />
                    </Form.Item>
                    <Form.Item label="Початкова зупинка" name="is_starting_stop" valuePropName="checked">
                        <Switch></Switch>
                    </Form.Item>
                    <Form.Item label="Час прибуття" name="arrival_time">
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm"
                            valueFormat="YYYY-MM-DDTHH:mm:ss"
                            style={{ width: "100%" }}
                            disabled={isStartStop}
                        />
                    </Form.Item>
                    <Form.Item label="Кінцева зупинка" name="is_ending_stop" valuePropName="checked">
                        <Switch></Switch>
                    </Form.Item>
                    <Form.Item label="Час відправлення" name="departure_time">
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm"
                            valueFormat="YYYY-MM-DDTHH:mm:ss"
                            style={{ width: "100%" }}
                            disabled={isEndStop}
                        />
                    </Form.Item>
                    <Form.Item label="Відстань від початкової станції" name="distance_from_starting_station">
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item label="Швидкість на перегоні" name="speed_on_section">
                        <Input type="number" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
export default AdminTrainStopsCreateForm;