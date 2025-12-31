import React, {useState, useMemo} from 'react';
import '../../../../TrainTripsSearchResults/TrainRacesInfoSection/components/TrainTripCard/TrainTripCard.css';
import "./TrainTripTicketsCard.css";
import {stationTitleIntoUkrainian} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/StationsDictionary.js";
import {Button, Tag} from 'antd';
import TrainScheduleModal
    from "../../../../TrainTripsSearchResults/TrainRacesInfoSection/components/TrainScheduleModal/TrainScheduleModal.jsx";
import SpeedometerComponent
    from "../../../../TrainTripsSearchResults/TrainRacesInfoSection/components/TrainTripCard/SpeedometerComponent/SpeedometerComponent.jsx";
import changeTrainRouteIdIntoUkrainian from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TrainRoutesDictionary.js";
import changeTrainRouteBrandedNameIntoUkrainian from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TrainBrandedNamesDictionary.js";

import SingleTicketLabel from '../SingleTicketLabel/SingleTicketLabel.jsx';
import TicketBookingModal from "../TicketBookingModal/TicketBookingModal.jsx";

function formatTimeDate(dateStr) {
    const date = new Date(dateStr);
    const time = date.toLocaleTimeString("uk-UA", { hour: '2-digit', minute: '2-digit' });
    const day = date.toLocaleDateString("uk-UA", { day: "numeric", month: "long" });
    return { time, day };
}

