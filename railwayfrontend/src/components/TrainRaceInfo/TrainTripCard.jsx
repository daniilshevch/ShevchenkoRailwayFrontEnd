import React from 'react';
import './TrainTripCard.css';
import CarriageTypeButton from './CarriageTypeButton';
import {stationTitleIntoUkrainian} from "../../InterpreterDictionaries/StationsDictionary.js";
function formatTimeDate(dateStr) {
    const date = new Date(dateStr);
    const time = date.toLocaleTimeString("uk-UA", { hour: '2-digit', minute: '2-digit' });
    const day = date.toLocaleDateString("uk-UA", { day: "numeric", month: "long" });
    return { time, day };
}
function TrainTripCard({ train })
{
    const departure = formatTimeDate(train.trip_starting_station_departure_time);
    const arrival = formatTimeDate(train.trip_ending_station_arrival_time);
    return (
        <div className="train-card">
            <div className="train-header">
                <span className="train-number">{train.train_route_id}</span>
            </div>

            <div className="train-times">
                <div className="time-block left">
                    <div className="time">{departure.time}</div>
                    <div className="date">{departure.day}</div>
                    <div className="station">{stationTitleIntoUkrainian(train.trip_starting_station_title)}</div>
                </div>

                <div className="duration-block">
                    <span className="duration">
                        {Math.floor(parseInt(train.total_trip_duration.split(":")[0]))} год{" "}
                        {parseInt(train.total_trip_duration.split(":")[1])} хв
                    </span>
                </div>

                <div className="time-block right">
                    <div className="time">{arrival.time}</div>
                    <div className="date">{arrival.day}</div>
                    <div className="station">{stationTitleIntoUkrainian(train.trip_ending_station_title)}</div>
                </div>
            </div>

            <div className="route-footer">
                <span className="full-route">
                    🚆 {train.full_route_starting_station_title} → {train.full_route_ending_station_title}
                </span>
            </div>
            <div className="wagon-buttons">
                {train.grouped_carriage_statistics_list &&
                    Object.entries(train.grouped_carriage_statistics_list).map(([type, classStats]) => (
                        <CarriageTypeButton key={type} trainRaceId={train.train_race_id} type={type} classStats={classStats}
                            generalTrainRaceInfo={train} />
                    ))}
            </div>
        </div>
    );
}
export default TrainTripCard;