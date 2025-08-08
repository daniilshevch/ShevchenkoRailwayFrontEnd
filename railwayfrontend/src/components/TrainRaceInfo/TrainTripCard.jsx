import React, {useState} from 'react';
import './TrainTripCard.css';
import CarriageTypeButton from './CarriageTypeButton';
import {stationTitleIntoUkrainian} from "../../InterpreterDictionaries/StationsDictionary.js";
import {Button, Tag} from 'antd';
import TrainScheduleModal from './TrainScheduleModal';
import SpeedometerComponent from './SpeedometerComponent';
import changeTrainRouteIdIntoUkrainian from "../../InterpreterDictionaries/TrainRoutesDictionary.js";
function formatTimeDate(dateStr) {
    const date = new Date(dateStr);
    const time = date.toLocaleTimeString("uk-UA", { hour: '2-digit', minute: '2-digit' });
    const day = date.toLocaleDateString("uk-UA", { day: "numeric", month: "long" });
    return { time, day };
}


function TrainTripCard({ train })
{
    const [isScheduleVisible, setIsScheduleVisible] = useState(false);
    const departure = formatTimeDate(train.trip_starting_station_departure_time);
    const arrival = formatTimeDate(train.trip_ending_station_arrival_time);
    return (
        <div className="train-card">
            <div className="train-header">
                <span className="train-number">{changeTrainRouteIdIntoUkrainian(train.train_route_id)}</span>
            </div>
            <div className="train-times">
                <div className="time-block left">
                    <div className="time">{departure.time}</div>
                    <div className="date">{departure.day}</div>
                    <div className="station">{stationTitleIntoUkrainian(train.trip_starting_station_title)}</div>
                </div>
                <div className="center-blocks">
                    <div className="duration-block">
                        <span className="duration">
                            {Math.floor(parseInt(train.total_trip_duration.split(":")[0]))} год{" "}
                            {parseInt(train.total_trip_duration.split(":")[1])} хв
                        </span>
                    </div>
                    <SpeedometerComponent speed = {train.average_speed_on_trip} />
                </div>
                {/*<SpeedometerComponent speed = {train.average_speed_on_trip} />*/}
                <div className="time-block right">
                    <div className="time">{arrival.time}</div>
                    <div className="date">{arrival.day}</div>
                    <div className="station">{stationTitleIntoUkrainian(train.trip_ending_station_title)}</div>
                </div>

            </div>

            <div className="route-footer">
                <div>
                    <Button className="train-schedule-button" type="default" onClick={() => setIsScheduleVisible(true)}>
                        Розклад руху
                    </Button>
                </div>
                <div className="full-route">
                    {changeTrainRouteIdIntoUkrainian(train.train_route_id)} {stationTitleIntoUkrainian(train.full_route_starting_station_title)} → {stationTitleIntoUkrainian(train.full_route_ending_station_title)}
                </div>
                <div>
                    <Button className="train-trip-map-button" type="default" onClick={() => setIsScheduleVisible(true)}>
                        Карта маршруту
                    </Button>
                </div>

            </div>

            <div className="wagon-buttons">
                {train.grouped_carriage_statistics_list &&
                    Object.entries(train.grouped_carriage_statistics_list).map(([type, classStats]) => (
                        <CarriageTypeButton key={type} trainRaceId={train.train_race_id} type={type} classStats={classStats}
                            generalTrainRaceInfo={train} />
                    ))}
            </div>
            <TrainScheduleModal
                visible={isScheduleVisible}
                onClose={() => setIsScheduleVisible(false)}
                trainStops={train.train_schedule}
            />
        </div>
    );
}
export default TrainTripCard;