function useNormalizedTrain(train) {
    if (!train) {return null;}

    return useMemo(() => {
        const depISO = train.trip_starting_station_departure_time || train.departure_time;
        const arrISO = train.trip_ending_station_arrival_time || train.arrival_time;

        const startStation = train.trip_starting_station_title;
        const endStation   = train.trip_ending_station_title;

        let duration = train.total_trip_duration || train.trip_duration;
        if (!duration && depISO && arrISO) {
            const ms = new Date(arrISO) - new Date(depISO);
            const h = Math.floor(ms / 36e5);
            const m = Math.round((ms % 36e5) / 6e4);
            duration = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00`;
        }

        return {
            depISO,
            arrISO,
            startStation,
            endStation,
            duration: duration || "00:00:00",
            train_route_id: train.train_route_id,
            train_route_class: train.train_route_class,
            train_route_branded_name: train.train_route_branded_name,
            speed_on_trip: train.speed_on_trip,
            is_fastest: train.is_fastest,
            is_cheapest: train.is_cheapest,
            full_route_starting_station_title: train.full_route_starting_station_title || startStation,
            full_route_ending_station_title: train.full_route_ending_station_title || endStation,
            ticket_bookings_list: train.ticket_bookings_list || [],
            train_schedule: train.train_schedule,
            train_race_id: train.train_route_on_date_id,
        };
    }, [train]);
}

function trainNumberTag(train_route_id) {
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
function trainQualityClassTag(quality_class) {
    const defineQualityClassColor = (quality_class) => {
        switch (quality_class) {
            case "S": return "purple";
            case "A": return "red";
            case "B": return "green";
            case "C": return "blue";
            default: return "default";
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
function trainBrandedNameTag(branded_name) {
    const ukrainian_branded_name = changeTrainRouteBrandedNameIntoUkrainian(branded_name);
    return (
        <Tag color="orange" style={{
            backgroundColor: "orange",
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '0px 0 12px 0',
            padding: '2px 12px',
            borderTop: '2px solid orange',
            borderBottom: '2px solid orange',
            borderLeft: '2px solid orange',
            borderRight: 'none'
        }}>
            {ukrainian_branded_name}
        </Tag>
    )
}
function isFastestTag(is_fastest) {
    if (is_fastest === true) {
        return (
            <Tag color='yellow' style={{
                color: 'white',
                backgroundColor: 'orange',
                fontWeight: 'bold',
                borderRadius: '0',
                padding: '2px 12px',
                borderTop: `2px solid orange`,
                borderBottom: `2px solid orange`,
                borderLeft: 'none',
                borderRight: 'none'
            }}>
                Найшвидший
            </Tag>
        );
    }
    return null;
}
function isCheapestTag(is_fastest, is_cheapest) {
    let marginLeft = !is_fastest ? 8 : 0;
    if (is_cheapest === true) {
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
                borderRight: 'none',
                marginLeft: `${marginLeft}px`
            }}>
                Найдешевший
            </Tag>
        );
    }
    return null;
}

function TrainTripTicketsCard({ train, onRefresh }) {
    const [isScheduleVisible, setIsScheduleVisible] = useState(false);
    const [isTicketBookingModalVisible, setIsTicketBookingModalVisible] = useState(false);
    const [initialTicketBookingIndex, setInitialTicketBookingIndex] = useState(0);
    const [fetchedSchedule, setFetchedSchedule] = useState(null);
    const [isScheduleLoading, setIsScheduleLoading] = useState(false);


    const t = useNormalizedTrain(train);
    if (!t) {
        return null;
    }
    const departure = formatTimeDate(t.depISO);
    const arrival   = formatTimeDate(t.arrISO);

    const handleOpenSchedule = async () => {
        setIsScheduleLoading(true);
        try {
            const url = `https://localhost:7230/Client-API/TrainSearch/get-train-schedule-for-train-race/${t.train_race_id}?starting_station_title=${t.startStation}&ending_station_title=${t.endStation}`;
            const response = await fetch(url);

            if (!response.ok) throw new Error("Не вдалося завантажити розклад");

            const data = await response.json();
            setFetchedSchedule(data); // Зберігаємо отриманий масив
            setIsScheduleVisible(true); // Відкриваємо модалку
        } catch (error) {
            console.error(error);
            message.error("Помилка при отриманні розкладу руху");
        } finally {
            setIsScheduleLoading(false);
        }
    };
    const handleTicketClick = (index) => {
        setInitialTicketBookingIndex(index);
        setIsTicketBookingModalVisible(true);
    };

    return (
        <div className="train-card">
            <div className="train-header">
                <div className="left-train-header-block">
                    <span className="train-number">{trainNumberTag(t.train_route_id)}</span>
                    <span className="train-quality-class">{trainQualityClassTag(t.train_route_class)}</span>
                    <span className="train-branded-name">{trainBrandedNameTag(t.train_route_branded_name)}</span>
                </div>
                <div className="right-train-header-block">
                    <span className="is-fastest">{isFastestTag(t.is_fastest)}</span>
                    <span className="is-cheapest">{isCheapestTag(t.is_fastest, t.is_cheapest)}</span>
                </div>
            </div>

            <div className="train-times">
                <div className="time-block left">
                    <div className="time">{departure.time}</div>
                    <div className="date">{departure.day}</div>
                    <div className="station">{stationTitleIntoUkrainian(t.startStation)}</div>
                </div>
                <div className="center-blocks">
                    <div className="duration-block">
            <span className="duration">
              {Math.floor(parseInt(t.duration.split(":")[0], 10))} год{" "}
                {parseInt(t.duration.split(":")[1], 10)} хв
            </span>
                    </div>
                    {typeof t.speed_on_trip !== "undefined" && (
                        <SpeedometerComponent speed={t.speed_on_trip} />
                    )}
                </div>
                <div className="time-block right">
                    <div className="time">{arrival.time}</div>
                    <div className="date">{arrival.day}</div>
                    <div className="station">{stationTitleIntoUkrainian(t.endStation)}</div>
                </div>
            </div>

            <div className="route-footer">
                <div>
                    <Button className="train-schedule-button" type="default" onClick={handleOpenSchedule}>
                        Розклад руху
                    </Button>
                </div>
                <div className="full-route">
                    <strong>{changeTrainRouteIdIntoUkrainian(t.train_route_id)}</strong>{" "}
                    {stationTitleIntoUkrainian(t.full_route_starting_station_title)} → {stationTitleIntoUkrainian(t.full_route_ending_station_title)}
                </div>
                <div>
                    <Button className="train-trip-map-button" type="default" onClick={() => setIsScheduleVisible(true)}>
                        Карта маршруту
                    </Button>
                </div>
            </div>

            <div className="tickets-row">
                {t.ticket_bookings_list && t.ticket_bookings_list.length > 0 ? (
                    t.ticket_bookings_list.map((ticket,index) => (
                        <SingleTicketLabel key={ticket.full_ticket_id} t={ticket} onClick={() => handleTicketClick(index)}/>
                    ))
                ) : (
                    <span className="tickets-empty">Квитків у цьому поїзді немає</span>
                )}
            </div>

            <TrainScheduleModal
                visible={isScheduleVisible}
                onClose={() => setIsScheduleVisible(false)}
                trainStops={fetchedSchedule}
                trainQualityClass={t.train_route_class}
                trainRouteId={changeTrainRouteIdIntoUkrainian(t.train_route_id)}
                startingStationUkrainianTitle={stationTitleIntoUkrainian(t.full_route_starting_station_title)}
                endingStationUkraininTitle={stationTitleIntoUkrainian(t.full_route_ending_station_title)}
            />
            <TicketBookingModal
                visible={isTicketBookingModalVisible}
                onClose={() => setIsTicketBookingModalVisible(false)}
                tickets={t.ticket_bookings_list}
                initialIndex={initialTicketBookingIndex}
                onRefresh = {onRefresh}
            />
        </div>
    );
}
export default TrainTripTicketsCard;
