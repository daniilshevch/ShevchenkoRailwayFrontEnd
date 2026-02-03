import {Button, Typography, Skeleton, Space} from "antd";
import "./TrainRaceInfoHeader.css";
import {
    stationTitleIntoUkrainian
} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/StationsDictionary.js";
import {formatDM_HM} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TimeFormaters.js";
import React from "react";

//January
function TrainRaceInfoHeader(
    {
        trainRouteId,
        startingStation,
        endingStation,
        startingStationDepartureTime,
        endingStationArrivalTime,
        trainRouteQualityClass,
        setTrainScheduleModalVisible,
        isLoading
    })
{
    return (
        <>
            <div className="train-race-info-toolbar">
                <div className="toolbar-left">
                    {isLoading ? (
                            <Space size="middle">
                                <Skeleton.Button active size="small" style={{ width: 60, height: 20 }} />
                                <Skeleton.Input active size="small" style={{ width: 250, height: 20 }} />
                            </Space>
                        ) :
                        (
                            <>
                    <Typography className="train-route-id">{trainRouteId}</Typography><Typography className={`train-class-section-${trainRouteQualityClass}`}>({trainRouteQualityClass})</Typography>
                    <Typography className="station-title">{stationTitleIntoUkrainian(startingStation)}</Typography><Typography className="station-time">({formatDM_HM(startingStationDepartureTime)})</Typography><Typography className="arrow">→</Typography><Typography className="station-title">{stationTitleIntoUkrainian(endingStation)}</Typography><Typography className="station-time">({formatDM_HM(endingStationArrivalTime)})</Typography>
                            </>
                    )}
                </div>
                <div className="toolbar-right">
                    <Button className="train-schedule-bar-button" type="text" onClick={() => setTrainScheduleModalVisible(true)}>Розклад руху поїзда</Button>
                </div>
            </div>
        </>
    )
}
export default TrainRaceInfoHeader;