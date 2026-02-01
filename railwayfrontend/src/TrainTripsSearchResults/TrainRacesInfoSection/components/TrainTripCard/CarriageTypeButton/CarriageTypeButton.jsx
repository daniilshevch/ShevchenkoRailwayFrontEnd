import React from "react";
import "./CarriageTypeButton.css";
import CarriageQualityClassButton from "../CarriageQualityClassButton/CarriageQualityClassButton.jsx";
import { useNavigate } from 'react-router-dom';
import { Card, Typography } from 'antd';
import {trainSearchService} from "../../../services/TrainTripsSearchService.js";
import {
    changeCarriageTypeIntoUkrainian
} from "../../../../../../SystemUtils/InterpreterMethodsAndDictionaries/CarriagesDictionaries.js";

const { Title, Text } = Typography;

function CarriageTypeButton({ trainRaceId, startStation, endStation, type, classStats, generalTrainRaceInfo, showWithoutFreePlaces }) {

    const navigate = useNavigate();
    const handleCarriageTypeClick = (carriageType, trainRaceId) => {
        trainSearchService.SAVE_TRAIN_TRIP_DATA_TO_LOCAL_STORAGE(generalTrainRaceInfo);
        let url = trainSearchService.GET_CARRIAGE_TYPE_SELECTION_URL(trainRaceId, startStation, endStation, type);
        if (classStats.free_places === 0) {
            url += (url.includes('?') ? '&' : '?') + "showFull=true";
        }
        navigate(url);
    }

    const cardTitle = (
        <div className="card-title-header">
            <Title level={5} onClick={() => handleCarriageTypeClick(type, trainRaceId)} className="card-title-clickable">
                {changeCarriageTypeIntoUkrainian(type)}
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
            className="carriage-type-card-for-race"
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