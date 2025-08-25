import React, { useEffect, useState } from 'react';
import {
    Select,
    Button,
} from 'antd';
import './AdminCarriageAssignmentsList.css';
import AdminCarriageAssignmentsTable from "./AdminCarriageAssignmentsTable.jsx";
import AdminCarriageAssignmentsCreateForm from "./AdminCarriageAssignmentsCreateForm.jsx";
import AdminCarriageAssignmentsCopyForm from "./AdminCarriageAssignmentsCopyForm.jsx";

const { Option } = Select;

function AdminCarriageAssignmentsList({train_race_id}) {
    const [carriageAssignments, setCarriageAssignments] = useState([]);

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

    return (
        <>
            <div className="create-button-wrapper">
                <Button type="primary" className="create-carriage-assignment-button" onClick={() => setIsCreateModalVisible(true)} style={{ marginBottom: 16 }}>
                    + Додати вагон в склад
                </Button>
            </div>
            <div className="create-button-wrapper">
                <Button className="copy-squad-button" type="primary" onClick={() => setIsCopySquadModalVisible(true)} style={{ marginBottom: 16 }}>
                    + Скопіювати склад поїзда з прототипу
                </Button>
            </div>
           <AdminCarriageAssignmentsTable
               train_race_id={train_race_id}
               carriageAssignments={carriageAssignments}
               fetchCarriageAssignments={fetchCarriageAssignments}
           />
            <AdminCarriageAssignmentsCreateForm
                train_race_id={train_race_id}
                fetchCarriageAssignments={fetchCarriageAssignments}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
            />
            <AdminCarriageAssignmentsCopyForm
                train_race_id={train_race_id}
                fetchCarriageAssignments={fetchCarriageAssignments}
                isCopySquadModalVisible={isCopySquadModalVisible}
                setIsCopySquadModalVisible={setIsCopySquadModalVisible}
            />
        </>
    );
}

export default AdminCarriageAssignmentsList;
