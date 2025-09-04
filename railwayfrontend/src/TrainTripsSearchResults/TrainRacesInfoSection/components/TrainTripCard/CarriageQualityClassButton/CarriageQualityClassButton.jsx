import React from 'react';
import "./CarriageQualityClassButton.css";
import { useNavigate } from 'react-router-dom';
function CarriageQualityClassButton({ trainRaceId, startStation, endStation, carriageType, qualityClass, generalTrainRaceInfo, data })
{
    const navigate = useNavigate();
    const handleCarriageTypeAndQualityClassClick = (carriageType, qualityClass, trainRaceId) => {
        localStorage.setItem("generalTrainRaceData", JSON.stringify(generalTrainRaceInfo));
        navigate(`/${trainRaceId}/${startStation}/${endStation}/carriages?type=${carriageType}&quality=${qualityClass}`);
    }
    const getColorClass = (qualityClass) => {
        switch (qualityClass) {
            case "A": return "quality-a";
            case "B": return "quality-b";
            case "C": return "quality-c";
            default: return "quality-default";
        }
    };
    return (
        <button className={`class-button ${getColorClass(qualityClass)}`} onClick = {() => handleCarriageTypeAndQualityClassClick(carriageType, qualityClass, trainRaceId)}>
            {qualityClass}: {data.free_places} місць, {data.min_price} грн
        </button>
    )
}
export default CarriageQualityClassButton;