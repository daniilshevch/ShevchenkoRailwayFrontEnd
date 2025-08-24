import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Input,
    Select,
    Button,
    Form,
    Modal,
    DatePicker
} from 'antd';
import '../AdminTrainRoutesList/AdminTrainRoutesList.css';
import AdminTrainRacesTable from "./AdminTrainRacesTable.jsx";
import AdminTrainRacesCreateForm from "./AdminTrainRacesCreateForm.jsx";

const { Option } = Select;


function AdminTrainRacesList() {
    const [races, setRaces] = useState([]);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const { train_route_id } = useParams();

    const fetchRaces = async () => {
        const res = await fetch(`https://localhost:7230/Admin-API/get-races-for-train-route/${train_route_id}`);
        const data = await res.json();
        setRaces(data);
    };
    useEffect(() => {
        fetchRaces();
    }, []);







    return (
        <>
            <div className = "create-button-wrapper">
                <Button type="primary" onClick={() => setIsCreateModalVisible(true)} style={{ marginBottom: 16 }}>
                    + Додати рейс
                </Button>
            </div>
            <AdminTrainRacesTable races={races} fetchRaces={fetchRaces} />
            <AdminTrainRacesCreateForm
                train_route_id={train_route_id}
                fetchRaces={fetchRaces}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
            />
        </>
    );
}

export default AdminTrainRacesList;
