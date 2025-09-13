import CarriageTypeAndQualityFilter from "../CarriageTypeAndQualityFilter/CarriageTypeAndQualityFilter.jsx";
import {Button, Typography} from "antd";
import "./TrainRaceInfoHeader.css";
import {
    stationTitleIntoUkrainian
} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/StationsDictionary.js";
import {formatDM_HM} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TimeFormaters.js";
import changeTrainRouteIdIntoUkrainian, {
    getTrainRouteIdFromTrainRaceId
} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TrainRoutesDictionary.js";
import React from "react";

function TrainRaceInfoHeader(
    {
        trainRouteId,
        startingStation,
        endingStation,
        startingStationDepartureTime,
        endingStationArrivalTime,
        trainRouteQualityClass,
        setTrainScheduleModalVisible
    })
{
    return (
        <>
            <div className="train-race-info-toolbar">
                <div className="toolbar-left">
                    <Typography className="train-route-id">{trainRouteId}</Typography><Typography className={`train-class-section-${trainRouteQualityClass}`}>({trainRouteQualityClass})</Typography>
                    <Typography className="station-title">{stationTitleIntoUkrainian(startingStation)}</Typography><Typography className="station-time">({formatDM_HM(startingStationDepartureTime)})</Typography><Typography className="arrow">→</Typography><Typography className="station-title">{stationTitleIntoUkrainian(endingStation)}</Typography><Typography className="station-time">({formatDM_HM(endingStationArrivalTime)})</Typography>
                </div>
                <div className="toolbar-right">
                    <Button className="train-schedule-bar-button" type="text" onClick={() => setTrainScheduleModalVisible(true)}>Розклад руху поїзда</Button>
                </div>
            </div>
        </>
    )
}
export default TrainRaceInfoHeader;