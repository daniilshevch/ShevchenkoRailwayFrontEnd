import React from "react";
import "./CarriageTypeButton.css";
import CarriageQualityClassButton from "../CarriageQualityClassButton/CarriageQualityClassButton.jsx";
import { useNavigate } from 'react-router-dom';
const CARRIAGE_TYPES = {
    "Platskart": "Плацкарт",
    "Coupe": "Купе",
    "SV": "СВ",
    "Sitting": "Сидячий"
};
function CarriageTypeButton({trainRaceId, type, classStats, generalTrainRaceInfo }) {

    const navigate = useNavigate();
    const handleCarriageTypeClick = (carriageType, trainRaceId) =>
    {
        localStorage.setItem("generalTrainRaceData", JSON.stringify(generalTrainRaceInfo));
        navigate(`/${trainRaceId}/carriages?type=${carriageType}`);
    }
    return (
        <div className="carriage-type-wrapper">
            <div className="carriage-type-button">
                <div className="type-label">
                    <button className="type-name-button" onClick={() => handleCarriageTypeClick(type, trainRaceId)}>{CARRIAGE_TYPES[type]}</button>
                    <div className="places-summary">
                        Місця: {classStats.free_places}/{classStats.total_places}
                    </div>
                    <div className="price-info">
                        {classStats.min_price} грн
                    </div>
                </div>

                <div className="subclass-buttons">
                    {Object.entries(classStats.carriage_quality_class_dictionary).map(([qualityClass, data]) => (
                        <CarriageQualityClassButton
                            key={qualityClass}
                            trainRaceId={trainRaceId}
                            carriageType = {type}
                            qualityClass={qualityClass}
                            data={data}
                            generalTrainRaceInfo={generalTrainRaceInfo}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CarriageTypeButton;
