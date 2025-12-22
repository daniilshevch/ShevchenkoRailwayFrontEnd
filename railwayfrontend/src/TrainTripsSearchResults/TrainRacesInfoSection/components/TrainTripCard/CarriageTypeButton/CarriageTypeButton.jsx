import React from "react";
import "./CarriageTypeButton.css"; // Ми оновимо цей CSS
import CarriageQualityClassButton from "../CarriageQualityClassButton/CarriageQualityClassButton.jsx";
import { useNavigate } from 'react-router-dom';
import { Card, Typography } from 'antd';
import {
    EAGER_BOOKINGS_SEARCH_MODE
} from "../../../../../../SystemUtils/ServerConnectionConfiguration/ProgramFunctioningConfiguration/ProgramFunctioningConfiguration.js"; // 👈 Імпортуємо Card

const { Title, Text } = Typography;

const CARRIAGE_TYPES = {
    "Platskart": "Плацкарт",
    "Coupe": "Купе",
    "SV": "СВ",
    "Sitting": "Сидячий"
};

function CarriageTypeButton({ trainRaceId, startStation, endStation, type, classStats, generalTrainRaceInfo, showWithoutFreePlaces }) {

    const navigate = useNavigate();
    const handleCarriageTypeClick = (carriageType, trainRaceId) => {
        if(EAGER_BOOKINGS_SEARCH_MODE) {
            localStorage.setItem("generalTrainRaceData", JSON.stringify(generalTrainRaceInfo));
        }
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

    return (
        <Card
            title={cardTitle}
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