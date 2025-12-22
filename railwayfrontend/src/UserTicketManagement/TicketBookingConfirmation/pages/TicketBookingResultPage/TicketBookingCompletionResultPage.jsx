import React, { useEffect, useReducer, useState } from "react";
import {
    initialPotentialTicketCartState,
    potentialTicketCartReducer
} from "../../../../../SystemUtils/UserTicketCart/UserPotentialTicketCartSystem.js";
import { SERVER_URL } from "../../../../../SystemUtils/ServerConnectionConfiguration/ConnectionConfiguration.js";
import { Button, message, Typography, Progress, Spin } from 'antd';
import {
    CheckCircleFilled,
    ClockCircleFilled,
    CloseCircleFilled,
    UserOutlined,
    RightOutlined,
    CreditCardOutlined
} from '@ant-design/icons';
import "./TicketBookingCompletionResultPage.css";
import {
    stationTitleIntoUkrainian
} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/StationsDictionary.js";
import { formatDM_HM } from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TimeFormaters.js";
import changeTrainRouteIdIntoUkrainian, {
    getTrainRouteIdFromTrainRaceId
} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TrainRoutesDictionary.js";
import {
    changeCarriageTypeIntoUkrainian
} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/CarriagesDictionaries.js";
import dayjs from 'dayjs';
const { Text, Title } = Typography;

