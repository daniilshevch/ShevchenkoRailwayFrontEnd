import { Button, Divider, Space, Typography, Tooltip, Badge, Alert } from "antd";
import { ShoppingCartOutlined, InfoCircleOutlined, ArrowRightOutlined, UndoOutlined, CheckCircleFilled,
    CloseCircleFilled,
    ExclamationCircleFilled,
    ClockCircleFilled } from "@ant-design/icons";
import React, { useReducer, useState, useEffect } from "react";
import { stationTitleIntoUkrainian } from "../../InterpreterMethodsAndDictionaries/StationsDictionary.js";
import changeTrainRouteIdIntoUkrainian, { getTrainRouteIdFromTrainRaceId } from "../../InterpreterMethodsAndDictionaries/TrainRoutesDictionary.js";
import { changeCarriageTypeIntoUkrainian } from "../../InterpreterMethodsAndDictionaries/CarriagesDictionaries.js";
import "../UserPotentialTicketCartDrawer/UserPotentialTicketCartDrawer.css";
import { formatDM_HM } from "../../InterpreterMethodsAndDictionaries//TimeFormaters.js";
import { SERVER_URL } from "../../ServerConnectionConfiguration/ConnectionConfiguration.js";
import { useNavigate, useLocation } from "react-router-dom";
import { changeTicketBookingCartStatusIntoUkrainian } from "../../InterpreterMethodsAndDictionaries/TicketBookingStatusDictionary.js";
import {
    initialPotentialTicketCartState,
    markTicketAsExpired,
    potentialTicketCartReducer
} from "./../UserPotentialTicketCartSystem.js";
import LoginRequiredModal from "../../LoginRequiredModal/LoginRequiredModal.jsx";
import {TicketTimer} from "../TicketTimer/TicketTimer.jsx";

const { Text, Title } = Typography;
const getStatusMarker = (status) => {
    switch (status) {
        case "RESERVED":
            return <CheckCircleFilled style={{ color: '#52c41a', fontSize: '22px' }} />;
        case "BOOKING_FAILED":
        case "EXPIRED":
            return <CloseCircleFilled style={{ color: '#ff4d4f', fontSize: '22px' }} />;
        case "SELECTED_YET_NOT_RESERVED":
            return <ClockCircleFilled style={{ color: '#1677ff', fontSize: '22px' }} />;
        default:
            return <ExclamationCircleFilled style={{ color: '#faad14', fontSize: '22px' }} />;
    }
};

