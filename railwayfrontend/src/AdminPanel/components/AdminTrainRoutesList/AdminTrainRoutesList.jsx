import React, { useEffect, useState } from 'react';
import  { Button } from 'antd';
import AdminTrainRoutesTable from "./AdminTrainRoutesTable.jsx";

import './AdminTrainRoutesList.css';
import AdminTrainRoutesCreateForm from "./AdminTrainRoutesCreateForm.jsx";

function AdminTrainRoutesList() {
    const [routes, setRoutes] = useState([]);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const fetchRoutes = async () => {
        const res = await fetch('https://localhost:7230/Admin-API/get-train-routes');
        const data = await res.json();
        setRoutes(data);
    };
    useEffect(() => {
        fetchRoutes();
    }, []);

  return (
        <>
        <div className = "create-button-wrapper">
            <Button type="primary" onClick={() => setIsCreateModalVisible(true)} style={{ marginBottom: 16 }}>
                + Додати маршрут
            </Button>
        </div>
            <AdminTrainRoutesTable routes={routes} fetchRoutes={fetchRoutes}  />
            <AdminTrainRoutesCreateForm
                fetchRoutes={fetchRoutes}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible} />
        </>
    );
}
export default AdminTrainRoutesList;