function TicketBookingCompletionResultPage() {
    const [potentialTicketCartState, potentialTicketCartDispatch] = useReducer(potentialTicketCartReducer, initialPotentialTicketCartState);
    const [bookingProgress, setBookingProgress] = useState(0);
    const [steps, setSteps] = useState([])
    const [running, setRunning] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0);
    const [bookingStatus, setBookingStatus] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        try {
            const potentialTicketsCart = localStorage.getItem("potentialTicketsCart");
            if (potentialTicketsCart) {
                const parsed = JSON.parse(potentialTicketsCart);
                const list = parsed?.potentialTicketsList ?? parsed?.potentialTickets ?? [];
                setSteps(list);
                setBookingStatus(list.map(() => "pending"));
                potentialTicketCartDispatch({ type: "ALLOCATE_FROM_LOCAL_STORAGE", payload: JSON.parse(potentialTicketsCart) });
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem("potentialTicketsCart", JSON.stringify({
                potentialTicketsList: potentialTicketCartState.potentialTicketsList
            }));
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error(error);
        }
    }, [potentialTicketCartState.potentialTicketsList]);

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

        try {
            const response = await fetch(`${SERVER_URL}/Client-API/CompleteTicketBookingProcessing/Complete-Ticket-Booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(booking_confirmation_body)
            });
            if (response.ok) {
                setBookingProgress(Math.round(((index + 1) / steps.length) * 100));
            }
            return response.ok;
        } catch (e) {
            return false;
        }
    };

    const startBooking = async () => {
        setRunning(true);
        // Скидаємо статуси перед запуском, якщо це повторна спроба
        setBookingStatus(steps.map(() => "pending"));

        for (let i = 0; i < steps.length; i++) {
            setCurrentIndex(i);
            // Ставимо статус "processing" для поточного
            setBookingStatus(prev => {
                const newStatus = [...prev];
                newStatus[i] = "processing";
                return newStatus;
            });

            const ticket = steps[i];
            const userInfo = ticket.passenger_trip_info;

            await new Promise(r => setTimeout(r, 800));

            const success = await completeTicketBookingProcess(ticket, userInfo, i);

            setBookingStatus(prev => {
                const newStatus = [...prev];
                newStatus[i] = success ? "finish" : "error";
                return newStatus;
            });
        }
        setRunning(false);
        messageApi.success("Всі квитки успішно оформлено!");
        potentialTicketCartDispatch({ type: "CLEAR_CART" });
    }

    return (
        <div className="booking-page-wrapper">
            {contextHolder}
            <div className="booking-glass-container">
                <div className="booking-summary-panel">
                    <div className="summary-content">
                        <Title level={2} style={{ color: '#0052cc', marginTop: 0 }}>Оформлення</Title>
                        <Text type="secondary" className="summary-subtitle">Перевірка даних та оплата замовлення</Text>

                        <div className="progress-section">
                            <Progress
                                type="circle"
                                percent={bookingProgress}
                                strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                                width={140}
                                format={(percent) => (
                                    <div className="progress-text">
                                        <div className="progress-value">{percent === 100 ? "Готово!" : `${percent}%`}</div>
                                        <div className="progress-label">
                                            {percent === 0 ? "Очікування" : percent === 100 ? "Успішно" : "Обробка..."}
                                        </div>
                                    </div>
                                )}
                            />
                        </div>

                        <div className="total-price-block">
                            <Text className="total-label">До сплати:</Text>
                            <Title level={2} className="total-value">{potentialTicketCartState.totalSum} ₴</Title>
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            onClick={startBooking}
                            disabled={running || steps.length === 0 || bookingProgress === 100}
                            className="pay-button"
                            icon={running ? <Spin /> : <CreditCardOutlined />}
                        >
                            {running ? "Обробка..." : bookingProgress === 100 ? "Замовлення оплачено" : "Оплатити замовлення"}
                        </Button>
                    </div>
                </div>

                <div className="booking-tickets-list">
                    <Title level={4} style={{ marginBottom: 20, paddingLeft: 10 }}>Ваші квитки ({steps.length})</Title>

                    <div className="tickets-scroll-area">
                        {steps.map((ticket, idx) => {
                            const status = bookingStatus[idx];
                            const isProcessing = status === "processing";
                            const isFinish = status === "finish";
                            const isError = status === "error";

                            return (
                                <div key={ticket.id} className={`ticket-card-item ${status || 'pending'}`}>
                                    {/* Індикатор статусу зліва */}
                                    <div className="status-stripe"></div>

                                    <div className="ticket-card-content">
                                        {/* Верхня частина: Пасажир */}
                                        <div className="ticket-row header-row">
                                            <div className="passenger-info">
                                                <UserOutlined className="icon" />
                                                <Text strong className="passenger-name">
                                                    {ticket.passenger_trip_info.passenger_name} {ticket.passenger_trip_info.passenger_surname}
                                                </Text>
                                            </div>
                                            <div className="status-icon">
                                                {isProcessing && <Spin size="small" />}
                                                {isFinish && <CheckCircleFilled style={{ color: '#52c41a', fontSize: 20 }} />}
                                                {isError && <CloseCircleFilled style={{ color: '#ff4d4f', fontSize: 20 }} />}
                                                {status === 'pending' && <ClockCircleFilled style={{ color: '#d9d9d9', fontSize: 20 }} />}
                                            </div>
                                        </div>

                                        <div className="ticket-row route-row">
                                            {/* ЛІВА СТОРОНА (Відправлення) */}
                                            <div className="station-block from">
                                                {/* Виводимо час (година:хвилина) */}
                                                <Text className="time">
                                                    {dayjs(ticket.trip_starting_station_departure_time).format('HH:mm')}
                                                </Text>

                                                <Text className="city">
                                                    {stationTitleIntoUkrainian(ticket.trip_starting_station)}
                                                </Text>

                                                {/* Виводимо дату (день місяць) */}
                                                <Text type="secondary" className="date-small">
                                                    {dayjs(ticket.trip_starting_station_departure_time).format('D MMMM')}
                                                </Text>
                                            </div>

                                            {/* СЕРЕДИНА (Стрілочка і номер потяга) */}
                                            <div className="route-visual">
                                                <Text type="secondary" style={{fontSize: 12}}>
                                                    {changeTrainRouteIdIntoUkrainian(getTrainRouteIdFromTrainRaceId(ticket.train_race_id))}
                                                </Text>
                                                <div className="line-with-arrow"><RightOutlined /></div>
                                            </div>

                                            {/* ПРАВА СТОРОНА (Прибуття) */}
                                            <div className="station-block to">
                                                <Text className="time">
                                                    {dayjs(ticket.trip_ending_station_arrival_time).format('HH:mm')}
                                                </Text>

                                                <Text className="city">
                                                    {stationTitleIntoUkrainian(ticket.trip_ending_station)}
                                                </Text>

                                                <Text type="secondary" className="date-small">
                                                    {dayjs(ticket.trip_ending_station_arrival_time).format('D MMMM')}
                                                </Text>
                                            </div>
                                        </div>

                                        {/* Нижня частина: Вагон/Місце */}
                                        <div className="ticket-details-footer">
                                            <div className="detail-tag">
                                                Вагон <span className="value">{ticket.carriage_position_in_squad}</span>
                                            </div>
                                            <div className="detail-tag">
                                                Місце <span className="value">{ticket.place_in_carriage}</span>
                                            </div>
                                            <div className="detail-tag class-tag">
                                                {changeCarriageTypeIntoUkrainian(ticket.carriage_type)} {ticket.carriage_quality_class}
                                            </div>
                                            <div className="ticket-price">
                                                {ticket.price} ₴
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TicketBookingCompletionResultPage;