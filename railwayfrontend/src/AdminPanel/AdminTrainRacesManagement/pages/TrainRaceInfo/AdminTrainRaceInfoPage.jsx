import AdminTrainStopsList from "../../../AdminTrainStopsManagement/components/AdminTrainStopsList.jsx";
import AdminCarriageAssignmentsList from "../../../AdminCarriageAssignmentsManagement/components/AdminCarriageAssignmentsList.jsx";
import React from 'react';
import {useParams} from "react-router-dom";
import { Typography, Divider } from 'antd';

const { Title } = Typography;
function AdminTrainRaceInfoPage()
{
    const {train_race_id} = useParams();
    return (
        <div style={{ padding: '24px' }}>
            <Title level={3}>Розклад руху поїзда</Title>
            <AdminTrainStopsList train_race_id={train_race_id} />

            <Divider style={{ margin: '40px 0' }} />

            <Title level={3}>Склад поїзда</Title>
            <AdminCarriageAssignmentsList train_race_id={train_race_id} />
        </div>
    );
}
export default  AdminTrainRaceInfoPage;