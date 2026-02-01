import React from 'react';
import "./CarriageQualityClassButton.css";
import { useNavigate } from 'react-router-dom';
import { Tag } from 'antd';
import {trainSearchService} from "../../../services/TrainTripsSearchService.js";

//January
function CarriageQualityClassButton({ trainRaceId, startStation, endStation, carriageType, qualityClass, generalTrainRaceInfo, data, showWithoutFreePlaces }) {
    const navigate = useNavigate();
    if(showWithoutFreePlaces === false && data.free_places === 0)
    {
        return null;
    }
    const handleCarriageTypeAndQualityClassClick = (carriageType, qualityClass, trainRaceId) => {
        trainSearchService.SAVE_TRAIN_TRIP_DATA_TO_LOCAL_STORAGE(generalTrainRaceInfo);
        let url = trainSearchService.GET_CARRIAGE_TYPE_WITH_QUALITY_CLASS_SELECTION_URL(
            trainRaceId,
            startStation,
            endStation,
            carriageType,
            qualityClass
        );
        if (data.free_places === 0) {
            url += (url.includes('?') ? '&' : '?') + "showFull=true";
        }
        navigate(url);
    }
    const getColorClass = (qualityClass) => {
        if(data.free_places === 0)
        {
            return "quality-tag-without-free-places"
        }
        switch (qualityClass) {
            case "S": return "quality-tag-s";
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