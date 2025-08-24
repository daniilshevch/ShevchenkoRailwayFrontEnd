import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import './AdminTrainStopsList.css';
import AdminTrainStopsTable from "./AdminTrainStopsTable.jsx";
import AdminTrainStopsCreateForm from "./AdminTrainStopsCreateForm.jsx";
import AdminTrainStopsCopyForm from "./AdminTrainStopsCopyForm.jsx";


function AdminTrainStopsList({train_race_id}) {
    const [trainStops, setTrainStops] = useState([]);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isCopyScheduleModalVisible, setIsCopyScheduleModalVisible] = useState(false);


    const fetchTrainStops= async () => {
        const res = await fetch(`https://localhost:7230/Admin-API/get-train-stops-for-train-race/${train_race_id}`);
        const data = await res.json();
        setTrainStops(data);
    };

    useEffect(() => {
        fetchTrainStops();
    }, []);


    return (
        <>
            <div className="create-button-wrapper">
                <Button type="primary" className = "create-train-stop-button" onClick={() => setIsCreateModalVisible(true)} style={{ marginBottom: 16 }}>
                    + Додати зупинку в розклад
                </Button>
            </div>
            <div className="create-button-wrapper">
                <Button className="copy-schedule-button" type="primary" onClick={() => setIsCopyScheduleModalVisible(true)} style={{ marginBottom: 16 }}>
                    + Скопіювати розклад поїзда з прототипу
                </Button>
            </div>
            <AdminTrainStopsTable trainStops={trainStops} fetchTrainStops={fetchTrainStops} />
            <AdminTrainStopsCreateForm
                trainStops={trainStops}
                train_race_id={train_race_id}
                fetchTrainStops={fetchTrainStops}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
            />
            <AdminTrainStopsCopyForm
                train_race_id={train_race_id}
                fetchTrainStops={fetchTrainStops}
                isCopyScheduleModalVisible={isCopyScheduleModalVisible}
                setIsCopyScheduleModalVisible={setIsCopyScheduleModalVisible}
            />
        </>
    );
}

export default AdminTrainStopsList;
