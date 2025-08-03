import React from 'react';
import { Modal, Button, Table } from 'antd';
import {stationTitleIntoUkrainian} from "../../InterpreterDictionaries/StationsDictionary.js";
import "./TrainScheduleModal.css"
const TrainScheduleModal = ({visible, onClose, trainStops}) =>
{
    const columns = [
        {
            title: "Станція",
            dataIndex: "station_title",
            key: "station_title",
            render: (value) => stationTitleIntoUkrainian(value),
        },
        {
            title: "Час прибуття",
            dataIndex: "arrival_time",
            key: "arrival_time",
            render: (value) => value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'
        },
        {
            title: "Час відправленння",
            dataIndex: "departure_time",
            key: "departure_time",
            render: (value) => value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'
        },
        {
            title: "Тривалість зупинки",
            dataIndex: "stop_duration",
            key: "stop_duration",
            render: (_, record) => (record.departure_time && record.arrival_time) ?
                `${((new Date(record.departure_time) - new Date(record.arrival_time)))/60000} хв` : "—"
        }
    ];
    return (
        <Modal
            title = "Розклад руху"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <Table
            dataSource={trainStops}
            columns={columns}
            rowKey="station_title"
            pagination={false}
            bordered
            rowClassName={(record) => record.is_part_of_trip ? 'trip-row' : 'non-trip-row'}
            />
        </Modal>
    );
};
export default TrainScheduleModal;