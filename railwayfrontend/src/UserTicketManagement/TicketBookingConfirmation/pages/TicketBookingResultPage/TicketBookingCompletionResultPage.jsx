import React, {useEffect, useReducer, useState} from "react";
import {
    initialPotentialTicketCartState as potentialTicketsCartState,
    initialPotentialTicketCartState,
    potentialTicketCartReducer
} from "../../../../../SystemUtils/UserTicketCart/UserPotentialTicketCartSystem.js";
import {SERVER_URL} from "../../../../../SystemUtils/ConnectionConfiguration/ConnectionConfiguration.js";
import {Steps, Button, Card, Row, Col, Space, message, Spin, Typography, Progress} from 'antd';
import "./TicketBookingCompletionResultPage.css";
import {
    stationTitleIntoUkrainian
} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/StationsDictionary.js";
import {formatDM_HM} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TimeFormaters.js";
import changeTrainRouteIdIntoUkrainian, {
    getTrainRouteIdFromTrainRaceId
} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TrainRoutesDictionary.js";
import {
    changeCarriageTypeIntoUkrainian
} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/CarriagesDictionaries.js";
const {Text} = Typography;
function BookingProgressExample({stepsCount, running})
{
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        if(!running)
        {
            return;
        }
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                const stepProgress = 100 / stepsCount;
                const next = prev + stepProgress;
                if (next >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return next;
            });
        }, 500);
        return () => clearInterval(interval);
    }, [running]);
    return (
        <div style={{ marginTop: 20, textAlign: "center" }}>
            <Progress type="circle" percent={progress} />
            {progress === 100 && (
                <div style={{ marginTop: 20 }}>
                    <h3>Бронювання завершено!</h3>
                    <p>Тепер ви можете завантажити квитки або перейти до особистого кабінету.</p>
                </div>
            )}
        </div>
    );
}
function TicketBookingCompletionResultPage()
{
    const [potentialTicketCartState, potentialTicketCartDispatch] = useReducer(potentialTicketCartReducer, initialPotentialTicketCartState);
    const [bookingProgress, setBookingProgress] = useState(0);
    const completeTicketBookingProcess = async (ticket, userInfo, index) => {
        const token = localStorage.getItem("token");
        const ticket_info = {
            id: ticket.id,
            full_ticket_id: ticket.full_ticket_id,
            user_id: ticket.user_id,
            train_route_on_date_id: ticket.train_race_id,
            passenger_carriage_position_in_squad: ticket.carriage_position_in_squad,
            passenger_carriage_id: ticket.passenger_carriage_id,
            starting_station_title: ticket.trip_starting_station,
            ending_station_title: ticket.trip_ending_station,
            place_in_carriage: ticket.place_in_carriage,
            ticket_status: ticket.ticket_status === "RESERVED" ? "Booking_In_Progress" : null,
            booking_initialization_time: ticket.booking_initialization_time,
            booking_expiration_time: ticket.booking_expiration_time
        };
        const user_and_trip_info = {
            passenger_name: userInfo.passenger_name,
            passenger_surname: userInfo.passenger_surname
        };
        const booking_confirmation_body = {
            ticket_booking_dto: ticket_info,
            user_info_dto: user_and_trip_info
        };
        const response = await fetch(`${SERVER_URL}/Client-API/CompleteTicketBookingProcessing/Complete-Ticket-Booking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(booking_confirmation_body)
        });
        if (!response.ok)
        {
            console.log(1000);
            console.log(await response.text());
        }
        if(response.ok) {
            setBookingProgress(Math.round(((index + 1) / steps.length) * 100));
        }
        return response.ok;
    };

    useEffect(() => {
        try
        {
            const potentialTicketsCart = localStorage.getItem("potentialTicketsCart");
            if (potentialTicketsCart)
            {
                const parsed = JSON.parse(potentialTicketsCart);
                const list = parsed?.potentialTicketsList ?? parsed?.potentialTickets ?? [];
                setSteps(list);
                setBookingStatus(list.map(() => "pending"));
                potentialTicketCartDispatch({type: "ALLOCATE_FROM_LOCAL_STORAGE", payload: JSON.parse(potentialTicketsCart)});
            }
        }
        catch(error)
        {
            console.error(error);
        }
    }, []);

    const [steps, setSteps] = useState([])
    const [running, setRunning] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0);
    const [bookingStatus, setBookingStatus] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();

    const startBooking = async () => {
        setRunning(true);
        for(let i = 0; i < steps.length; i++)
        {
            setCurrentIndex(i);
            const ticket = steps[i];
            const userInfo = ticket.passenger_trip_info;
            const success = await completeTicketBookingProcess(ticket, userInfo, i);
            setBookingStatus(prev => {
                const newStatus = [...prev];
                newStatus[i] = success ? "finish" : "error";
                return newStatus;
            });
        }
        setRunning(false);
        messageApi.success("Booking process completed");
        potentialTicketCartDispatch({type: "CLEAR_CART"});
    }
    useEffect(() => {
        try
        {
            localStorage.setItem("potentialTicketsCart", JSON.stringify({
                potentialTicketsList: potentialTicketCartState.potentialTicketsList}));
        }
        catch(error)
        {
            console.error(error);
        }
    }, [potentialTicketCartState.potentialTicketsList]);
    return (
        <Card title="Ticket Booking">
            {contextHolder}
            <Steps current={currentIndex} status="process">
                {steps.map((ticket, idx) => (
                    <Steps
                        key={ticket.id}
                        //title={`${ticket.passenger_trip_info.passenger_name} ${ticket.passenger_trip_info.passenger_surname}`}
                        status={bookingStatus[idx]}
                        icon={
                            <div className="step-icon-with-label">
                                <span className={`my-step-circle ${bookingStatus[idx] || ""}`}>
                                    {idx + 1}
                                </span>
                                <div className="step-label">
                                    {`${ticket.passenger_trip_info.passenger_name} ${ticket.passenger_trip_info.passenger_surname} `}
                                </div>
                                <div className="train-label">
                                    <Text className="train-route-id">{changeTrainRouteIdIntoUkrainian(getTrainRouteIdFromTrainRaceId(ticket.train_race_id))}</Text><Text className={`train-class-section-${ticket.train_route_quality_class}`}>({ticket.train_route_quality_class}) </Text>
                                    <Text className="full-route-station-label">{stationTitleIntoUkrainian(ticket.full_route_starting_station)} - </Text><Text className="full-route-station-label">{stationTitleIntoUkrainian(ticket.full_route_ending_station)}</Text>
                                </div>
                                <div className="trip-station-label">
                                    {`${stationTitleIntoUkrainian(ticket.trip_starting_station)}(${formatDM_HM(ticket.trip_starting_station_departure_time)})`}
                                </div>
                                <div className="trip-station-label">
                                    {`${stationTitleIntoUkrainian(ticket.trip_ending_station)}(${formatDM_HM(ticket.trip_ending_station_arrival_time)})`}
                                </div>
                                <div className="carriage-label">
                                    <Text className="carriage-number">{ticket.carriage_position_in_squad}</Text><Text className="carriage-section">({changeCarriageTypeIntoUkrainian(ticket.carriage_type)}, </Text><Text className={`carriage-class-section-${ticket.carriage_quality_class}`}>{ticket.carriage_quality_class}</Text><Text className="carriage-section">), </Text>
                                    <Text className="place-number">{ticket.place_in_carriage} місце</Text>
                                </div>
                                <div className="price-label">
                                    {ticket.price} грн
                                </div>
                            </div>
                        }
                    />
                ))}
            </Steps>
            <div style={{ marginTop: 25, textAlign: "center" }}>
                <Progress
                    type="circle"
                    percent={bookingProgress}
                    format={(percent) => percent === 0 ? `${potentialTicketCartState.totalSum}грн` : `${percent}%`}
                />
                {bookingProgress === 100 && (
                    <div style={{ marginTop: 20 }}>
                        <h3>Бронювання завершено!</h3>
                        <p>Квитки успішно заброньовані.</p>
                    </div>
                )}
            </div>
            <div style={{ marginTop: 25 }}>
                <Button type="primary" onClick={startBooking} disabled={running || steps.length === 0}>
                    {running ? <Spin /> : "Оплатити замовлення"}
                </Button>
            </div>

        </Card>
    );
}

export default TicketBookingCompletionResultPage;