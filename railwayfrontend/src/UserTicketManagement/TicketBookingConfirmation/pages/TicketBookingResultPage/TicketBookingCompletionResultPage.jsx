import React, { useEffect, useReducer, useState } from "react";
import {useNavigate} from "react-router-dom";
import {
    initialPotentialTicketCartState,
    potentialTicketCartReducer
} from "../../../../../SystemUtils/UserTicketCart/UserPotentialTicketCartSystem.js";
import { Button, message, Typography, Progress, Spin, Empty } from 'antd';
import {
    CheckCircleFilled,
    ClockCircleFilled,
    CloseCircleFilled,
    UserOutlined,
    RightOutlined,
    CreditCardOutlined,
    SignatureOutlined,
    SearchOutlined,
    MailOutlined,
    ShoppingOutlined,
    LeftOutlined
} from '@ant-design/icons';
import "./TicketBookingCompletionResultPage.css";
import {
    stationTitleIntoUkrainian
} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/StationsDictionary.js";
import changeTrainRouteIdIntoUkrainian, {
    getTrainRouteIdFromTrainRaceId
} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TrainRoutesDictionary.js";
import {
    changeCarriageTypeIntoUkrainian
} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/CarriagesDictionaries.js";
import dayjs from 'dayjs';
import {
    ticketBookingProcessingService
} from "../../../../../SystemUtils/UserTicketCart/TicketManagementService/TicketBookingProcessingService.js";
import {TicketTimer} from "../../../../../SystemUtils/UserTicketCart/TicketTimer/TicketTimer.jsx";
const { Text, Title, Paragraph } = Typography;

const getClassTagStyle = (qualityClass) => {
    const classLetter = qualityClass?.toUpperCase();
    const colors = {
        'A': { text: '#cf1322', bg: '#fff1f0', border: '#ffa39e' }, // Червоний
        'B': { text: '#389e0d', bg: '#f6ffed', border: '#b7eb8f' }, // Зелений
        'C': { text: '#096dd9', bg: '#e6f7ff', border: '#91d5ff' }, // Синій
        'S': { text: '#531dab', bg: '#f9f0ff', border: '#d3adf7' }, // Фіолетовий
    };
    const style = colors[classLetter] || { text: '#595959', bg: '#fafafa', border: '#d9d9d9' };
    return {
        color: style.text,
        backgroundColor: style.bg,
        borderColor: style.border,
        borderWidth: '1px',
        borderStyle: 'solid'
    };
};

