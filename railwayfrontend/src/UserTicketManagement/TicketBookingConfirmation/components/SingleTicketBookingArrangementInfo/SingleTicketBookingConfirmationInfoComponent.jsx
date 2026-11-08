import React, {useEffect, useReducer} from "react";
import {useNavigate} from "react-router-dom";
import { Form, Input, Button, Popconfirm, message } from "antd";
import {
    stationTitleIntoUkrainian
} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/StationsDictionary.js";
import {
    changeCarriageTypeIntoUkrainian
} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/CarriagesDictionaries.js";
import changeTrainRouteIdIntoUkrainian, {
    getTrainRouteIdFromTrainRaceId
} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TrainRoutesDictionary.js";
import {formatDM_HM} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TimeFormaters.js";
import "./SingleTicketBookingConfirmationInfoComponent.css";
import {LeftOutlined} from "@ant-design/icons";
import { CloseCircleFilled, ArrowLeftOutlined } from '@ant-design/icons';
import { MdTrain } from "react-icons/md";
import {
    ticketBookingProcessingService
} from "../../../../../SystemUtils/UserTicketCart/TicketManagementService/TicketBookingProcessingService.js";
function UpperOrLower(number)
{
    if(number % 2 === 0)
    {
        return "верхнє";
    }
    else
    {
        return "нижнє";
    }

}
// "14 лютого, 18:36" -> час і дата окремо, щоб час можна було показати великим
function splitDateAndTime(value)
{
    const [date, time] = formatDM_HM(value).split(", ");
    return {date, time};
}
function SingleTicketBookingConfirmationInfoComponent({ticket, index, total, namePrefix, potentialTicketCartState, potentialTicketCartDispatch})
{
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const returnToTrainTripBooking = (train_race_id, starting_station, ending_station) => {
        navigate(`/${train_race_id}/${starting_station}/${ending_station}/carriages`);
    }
    const cancelTicketReservation = async () =>
    {
        try
        {
            await ticketBookingProcessingService.REMOVE_POTENTIAL_TICKET_FROM_CART_WITH_SERVER_TEMPORARY_RESERVATION_CANCELLATION(ticket, potentialTicketCartDispatch, messageApi);
        }
        catch(error)
        {
            console.error(error);
            messageApi.error("Не вдалося скасувати бронювання на сервері");
        }
    }

    if(!ticket)
    {
        return null;
    }

    const isExpired = ticket.ticket_status === "EXPIRED";
    const isReserved = ticket.ticket_status === "RESERVED";
    const departure = splitDateAndTime(ticket.trip_starting_station_departure_time);
    const arrival = splitDateAndTime(ticket.trip_ending_station_arrival_time);
    const stateClass = isExpired ? "rwt--expired" : isReserved ? "rwt--reserved" : "rwt--unavailable";

    return (
        <>
            {contextHolder}
            <article className={`rwt ${stateClass}`}>
                <div className="rwt__main">
                    <header className="rwt__head">
                        <span className="rwt__train-number">
                            {changeTrainRouteIdIntoUkrainian(getTrainRouteIdFromTrainRaceId(ticket.train_race_id))}
                        </span>
                        <span className={`rwt-class rwt-class--${ticket.train_route_quality_class}`}>
                            {ticket.train_route_quality_class}
                        </span>
                        <span className="rwt__head-route">
                            {stationTitleIntoUkrainian(ticket.full_route_starting_station)} → {stationTitleIntoUkrainian(ticket.full_route_ending_station)}
                        </span>
                        <span className="rwt__head-index">Квиток {index + 1} із {total}</span>
                    </header>

                    <div className="rwt__route">
                        <div className="rwt__stop">
                            <span className="rwt__label">Відправлення</span>
                            <span className="rwt__time">{departure.time}</span>
                            <span className="rwt__station">{stationTitleIntoUkrainian(ticket.trip_starting_station)}</span>
                            <span className="rwt__date">{departure.date}</span>
                        </div>
                        <div className="rwt__track" aria-hidden="true">
                            <span className="rwt__track-train"><MdTrain /></span>
                        </div>
                        <div className="rwt__stop rwt__stop--to">
                            <span className="rwt__label">Прибуття</span>
                            <span className="rwt__time">{arrival.time}</span>
                            <span className="rwt__station">{stationTitleIntoUkrainian(ticket.trip_ending_station)}</span>
                            <span className="rwt__date">{arrival.date}</span>
                        </div>
                    </div>

                    <dl className="rwt__facts">
                        <div className="rwt__fact">
                            <dt className="rwt__label">Тип вагона</dt>
                            <dd className="rwt__value">{changeCarriageTypeIntoUkrainian(ticket.carriage_type)}</dd>
                        </div>
                        <div className="rwt__fact">
                            <dt className="rwt__label">Клас вагона</dt>
                            <dd className="rwt__value">
                                <span className={`rwt-class rwt-class--${ticket.carriage_quality_class}`}>
                                    {ticket.carriage_quality_class}
                                </span>
                            </dd>
                        </div>
                        <div className="rwt__fact">
                            <dt className="rwt__label">Розташування</dt>
                            <dd className="rwt__value">{UpperOrLower(ticket.place_in_carriage)}</dd>
                        </div>
                        <div className="rwt__fact">
                            <dt className="rwt__label">Ціна</dt>
                            <dd className="rwt__value">{ticket.price} грн</dd>
                        </div>
                    </dl>

                    {isReserved && (
                        <div className="rwt__passenger">
                            <Form.Item
                                name={[...namePrefix, "firstName"]}
                                label="Ім'я пасажира"
                                rules={[
                                    { required: true, message: "Вкажіть ім'я" },
                                    { whitespace: true, message: "Ім'я не може бути порожнім" },
                                ]}
                            >
                                <Input allowClear />
                            </Form.Item>

                            <Form.Item
                                name={[...namePrefix, "lastName"]}
                                label="Прізвище пасажира"
                                rules={[
                                    { required: true, message: "Вкажіть прізвище" },
                                    { whitespace: true, message: "Прізвище не може бути порожнім" },
                                ]}
                            >
                                <Input allowClear />
                            </Form.Item>
                        </div>
                    )}

                    {!isReserved && (
                        <>
                            <div className="rwt__stamp" aria-hidden="true">
                                {isExpired ? "ПРОСТРОЧЕНО" : "ЗАЙНЯТО"}
                            </div>
                            <div className="rwt__notice">
                                <div className="rwt__notice-text">
                                    <p className="rwt__notice-title">
                                        {isExpired ? "Час резерву вийшов" : "Місце вже зайняте"}
                                    </p>
                                    <p className="rwt__notice-body">
                                        {isExpired
                                            ? "Тимчасова резервація квитка для Вашої покупки закінчилась. Поверніться до списку вагонів, видаліть місце з кошику та спробуйте повторно його забронювати. Або оберіть інші місця."
                                            : "Інший пасажир встиг забронювати місце раніше за Вас. Поверніться до списку вагонів, видаліть місце з кошику та спробуйте повторно його забронювати. Або оберіть інші місця."}
                                    </p>
                                </div>
                                <Button
                                    danger={!isExpired}
                                    icon={<ArrowLeftOutlined />}
                                    onClick={() => navigate(-1)}
                                >
                                    До списку вагонів
                                </Button>
                            </div>
                        </>
                    )}
                </div>

                <aside className="rwt__stub">
                    <div className="rwt__seat">
                        <div>
                            <span className="rwt__label">Вагон</span>
                            <span className="rwt__seat-number">{ticket.carriage_position_in_squad}</span>
                        </div>
                        <div>
                            <span className="rwt__label">Місце</span>
                            <span className="rwt__seat-number">{ticket.place_in_carriage}</span>
                        </div>
                    </div>
                    <div className="rwt__bars" aria-hidden="true"></div>
                    <div className="rwt__stub-actions">
                        <Button
                            icon={<LeftOutlined />}
                            onClick={() => {returnToTrainTripBooking(ticket.train_race_id, ticket.trip_starting_station, ticket.trip_ending_station)}}
                        >
                            До списку вагонів
                        </Button>
                        <Popconfirm
                            title="Скасувати бронь на цей квиток?"
                            okText="Так"
                            cancelText="Ні"
                            onConfirm={() => cancelTicketReservation(ticket)}
                        >
                            <Button danger icon={<CloseCircleFilled />}>
                                Скасувати бронь
                            </Button>
                        </Popconfirm>
                    </div>
                </aside>
            </article>
        </>
    );
}
export default SingleTicketBookingConfirmationInfoComponent;


// async function cancelTicketReservation(ticket)
// {
//     const token = localStorage.getItem("token");
//     potentialTicketCartDispatch({type: "REMOVE_TICKET", ticket: ticket});
//     const ticket_info = {
//         id: ticket.id,
//         full_ticket_id: ticket.full_ticket_id,
//         user_id: ticket.user_id,
//         train_route_on_date_id: ticket.train_race_id,
//         passenger_carriage_position_in_squad: ticket.carriage_position_in_squad,
//         passenger_carriage_id: ticket.passenger_carriage_id,
//         starting_station_title: ticket.trip_starting_station,
//         ending_station_title: ticket.trip_ending_station,
//         place_in_carriage: ticket.place_in_carriage,
//         ticket_status: ticket.ticket_status === "RESERVED" ? "Booking_In_Progress" : null,
//         booking_initialization_time: ticket.booking_initialization_time,
//         booking_expiration_time: ticket.booking_expiration_time
//     };
//     const response = await fetch(`${SERVER_URL}/Client-API/CompleteTicketBookingProcessing/Cancel-Ticket-Booking-Reservation`, {
//         method: 'DELETE',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(ticket_info)
//     });
//     if (!response.ok)
//     {
//         console.log(response);
//     }
// }
