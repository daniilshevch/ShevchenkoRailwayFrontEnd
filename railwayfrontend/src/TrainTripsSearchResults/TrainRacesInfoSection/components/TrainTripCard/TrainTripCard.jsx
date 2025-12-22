import React, {useState} from 'react';
import './TrainTripCard.css';
import CarriageTypeButton from './CarriageTypeButton/CarriageTypeButton.jsx';
import {stationTitleIntoUkrainian} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/StationsDictionary.js";
import {Button, Tag} from 'antd';
import TrainScheduleModal from '../TrainScheduleModal/TrainScheduleModal.jsx';
import SpeedometerComponent from './SpeedometerComponent/SpeedometerComponent.jsx';
import changeTrainRouteIdIntoUkrainian from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TrainRoutesDictionary.js";
import changeTrainRouteBrandedNameIntoUkrainian from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TrainBrandedNamesDictionary.js";

//Refactored
function formatTimeDate(dateStr) {
    const date = new Date(dateStr);
    const time = date.toLocaleTimeString("uk-UA", { hour: '2-digit', minute: '2-digit' });
    const day = date.toLocaleDateString("uk-UA", { day: "numeric", month: "long" });
    return { time, day };
}

function trainNumberTag(train_route_id)
{
    return (
        <Tag color="#2f54eb" style={{
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '12px 0 0',
            padding: '2px 12px',
            borderTop: '2px solid #2f54eb',
            borderBottom: '2px solid #2f54eb',
            borderLeft: '2px solid #2f54eb',
            borderRight: 'none'
        }}>
            {changeTrainRouteIdIntoUkrainian(train_route_id)}
        </Tag>
    )
}
function trainQualityClassTag(quality_class)
{
    const defineQualityClassColor = (quality_class) =>
    {
        switch (quality_class) {
            case "S":
                return "purple";
            case "A":
                return "red";
            case "B":
                return "green";
            case "C":
                return "blue";
        }
    }
    return (
        <Tag color={defineQualityClassColor(quality_class)} style={{
            color: 'white',
            backgroundColor: defineQualityClassColor(quality_class),
            fontWeight: 'bold',
            borderRadius: '0 0',
            padding: '2px 15px',
            borderTop: `2px solid ${defineQualityClassColor(quality_class)}`,
            borderBottom: `2px solid ${defineQualityClassColor(quality_class)}`,
            borderLeft: 'none',
            borderRight: 'none'
        }}>
            {quality_class}
        </Tag>
    )
}
function trainBrandedNameTag(branded_name)
{
    const ukrainian_branded_name = changeTrainRouteBrandedNameIntoUkrainian(branded_name);
    return (
        <Tag color="orange" style={{
            backgroundColor: "orange",
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '0px 0 12px 0',
            padding: '2px 15px',
            borderTop: '2px solid orange',
            borderBottom: '2px solid orange',
            borderLeft: '2px solid orange',
            borderRight: 'none'
        }}>
            {ukrainian_branded_name}
        </Tag>
    )
}
function isFastestTag(is_fastest, is_cheapest)
{
    if(is_fastest === true)
    {
        const borderRadius = is_cheapest ? '0' : '0 12px 0 0';
        const borderRight = is_cheapest ? 'none' : '2px solid #00CED1';

        return (
            <Tag color='#40E0D0' style={{
                color: 'white',
                backgroundColor: '#00CED1',
                fontWeight: 'bold',
                borderRadius: borderRadius,
                padding: '2px 12px',
                borderTop: `2px solid #00CED1`,
                borderBottom: `2px solid #00CED1`,
                borderLeft: 'none',
                borderRight: borderRight
            }}>
                Найшвидший
            </Tag>
        );
    }
    else
    {
        return null;
    }
}
function isCheapestTag(is_fastest, is_cheapest)
{
    let marginLeft = 0;
    if(!is_fastest)
    {
        marginLeft = 0;
    }
    if(is_cheapest === true)
    {
        return (
            <Tag color='light-blue' style={{
                color: 'white',
                backgroundColor: 'purple',
                fontWeight: 'bold',
                borderRadius: '0 12px 0 0',
                padding: '2px 12px',
                borderTop: `2px solid purple`,
                borderBottom: `2px solid purple`,
                borderLeft: 'none',
                borderRight: '2px solid purple',
                marginLeft: `${marginLeft}px`
            }}>
                Найдешевший
            </Tag>
        );
    }
    else
    {
        return null;
    }
}
function TrainTripCard({ train, showWithoutFreePlaces })
{
    const [isScheduleVisible, setIsScheduleVisible] = useState(false);
    const departure = formatTimeDate(train.trip_starting_station_departure_time);
    const arrival = formatTimeDate(train.trip_ending_station_arrival_time);
    return (
        <div className="train-card">
            <div className="train-header">
                <div className="left-train-header-block">
                    <span className="train-number">{trainNumberTag(train.train_route_id)}</span>
                    <span className="train-quality-class">{trainQualityClassTag(train.train_route_class)}</span>
                    <span className="train-branded-name">{trainBrandedNameTag(train.train_route_branded_name)}</span>
                </div>
                <div className="right-train-header-block">
                    <span className="is-fastest">{isFastestTag(train.is_fastest, train.is_cheapest)}</span>
                    <span className="is-cheapest">{isCheapestTag(train.is_fastest, train.is_cheapest)}</span>
                </div>
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
                    <strong>{changeTrainRouteIdIntoUkrainian(train.train_route_id)}</strong> {stationTitleIntoUkrainian(train.full_route_starting_station_title)} → {stationTitleIntoUkrainian(train.full_route_ending_station_title)}
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
                        <CarriageTypeButton
                            key={type}
                            trainRaceId={train.train_race_id}
                            startStation={train.trip_starting_station_title}
                            endStation={train.trip_ending_station_title}
                            type={type}
                            classStats={classStats}
                            generalTrainRaceInfo={train}
                            showWithoutFreePlaces = {showWithoutFreePlaces}
                        />
                    ))}
            </div>
            <TrainScheduleModal
                visible={isScheduleVisible}
                onClose={() => setIsScheduleVisible(false)}
                trainStops={train.train_schedule}
                trainQualityClass={train.train_route_class}
                trainRouteId={changeTrainRouteIdIntoUkrainian(train.train_route_id)}
                startingStationUkrainianTitle={stationTitleIntoUkrainian(train.full_route_starting_station_title)}
                endingStationUkraininTitle={stationTitleIntoUkrainian(train.full_route_ending_station_title)}
            />
        </div>
    );
}
export default TrainTripCard;