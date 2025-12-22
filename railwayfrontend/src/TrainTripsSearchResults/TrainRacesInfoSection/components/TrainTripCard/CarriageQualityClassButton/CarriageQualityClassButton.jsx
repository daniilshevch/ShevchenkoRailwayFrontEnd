import React from 'react';
import "./CarriageQualityClassButton.css"; // Ми оновимо цей CSS
import { useNavigate } from 'react-router-dom';
import { Tag } from 'antd';
import {
    EAGER_BOOKINGS_SEARCH_MODE
} from "../../../../../../SystemUtils/ServerConnectionConfiguration/ProgramFunctioningConfiguration/ProgramFunctioningConfiguration.js"; // 👈 Імпортуємо Tag

//Refactored
function CarriageQualityClassButton({ trainRaceId, startStation, endStation, carriageType, qualityClass, generalTrainRaceInfo, data, showWithoutFreePlaces }) {
    const navigate = useNavigate();
    if(showWithoutFreePlaces === false && data.free_places === 0)
    {
        return null;
    }
    const handleCarriageTypeAndQualityClassClick = (carriageType, qualityClass, trainRaceId) => {
        if(EAGER_BOOKINGS_SEARCH_MODE) {
            localStorage.setItem("generalTrainRaceData", JSON.stringify(generalTrainRaceInfo));
        }
        navigate(`/${trainRaceId}/${startStation}/${endStation}/carriages?type=${carriageType}~${qualityClass}`);
    }

    const getColorClass = (qualityClass) => {
        if(data.free_places === 0)
        {
            return "quality-tag-without-free-places"
        }
        switch (qualityClass) {
            case "A": return "quality-tag-a";
            case "B": return "quality-tag-b";
            case "C": return "quality-tag-c";
            default: return "quality-tag-default";
        }
    };

    return (
        <Tag
            className={`quality-class-tag ${getColorClass(qualityClass)}`}
            onClick={() => handleCarriageTypeAndQualityClassClick(carriageType, qualityClass, trainRaceId)}
        >
            <span className="tag-class-name">Клас {qualityClass}</span>
            <span className="tag-class-info">{data.free_places} місць, {data.min_price}грн</span>
        </Tag>
    )
}

export default CarriageQualityClassButton;