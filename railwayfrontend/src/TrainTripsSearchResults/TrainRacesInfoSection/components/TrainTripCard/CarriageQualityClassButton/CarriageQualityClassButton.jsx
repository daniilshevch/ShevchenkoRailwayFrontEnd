import React from 'react';
import "./CarriageQualityClassButton.css"; // Ми оновимо цей CSS
import { useNavigate } from 'react-router-dom';
import { Tag } from 'antd'; // 👈 Імпортуємо Tag

function CarriageQualityClassButton({ trainRaceId, startStation, endStation, carriageType, qualityClass, generalTrainRaceInfo, data, showWithoutFreePlaces }) {

    if(showWithoutFreePlaces === false && data.free_places === 0)
    {
        return null;
    }
    const navigate = useNavigate();

    const handleCarriageTypeAndQualityClassClick = (carriageType, qualityClass, trainRaceId) => {
        localStorage.setItem("generalTrainRaceData", JSON.stringify(generalTrainRaceInfo));
        navigate(`/${trainRaceId}/${startStation}/${endStation}/carriages?type=${carriageType}~${qualityClass}`);
    }

    // Функція для класів залишається
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