//January
function TicketBookingCompletionResultPage() {
    const [potentialTicketCartState, potentialTicketCartDispatch] = useReducer(potentialTicketCartReducer, initialPotentialTicketCartState);
    const [bookingProgress, setBookingProgress] = useState(0);
    const [steps, setSteps] = useState([])
    const [running, setRunning] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0);
    const [bookingStatus, setBookingStatus] = useState([]);
    const [statusLabel, setStatusLabel] = useState(<>
        Очікуємо на Ваше
        <br />
        підтвердження...
    </>);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    useEffect(() => {
        const onlyReservedTickets =
            ticketBookingProcessingService.GET_ONLY_RESERVED_TICKETS_FOR_BOOKING_COMPLETION_ON_SERVER(potentialTicketCartDispatch);
        setSteps(onlyReservedTickets);
        setBookingStatus(onlyReservedTickets?.map(() => "pending"));
    }, []);
    useEffect(() => {
        ticketBookingProcessingService.SAVE_POTENTIAL_TICKET_CART_TO_STORAGE(potentialTicketCartState);
    }, [potentialTicketCartState.potentialTicketsList]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (running) {
                e.preventDefault();
                e.returnValue = "Бронювання ще триває. Якщо ви закриєте сторінку, дані в кошику можуть не оновитися!";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [running]);


    const startBooking = async () => {
        setRunning(true);
        setBookingStatus(steps.map(() => "processing"));
        setStatusLabel(<>
            Перевіряємо доступність
            <br />
            місць...
        </>);
        setBookingProgress(20);
        await new Promise(r => setTimeout(r, 1500));
        setStatusLabel("Оформлюємо квитки на Вас...");
        setBookingProgress(40);
        try {
            const ticketBookingCompletionTransactionResult = await
                ticketBookingProcessingService.COMPLETE_MULTIPLE_TICKET_BOOKING_PURCHASE_TRANSACTION_ON_SERVER(steps);
            if (ticketBookingCompletionTransactionResult.ok) {
                setBookingProgress(60);
                setStatusLabel("Встановлюємо зв'язок з банком...");
                await new Promise(r => setTimeout(r, 1200));
                setBookingProgress(80);
                setStatusLabel("Надсилаємо на пошту...");
                localStorage.removeItem("potentialTicketsCart");
                window.dispatchEvent(new Event('cartUpdated'));
                await new Promise(r => setTimeout(r, 1600));
                setStatusLabel(
                    <>
                    Оформлено успішно!
                    <br />
                    Бажаємо Вам гарної поїздки!
                </>);
                setBookingStatus(steps.map(() => "finish"));
                setBookingProgress(100);
                messageApi.success("Всі квитки успішно оформлено! Електронні квитки надіслано на пошту.");
                setTimeout(() => {
                    ticketBookingProcessingService.CLEAR_POTENTIAL_TICKET_CART(potentialTicketCartDispatch);
                }, 1500);
            } else {
                const errorData = await ticketBookingCompletionTransactionResult.json().catch(() => ({}));
                const errorMsg = errorData.message || "Транзакція не вдалася. Перевірте статус бронювань(можливо, термін резервації одного з квитків закінчився)";
                setBookingStatus(steps.map(() => "error"));
                setBookingProgress(0);
                messageApi.error(errorMsg);
            }
        } catch (e) {
            setBookingStatus(steps.map(() => "error"));
            messageApi.error("Помилка з'єднання із сервером");
        } finally {
            setRunning(false);
        }
    };

    return (
        <div className="booking-page-wrapper">
            {contextHolder}
            <div className="booking-glass-container">
                <div className="booking-summary-panel">
                    <div className="summary-content">
                        <Title level={2} style={{ color: '#0052cc', marginTop: 0 }}>
                            {bookingProgress === 100 ? "Готово!" : "Оформлення"}
                        </Title>
                        <Text type="secondary" className="summary-subtitle">
                            {bookingProgress === 100 ? "Квитки збережено у вашому кабінеті і надіслано на електронну пошту" : "Уважно перевірте дані ваших квитків перед оплатою"}
                        </Text>

                        <div className="progress-section">
                            <Progress
                                type="circle"
                                percent={bookingProgress}
                                strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                                width={270}
                                format={(percent) => {
                                    const getIcon = () => {
                                        if (percent === 100) return <CheckCircleFilled style={{ color: '#52c41a', fontSize: '60px' }} />;
                                        if (percent >= 80) return <MailOutlined style={{ color: '#1890ff', fontSize: '60px' }} />;
                                        if (percent >= 60)  return <CreditCardOutlined style={{ color: '#1890ff', fontSize: '60px' }} />;
                                        if (percent >= 40) return <SignatureOutlined style={{ color: '#1890ff', fontSize: '60px' }} />;
                                        if (percent >= 20) return <SearchOutlined style={{ color: '#1890ff', fontSize: '60px' }} />;
                                        if (running) return <SearchOutlined style={{ color: '#1890ff', fontSize: '60px' }} />;
                                        return <ClockCircleFilled style={{ color: '#d9d9d9', fontSize: '60px' }} />;
                                    };
                                    return (
                                        <div className={`progress-text-wrapper ${running ? 'pulsing' : ''}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <div className="progress-icon-center" style={{ marginBottom: '10px' }}>
                                                {getIcon()}
                                            </div>
                                            <div className="progress-label-dynamic" style={{
                                                fontWeight: 700,
                                                whiteSpace: 'pre-line',
                                                fontSize: '14px',
                                                lineHeight: '1.4',
                                                padding: '0 20px'
                                            }}>
                                                {statusLabel}
                                            </div>
                                        </div>
                                    );
                                }}
                            />
                        </div>

                        <div className="status-display-area">
                            {bookingProgress === 100 ? (
                                <div className="payment-success-msg fade-in">
                                    <div className="success-icon-bg">
                                        <CreditCardOutlined style={{ color: '#52c41a' }} />
                                    </div>
                                    <Text strong style={{ fontSize: 16 }}>Оплачено успішно</Text>
                                </div>
                            ) : (
                                <div className="total-price-block">
                                    <Text className="total-label">До сплати:</Text>
                                    <Title level={2} className="total-value">{potentialTicketCartState.totalSum} ₴</Title>
                                </div>
                            )}
                        </div>

                        {bookingProgress === 100 ? (
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => navigate('/user-ticket-bookings/active')}
                                className="pay-button success-btn fade-in"
                                icon={<RightOutlined />}
                            >
                                До моїх квитків
                            </Button>
                        ) : (
                            <Button
                                type="primary"
                                size="large"
                                onClick={startBooking}
                                disabled={running || steps.length === 0}
                                className="pay-button"
                                icon={running ? <Spin size="small" /> : <CreditCardOutlined />}
                            >
                                {running ? "Обробка..." : "Оплатити замовлення"}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="booking-tickets-list">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 20,
                        paddingLeft: 10,
                        paddingRight: 10
                    }}>
                        <Title level={4} style={{ margin: 0 }}>
                            Ваші квитки ({steps.length})
                        </Title>

                        {bookingProgress < 100 && (
                            <Button
                                icon={<LeftOutlined />}
                                onClick={() => navigate("/ticket-booking")}
                                disabled={running}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: '#0052cc',
                                    fontWeight: 600,
                                    fontSize: '14px'
                                }}
                            >
                                Редагувати дані квитків
                            </Button>
                        )}
                    </div>
                    <div className="tickets-scroll-area">
                        {steps.length > 0 ? (
                        steps.map((ticket, idx) => {
                            const status = bookingStatus[idx];
                            const isProcessing = status === "processing";
                            const isFinish = status === "finish";
                            const isError = status === "error";

                            return (
                                <div key={ticket.id} className={`ticket-card-item ${status || 'pending'}`}>
                                    <div className="status-stripe"></div>
                                    <div className="ticket-card-content">
                                        <div className="ticket-row header-row">
                                            <div className="passenger-info">
                                                <UserOutlined className="icon" />
                                                <Text strong className="passenger-name">
                                                    {ticket.passenger_trip_info?.passenger_name} {ticket.passenger_trip_info?.passenger_surname}
                                                </Text>
                                            </div>

                                            <div className="status-badge" style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                backgroundColor: status === 'error' ? '#fff1f0' : '#f6ffed',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                border: `1px solid ${status === 'error' ? '#ffa39e' : '#d9f7be'}`,
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                            }}>

                                                {bookingProgress < 100 && status !== "error" && (
                                                    <div style={{
                                                        fontVariantNumeric: 'tabular-nums',
                                                        fontSize: '13px',
                                                        letterSpacing: '-0.2px'
                                                    }}>
                                                        <TicketTimer
                                                            expirationTime={ticket.booking_expiration_time}
                                                            onExpire={() => {
                                                                potentialTicketCartDispatch({
                                                                    type: "CHANGE_TICKET_STATUS_FOR_CART",
                                                                    ticket: { ...ticket, ticket_status: "EXPIRED" }
                                                                });
                                                                setBookingStatus(prev => {
                                                                    const next = [...prev];
                                                                    next[idx] = "error";
                                                                    return next;
                                                                });
                                                                messageApi.warning(`Час резервації місця ${ticket.place_in_carriage} вичерпано`);
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                {status === "error" && (
                                                    <Text strong style={{ color: '#cf1322', fontSize: '12px', whiteSpace: 'nowrap' }}>
                                                        Резервація прострочена
                                                    </Text>
                                                )}

                                                {bookingProgress < 100 && status !== "error" && (
                                                    <div style={{ width: '1px', height: '14px', backgroundColor: '#d9f7be' }}></div>
                                                )}

                                                <div className="status-icon" style={{ display: 'flex', alignItems: 'center' }}>
                                                    {isProcessing && <Spin size="small" />}
                                                    {isFinish && <CheckCircleFilled style={{ color: '#52c41a', fontSize: 18 }} />}
                                                    {isError && <CloseCircleFilled style={{ color: '#ff4d4f', fontSize: 18 }} />}
                                                    {status === 'pending' && <ClockCircleFilled style={{ color: '#d9d9d9', fontSize: 18 }} />}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ticket-row route-row">
                                            <div className="station-block from">
                                                <Text className="time">
                                                    {dayjs(ticket.trip_starting_station_departure_time).format('HH:mm')}
                                                </Text>

                                                <Text className="city">
                                                    {stationTitleIntoUkrainian(ticket.trip_starting_station)}
                                                </Text>

                                                <Text type="secondary" className="date-small">
                                                    {dayjs(ticket.trip_starting_station_departure_time).format('D MMMM')}
                                                </Text>
                                            </div>

                                            <div className="route-visual">
                                                <Text type="secondary" style={{fontSize: 13, fontWeight: '500'}}>
                                                    {changeTrainRouteIdIntoUkrainian(getTrainRouteIdFromTrainRaceId(ticket.train_race_id))} {stationTitleIntoUkrainian(ticket.full_route_starting_station)} - {stationTitleIntoUkrainian(ticket.full_route_ending_station)}
                                                </Text>
                                                <div className="line-with-arrow"></div>
                                            </div>

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

                                        <div className="ticket-details-footer">
                                            <div className="detail-tag">
                                                Вагон <span className="value">{ticket.carriage_position_in_squad}</span>
                                            </div>
                                            <div className="detail-tag">
                                                Місце <span className="value">{ticket.place_in_carriage}</span>
                                            </div>
                                            <div className="detail-tag">
                                                {changeCarriageTypeIntoUkrainian(ticket.carriage_type)}
                                            </div>
                                            <div className="detail-tag class-tag" style={getClassTagStyle(ticket.carriage_quality_class)}>
                                                Клас {ticket.carriage_quality_class}
                                            </div>
                                            <div className="ticket-price">
                                                {ticket.price} ₴
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })): (
                            <div style={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '20px',
                                textAlign: 'center'
                            }}>
                                <Empty
                                    image={<ShoppingOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
                                    imageStyle={{ height: 70 }}
                                    description={
                                        <div style={{ marginTop: 16 }}>
                                            <Text strong style={{ fontSize: '18px', display: 'block', color: '#595959' }}>
                                                Ваш кошик квитків порожній
                                            </Text>
                                            <Text type="secondary" style = {{fontWeight: '500'}}>
                                                Ймовірно, час тимчасової резервації квитків минув <br />
                                                або ви ще не додали квитки.
                                            </Text>
                                        </div>
                                    }
                                >
                                    <Button
                                        type="default"
                                        shape="round"
                                        icon={<SearchOutlined />}
                                        onClick={() => navigate('/')}
                                    >
                                        Повернутися до пошуку
                                    </Button>
                                </Empty>
                            </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TicketBookingCompletionResultPage;



// useEffect(() => {
//     try {
//         localStorage.setItem("potentialTicketsCart", JSON.stringify({
//             potentialTicketsList: potentialTicketCartState.potentialTicketsList
//         }));
//         window.dispatchEvent(new Event('cartUpdated'));
//     } catch (error) {
//         console.error(error);
//     }
// }, [potentialTicketCartState.potentialTicketsList]);

// const startBooking = async () => {
//     setRunning(true);
//     setBookingStatus(steps.map(() => "processing"));
//     setStatusLabel(<>
//         Перевіряємо доступність
//         <br />
//         місць...
//     </>);
//     setBookingProgress(20);
//     await new Promise(r => setTimeout(r, 1500));
//     setStatusLabel("Оформлюємо квитки на Вас...");
//     setBookingProgress(40);
//     const token = localStorage.getItem("token");
//
//     //НЕОБІХІДНО ВИРІШИТИ ПРОБЛЕМУ з passenger_trip_info, якщо перехід відбувається не централізованим методом
//     const ticket_completion_info_list = steps.map(ticket => ({
//         mediator_ticket_booking: {
//             id: ticket.id,
//             full_ticket_id: ticket.full_ticket_id,
//             user_id: ticket.user_id,
//             train_route_on_date_id: ticket.train_race_id,
//             passenger_carriage_id: ticket.passenger_carriage_id,
//             passenger_carriage_position_in_squad: ticket.carriage_position_in_squad,
//             place_in_carriage: ticket.place_in_carriage,
//             starting_station_title: ticket.trip_starting_station,
//             ending_station_title: ticket.trip_ending_station,
//             ticket_status: "Booking_In_Progress",
//             booking_initialization_time: ticket.booking_initialization_time,
//             booking_expiration_time: ticket.booking_expiration_time
//         },
//         passenger_info: {
//             passenger_name: ticket.passenger_trip_info.passenger_name,
//             passenger_surname: ticket.passenger_trip_info.passenger_surname
//         }
//     }));
//
//     const final_payload = {
//         ticket_completion_info_list: ticket_completion_info_list
//     };
//
//     try {
//         const response = await fetch(`${SERVER_URL}/Client-API/CompleteTicketBookingProcessing/Complete-Multiple-Ticket-Bookings-As-Transaction`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify(final_payload)
//         });
//
//         if (response.ok) {
//             setBookingProgress(60);
//             setStatusLabel("Встановлюємо зв'язок з банком...");
//             await new Promise(r => setTimeout(r, 1200));
//             setBookingProgress(80);
//             setStatusLabel("Надсилаємо на пошту...");
//             localStorage.removeItem("potentialTicketsCart");
//             window.dispatchEvent(new Event('cartUpdated'));
//             await new Promise(r => setTimeout(r, 1600));
//             setStatusLabel(
//                 <>
//                     Оформлено успішно!
//                     <br />
//                     Бажаємо Вам гарної поїздки!
//                 </>);
//             setBookingStatus(steps.map(() => "finish"));
//             setBookingProgress(100);
//             messageApi.success("Всі квитки успішно оформлено! Електронні квитки надіслано на пошту.");
//
//             // Очищення кошика після успіху
//             setTimeout(() => {
//                 potentialTicketCartDispatch({ type: "CLEAR_CART" });
//                 // Можна додати редирект на сторінку "Мої квитки"
//             }, 1500);
//         } else {
//             // Помилка транзакції: отримуємо текст помилки від сервера
//             const errorData = await response.json().catch(() => ({}));
//             const errorMsg = errorData.message || "Транзакція не вдалася. Перевірте статус бронювань(можливо, термін резервації одного з квитків закінчився)";
//
//             setBookingStatus(steps.map(() => "error"));
//             setBookingProgress(0);
//             messageApi.error(errorMsg);
//         }
//     } catch (e) {
//         setBookingStatus(steps.map(() => "error"));
//         messageApi.error("Помилка з'єднання із сервером");
//     } finally {
//         setRunning(false);
//     }
// };