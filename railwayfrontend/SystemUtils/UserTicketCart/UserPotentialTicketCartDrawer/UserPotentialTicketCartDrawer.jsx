import {Button, Divider, Drawer, Space, Typography, Tooltip, Badge} from "antd";
import {ShoppingCartOutlined, InfoCircleOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {stationTitleIntoUkrainian} from "../../InterpreterMethodsAndDictionaries/StationsDictionary.js";
import changeTrainRouteIdIntoUkrainian, {getTrainRouteIdFromTrainRaceId} from "../../InterpreterMethodsAndDictionaries/TrainRoutesDictionary.js";
import {changeCarriageTypeIntoUkrainian} from "../../InterpreterMethodsAndDictionaries/CarriagesDictionaries.js";
import "./UserPotentialTicketCartDrawer.css";
import {formatDM_HM} from "../../InterpreterMethodsAndDictionaries/TimeFormaters.js";
import {useNavigate, useLocation} from "react-router-dom";
import {
    changeTicketBookingCartStatusIntoUkrainian
} from "../../InterpreterMethodsAndDictionaries/TicketBookingStatusDictionary.js";
import {
    markTicketAsExpired,
} from "../UserPotentialTicketCartSystem.js";
import LoginRequiredModal from "../../LoginRequiredModal/LoginRequiredModal.jsx";
import {TicketTimer} from "../TicketTimer/TicketTimer.jsx";
import {ticketBookingProcessingService} from "../TicketManagementService/TicketBookingProcessingService.js";
import {userAuthenticationService} from "../../UserDefinerService/UserDefiner.js";

const { Text } = Typography;
function UserPotentialTicketCartDrawer({cartState, removePotentialTicketFromCart, dispatch})
{
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const handleCheckoutAttempt = async () => {
        const currentUser = userAuthenticationService.getCurrentUser();
        if (!currentUser) {
            setIsLoginModalOpen(true);
        } else {
            await ticketBookingProcessingService.INITIALIZE_TICKET_BOOKING_PROCESS(dispatch);
            navigate("/ticket-booking");
        }
    };
    const handleLoginRedirect = () => {
        setIsLoginModalOpen(false);
        navigate('/login',{ state: { from: location } });
    };
    const goToTrainTripBooking = (train_race_id, starting_station, ending_station) => {
        const targetPath = `/${train_race_id}/${starting_station}/${ending_station}/carriages`;
        if(location.pathname === targetPath)
        {
            return;
        }
        navigate(targetPath);
    }
    const tickets = cartState.potentialTicketsList;
    return (
        <>
            <Drawer
                open={cartState.potentialTicketsList.length > 0}
                placement="bottom"
                mask={false}
                height="202px"
                maskClosable={false}
                closable={true}
                title={
                    <Space align="center" size={8}>
                        <Badge count={cartState.potentialTicketsList.length} size="small" color="#1677ff">
                            <ShoppingCartOutlined style={{ fontSize: 18 }} />
                        </Badge>
                        <Text strong>Кошик квитків ({cartState.potentialTicketsList.length}/4)</Text>
                        <Tooltip title="Обрані місця для одного замовлення (до 4 в одному кошику)">
                            <InfoCircleOutlined style={{ color: "#999" }} />
                        </Tooltip>
                    </Space>
                }
                bodyStyle={{
                    padding: "3px",
                    overflowY: "auto",
                }}
                headerStyle={{
                    padding: "4px 12px",
                    minHeight: "40px",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                }}
            >
                {tickets.length === 0 ? (
                    <Text type="secondary">Кошик порожній</Text>
                ) : (
                    <div className="cart-wrapper">
                        <div className="cart-tickets-grid">
                            {tickets.map((potential_ticket, index) => (
                                <div
                                    key={`${potential_ticket.train_race_id}-${potential_ticket.carriage_position_in_squad}-${potential_ticket.place_in_carriage}-${potential_ticket.trip_starting_station}-${potential_ticket.trip_ending_station}-${index}`}
                                    className="cart-ticket"
                                >
                                    <div
                                        className="cart-ticket-info"
                                        style = {{cursor: "pointer"}}
                                        onClick = {() => goToTrainTripBooking(potential_ticket.train_race_id, potential_ticket.trip_starting_station, potential_ticket.trip_ending_station)}
                                    >
                                        <div className="cart-ticket-header">
                                            <b>Поїзд:</b> <Text className="train-route-id">{changeTrainRouteIdIntoUkrainian(getTrainRouteIdFromTrainRaceId(potential_ticket.train_race_id))}</Text> |&nbsp;
                                            <b>Вагон:</b> <Text className="carriage-number">{potential_ticket.carriage_position_in_squad}</Text><Text className="carriage-section">({changeCarriageTypeIntoUkrainian(potential_ticket.carriage_type)}, </Text><Text className={`carriage-class-section-${potential_ticket.carriage_quality_class}`}>{potential_ticket.carriage_quality_class}</Text><Text className="carriage-section">)</Text> |&nbsp;
                                            <b>Місце:</b> <Text className="place-number">{potential_ticket.place_in_carriage}</Text> |&nbsp;
                                            <b>Статус:</b> <Text className="place-number">{changeTicketBookingCartStatusIntoUkrainian(potential_ticket.ticket_status)}</Text>
                                            {potential_ticket.ticket_status === "RESERVED" && potential_ticket.booking_expiration_time && (
                                                <TicketTimer
                                                    expirationTime={potential_ticket.booking_expiration_time}
                                                    onExpire={() => {
                                                        markTicketAsExpired(potential_ticket);
                                                        dispatch({
                                                            type: "CHANGE_TICKET_STATUS_FOR_CART",
                                                            ticket: { ...potential_ticket, ticket_status: "EXPIRED" }
                                                        });
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className="cart-ticket-route">
                                            <Text className="station-title">{stationTitleIntoUkrainian(potential_ticket.trip_starting_station)}</Text><Text className="station-time">({formatDM_HM(potential_ticket.trip_starting_station_departure_time)})</Text><Text className="arrow">→</Text><Text className="station-title">{stationTitleIntoUkrainian(potential_ticket.trip_ending_station)}</Text><Text className="station-time">({formatDM_HM(potential_ticket.trip_ending_station_arrival_time)})</Text>
                                        </div>
                                    </div>
                                    <div className="cart-ticket-actions">
                                        <Text className="ticket-price-in-drawer" type="primary">
                                             {potential_ticket.price ?? 0} ₴
                                        </Text>
                                        <Button danger size="small" onClick={() => removePotentialTicketFromCart(potential_ticket)}>
                                            Скасувати
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>


                        <div className="cart-sidebar">
                            <div className="cart-total">
                                <Text strong>До сплати:</Text>
                                <Text strong className="cart-total-price">{cartState.totalSum} ₴</Text>
                            </div>
                            <Divider style={{ margin: "12px 0" }} />
                            <Button type="primary" block size="large" onClick={()=> handleCheckoutAttempt()}>
                                Оформити
                            </Button>
                            <Text type="secondary" className="cart-limit">
                                Обмеження: максимум 4 квитки в кошику.
                            </Text>
                        </div>
                    </div>
                )}
            </Drawer>
            <LoginRequiredModal
                open={isLoginModalOpen}
                onCancel={() => setIsLoginModalOpen(false)}
                onLoginRedirect={handleLoginRedirect}
            />
        </>
    );
}
export default UserPotentialTicketCartDrawer;



// const INITIALIZE_TICKET_BOOKING_PROCESS = async () =>  {
//     const potentialTicketsCart = localStorage.getItem("potentialTicketsCart");
//     const token = localStorage.getItem('token');
//     let ticketBookings = JSON.parse(potentialTicketsCart)?.potentialTicketsList ?? [];
//     //console.log("BOOKINGS IN CART");
//     //console.log(ticketBookings);
//
//     //ДОДАНА ЕКСПЕРИМЕНТАЛЬНА ЧАСТИНА
//     ticketBookings = ticketBookings.filter(ticket => ticket.ticket_status !== "BOOKING_FAILED"
//         && ticket.ticket_status !== "EXPIRED");
//
//
//     const ticketBookingsDtoForFetch = [];
//     for(const ticket of ticketBookings)
//     {
//         //ДОДАНО для перевірки статусу
//
//         const ticketDto = {
//             train_route_on_date_id: ticket.train_race_id,
//             passenger_carriage_position_in_squad: ticket.carriage_position_in_squad,
//             starting_station_title: ticket.trip_starting_station,
//             ending_station_title: ticket.trip_ending_station,
//             place_in_carriage: ticket.place_in_carriage
//         };
//         if(ticket.ticket_status === "SELECTED_YET_NOT_RESERVED")
//         {
//             ticketBookingsDtoForFetch.push(ticketDto);
//         }
//     }
//     const response = await fetch(`${SERVER_URL}/Client-API/CompleteTicketBookingProcessing/Initialize-Multiple-Ticket-Bookings`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(ticketBookingsDtoForFetch),
//     });
//     if(!response.ok)
//     {
//         throw new Error("Невірні облікові дані");
//     }
//     const ticketListReservationResult =  await response.json();
//
//
//     for(const ticket of ticketBookings)
//     {
//         if(ticket.ticket_status === "SELECTED_YET_NOT_RESERVED") {
//             console.log("FROM BACK");
//             console.log("IN LOCAL STORAGE");
//             console.log(ticketBookings);
//             const singleTicketBookingReservationResult = ticketListReservationResult.find(ticket_booking =>
//                 ticket_booking.train_route_on_date_id === ticket.train_race_id &&
//                 ticket_booking.passenger_carriage_position_in_squad === ticket.carriage_position_in_squad &&
//                 ticket_booking.starting_station_title === ticket.trip_starting_station &&
//                 ticket_booking.ending_station_title === ticket.trip_ending_station &&
//                 ticket_booking.place_in_carriage === ticket.place_in_carriage);
//             const ticketBookingReservationStatus = singleTicketBookingReservationResult?.ticket_status;
//             console.log(`STATUS: ${ticketBookingReservationStatus}`);
//             if (ticketBookingReservationStatus === "Booking_In_Progress") {
//                 ticket.ticket_status = "RESERVED";
//                 ticket.id = singleTicketBookingReservationResult.id;
//                 ticket.full_ticket_id = singleTicketBookingReservationResult.full_ticket_id;
//                 ticket.user_id = singleTicketBookingReservationResult.user_id;
//                 ticket.passenger_carriage_id = singleTicketBookingReservationResult.passenger_carriage_id;
//                 ticket.booking_initialization_time = singleTicketBookingReservationResult.booking_initialization_time;
//                 ticket.booking_expiration_time = singleTicketBookingReservationResult.booking_expiration_time;
//             } else {
//                 ticket.ticket_status = "BOOKING_FAILED";
//             }
//         }
//     }
//     console.log("TICKET BOOKINGS");
//     console.log(ticketBookings);
//     //potentialTicketCartDispatch({type: "CLEAR_CART"});
//     dispatch({type: "CLEAR_CART"});
//     for(const ticket of ticketBookings)
//     {
//         //potentialTicketCartDispatch({type: "ADD_TICKET", ticket: ticket});
//         dispatch({type: "ADD_TICKET", ticket: ticket});
//     }
//     localStorage.setItem("potentialTicketsCart", JSON.stringify({
//         potentialTicketsList: ticketBookings}));
//     window.dispatchEvent(new Event('cartUpdated'));
//     console.log("DATA");
//     navigate('/ticket-booking');
// }