function UserPotentialTicketCartPanel({ cartState, removePotentialTicketFromCart, dispatch }) {
    const navigate = useNavigate();
    const location = useLocation();
    //const [potentialTicketCartState, potentialTicketCartDispatch] = useReducer(potentialTicketCartReducer, initialPotentialTicketCartState);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const handleCheckoutAttempt = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoginModalOpen(true);
        } else {
            INITIALIZE_TICKET_BOOKING_PROCESS();
        }
    };
    const returnToTrainTripBooking = (train_race_id, starting_station, ending_station) => {
        navigate(`/${train_race_id}/${starting_station}/${ending_station}/carriages`);
    }

    const handleLoginRedirect = () => {
        setIsLoginModalOpen(false);
        navigate('/login', { state: { from: location } });
    };

    const INITIALIZE_TICKET_BOOKING_PROCESS = async () =>  {
        const potentialTicketsCart = localStorage.getItem("potentialTicketsCart");
        const token = localStorage.getItem('token');
        const ticketBookings = JSON.parse(potentialTicketsCart)?.potentialTicketsList ?? [];
        //console.log("BOOKINGS IN CART");
        //console.log(ticketBookings);
        const ticketBookingsDtoForFetch = [];
        for(const ticket of ticketBookings)
        {
            const ticketDto = {
                train_route_on_date_id: ticket.train_race_id,
                passenger_carriage_position_in_squad: ticket.carriage_position_in_squad,
                starting_station_title: ticket.trip_starting_station,
                ending_station_title: ticket.trip_ending_station,
                place_in_carriage: ticket.place_in_carriage
            };
            ticketBookingsDtoForFetch.push(ticketDto);
        }
        const response = await fetch(`${SERVER_URL}/Client-API/CompleteTicketBookingProcessing/Initialize-Multiple-Ticket-Bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(ticketBookingsDtoForFetch),
        });
        if(!response.ok)
        {
            throw new Error("Невірні облікові дані");
        }
        const ticketListReservationResult =  await response.json();


        for(const ticket of ticketBookings)
        {
            if(ticket.ticket_status === "SELECTED_YET_NOT_RESERVED") {
                console.log("FROM BACK");
                console.log("IN LOCAL STORAGE");
                console.log(ticketBookings);
                const singleTicketBookingReservationResult = ticketListReservationResult.find(ticket_booking =>
                    ticket_booking.train_route_on_date_id === ticket.train_race_id &&
                    ticket_booking.passenger_carriage_position_in_squad === ticket.carriage_position_in_squad &&
                    ticket_booking.starting_station_title === ticket.trip_starting_station &&
                    ticket_booking.ending_station_title === ticket.trip_ending_station &&
                    ticket_booking.place_in_carriage === ticket.place_in_carriage);
                const ticketBookingReservationStatus = singleTicketBookingReservationResult?.ticket_status;
                console.log(`STATUS: ${ticketBookingReservationStatus}`);
                if (ticketBookingReservationStatus === "Booking_In_Progress") {
                    ticket.ticket_status = "RESERVED";
                    ticket.id = singleTicketBookingReservationResult.id;
                    ticket.full_ticket_id = singleTicketBookingReservationResult.full_ticket_id;
                    ticket.user_id = singleTicketBookingReservationResult.user_id;
                    ticket.passenger_carriage_id = singleTicketBookingReservationResult.passenger_carriage_id;
                    ticket.booking_initialization_time = singleTicketBookingReservationResult.booking_initialization_time;
                    ticket.booking_expiration_time = singleTicketBookingReservationResult.booking_expiration_time;
                } else {
                    ticket.ticket_status = "BOOKING_FAILED";
                }
            }
        }
        console.log("TICKET BOOKINGS");
        console.log(ticketBookings);
        //potentialTicketCartDispatch({type: "CLEAR_CART"});
        dispatch({type: "CLEAR_CART"});
        for(const ticket of ticketBookings)
        {
            //potentialTicketCartDispatch({type: "ADD_TICKET", ticket: ticket});
            dispatch({type: "ADD_TICKET", ticket: ticket});
        }
        localStorage.setItem("potentialTicketsCart", JSON.stringify({
            potentialTicketsList: ticketBookings}));
        window.dispatchEvent(new Event('cartUpdated'));
        console.log("DATA");
        navigate('/ticket-booking');
    }

    const tickets = cartState.potentialTicketsList;

    return (
        <div className="cart-panel-inline" style={{ background: 'transparent' }}>
            <div style={{ padding: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Space size={12}>
                    <Badge count={tickets.length} color="#1677ff">
                        <ShoppingCartOutlined style={{ fontSize: 24, color: '#1677ff' }} />
                    </Badge>
                    <Title level={4} style={{ margin: 0 }}>Ваше поточне бронювання</Title>
                    <Tooltip title="Квитки зберігаються тут до завершення оплати або закінчення часу резерву">
                        <InfoCircleOutlined style={{ color: "#999" }} />
                    </Tooltip>
                </Space>
            </div>

            {tickets.length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center', background: '#fff', borderRadius: '12px' }}>
                    <Alert message="Кошик порожній. Оберіть місця в поїздах, щоб розпочати бронювання." type="info" showIcon />
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Список квитків: 2 в ряд */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '10px'
                    }}>
                        {tickets.map((potential_ticket, index) => (
                            <div
                                key={index}
                                className="cart-ticket"
                                style={{ margin: 0, width: '100%' }} // Картка з Drawer
                            >

                                <div className="cart-ticket-info">
                                    <div className="cart-ticket-header">
                                        <b>Поїзд:</b> <Text className="train-route-id">{changeTrainRouteIdIntoUkrainian(getTrainRouteIdFromTrainRaceId(potential_ticket.train_race_id))}</Text><Text className={`train-class-section-${potential_ticket.train_route_quality_class}`}>({potential_ticket.train_route_quality_class})</Text> |&nbsp;
                                        <b>Вагон:</b> <Text className="carriage-number">{potential_ticket.carriage_position_in_squad}</Text><Text className="carriage-section">({changeCarriageTypeIntoUkrainian(potential_ticket.carriage_type)}, </Text><Text className={`carriage-class-section-${potential_ticket.carriage_quality_class}`}>{potential_ticket.carriage_quality_class}</Text><Text className="carriage-section">)</Text> |&nbsp;
                                        <b>Місце:</b> <Text className="place-number">{potential_ticket.place_in_carriage}</Text> |&nbsp;
                                    </div>
                                    <div className="cart-ticket-route">
                                        <Text className="station-title">{stationTitleIntoUkrainian(potential_ticket.trip_starting_station)}</Text><Text className="station-time">({formatDM_HM(potential_ticket.trip_starting_station_departure_time)})</Text><Text className="arrow">→</Text><Text className="station-title">{stationTitleIntoUkrainian(potential_ticket.trip_ending_station)}</Text><Text className="station-time">({formatDM_HM(potential_ticket.trip_ending_station_arrival_time)})</Text>
                                    </div>
                                    <div>
                                        <b>Статус бронювання:</b> <Text className="place-number">{changeTicketBookingCartStatusIntoUkrainian(potential_ticket.ticket_status)}</Text>
                                        {potential_ticket.ticket_status === "RESERVED" && potential_ticket.booking_expiration_time && (
                                            <TicketTimer
                                                expirationTime={potential_ticket.booking_expiration_time}
                                                onExpire={() => {
                                                    markTicketAsExpired(potential_ticket);
                                                    console.log("Час резерву вийшов для квитка", potential_ticket.id);
                                                    dispatch({
                                                        type: "CHANGE_TICKET_STATUS_FOR_CART",
                                                        ticket: { ...potential_ticket, ticket_status: "EXPIRED" }
                                                    });
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="cart-ticket-actions">
                                    <Text className="ticket-price-in-drawer" type="primary">
                                        {potential_ticket.price ?? 0} ₴
                                    </Text>
                                    <Button danger size="small" onClick={() => removePotentialTicketFromCart(potential_ticket)}>
                                        Скасувати
                                    </Button>
                                    <Button
                                        size="small"
                                        icon={<UndoOutlined />}
                                        style={{
                                            width: '100%',
                                            fontSize: '12px',
                                            color: '#1677ff',
                                            borderColor: '#1677ff'
                                        }}
                                        onClick={() => returnToTrainTripBooking(
                                            potential_ticket.train_race_id,
                                            potential_ticket.trip_starting_station,
                                            potential_ticket.trip_ending_station
                                        )}
                                    >
                                        До броні
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Панель підсумку знизу (горизонтальна) */}
                    <div style={{
                        background: '#fff',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '2px solid #1677ff22',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <Text type="secondary" style={{ fontSize: '18px', fontWeight: 600 }}>Разом до сплати:</Text>
                            <div style={{ fontSize: '32px', fontWeight: '800', color: '#1677ff', lineHeight: 1 }}>
                                {cartState.totalSum} ₴
                            </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleCheckoutAttempt}
                                style={{ height: '54px', padding: '0 40px', fontSize: '18px', fontWeight: '600', borderRadius: '10px' }}
                            >
                                Оформити замовлення <ArrowRightOutlined />
                            </Button>
                            <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
                                Максимум 4 квитки в одному замовленні
                            </Text>
                        </div>
                    </div>
                </div>
            )}

            <LoginRequiredModal
                open={isLoginModalOpen}
                onCancel={() => setIsLoginModalOpen(false)}
                onLoginRedirect={handleLoginRedirect}
            />
        </div>
    );
}

export default UserPotentialTicketCartPanel;