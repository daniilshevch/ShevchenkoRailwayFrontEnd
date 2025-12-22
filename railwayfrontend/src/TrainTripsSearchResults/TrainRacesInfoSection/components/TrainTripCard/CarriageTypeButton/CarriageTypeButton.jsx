import React from "react";
import "./CarriageTypeButton.css"; // Ми оновимо цей CSS
import CarriageQualityClassButton from "../CarriageQualityClassButton/CarriageQualityClassButton.jsx";
import { useNavigate } from 'react-router-dom';
import { Card, Typography } from 'antd'; // 👈 Імпортуємо Card

const { Title, Text } = Typography;

const CARRIAGE_TYPES = {
    "Platskart": "Плацкарт",
    "Coupe": "Купе",
    "SV": "СВ",
    "Sitting": "Сидячий"
};

function CarriageTypeButton({ trainRaceId, startStation, endStation, type, classStats, generalTrainRaceInfo, showWithoutFreePlaces }) {

    const navigate = useNavigate();

    // Ця логіка залишається
    const handleCarriageTypeClick = (carriageType, trainRaceId) => {
        localStorage.setItem("generalTrainRaceData", JSON.stringify(generalTrainRaceInfo));
        navigate(`/${trainRaceId}/${startStation}/${endStation}/carriages?type=${carriageType}`);
    }


    const cardTitle = (
        <div className="card-title-header">
            <Title level={5} onClick={() => handleCarriageTypeClick(type, trainRaceId)} className="card-title-clickable">
                {CARRIAGE_TYPES[type]}
            </Title>

            <Text type="secondary" className="card-title-places">
                Місця: {classStats.free_places}/{classStats.total_places}
            </Text>

            <span className="card-title-price">
                {classStats.min_price} грн
            </span>
        </div>
    );

    // // Створюємо "extra" для Card
    // const cardExtra = (
    //     <Text type="secondary">
    //         Місця: {classStats.free_places}/{classStats.total_places}
    //     </Text>
    // );

    return (
        <Card
            title={cardTitle}
            //extra={cardExtra}
            className="carriage-type-card"
        >
            <div className="subclass-tags-wrapper">
                {Object.entries(classStats.carriage_quality_class_dictionary).map(([qualityClass, data]) => (
                    <CarriageQualityClassButton
                        key={qualityClass}
                        trainRaceId={trainRaceId}
                        startStation={startStation}
                        endStation={endStation}
                        carriageType={type}
                        qualityClass={qualityClass}
                        data={data}
                        generalTrainRaceInfo={generalTrainRaceInfo}
                        showWithoutFreePlaces = {showWithoutFreePlaces}
                    />
                ))}
            </div>
        </Card>
    );
}

export default CarriageTypeButton;