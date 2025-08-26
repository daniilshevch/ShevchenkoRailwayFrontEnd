import React, { useEffect, useState } from 'react';
import {Button, message} from 'antd';
import AdminTrainRoutesTable from "./AdminTrainRoutesTable.jsx";

import './AdminTrainRoutesList.css';
import AdminTrainRoutesCreateForm from "./AdminTrainRoutesCreateForm.jsx";

function AdminTrainRoutesList() {
    const [messageApi, contextHolder] = message.useMessage();
    const [routes, setRoutes] = useState([]);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const fetchRoutes = async () => {
        try {
            const res = await fetch('https://localhost:7230/Admin-API/get-train-routes');
            const data = await res.json();
            setRoutes(data);
        }
        catch(err)
        {
            messageApi.error(err.message);
        }
    };
    useEffect(() => {
        fetchRoutes();
    }, []);

  return (
        <>
            {contextHolder}
            <div className = "create-button-wrapper">
                <Button type="primary" onClick={() => setIsCreateModalVisible(true)} style={{ marginBottom: 16 }}>
                    + Додати маршрут
                </Button>
            </div>
                <AdminTrainRoutesTable routes={routes} fetchRoutes={fetchRoutes}  />
                <AdminTrainRoutesCreateForm
                    fetchRoutes={fetchRoutes}
                    isCreateModalVisible={isCreateModalVisible}
                    setIsCreateModalVisible={setIsCreateModalVisible}
                cd/>
        </>
    );
}
export default AdminTrainRoutesList;
