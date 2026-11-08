import React, { useEffect, useRef, useState } from "react";
import { Carousel, ConfigProvider, Typography, Form, Button, message, Steps, Empty, Spin } from "antd";
import SingleTicketBookingConfirmationInfoComponent
    from "../SingleTicketBookingArrangementInfo/SingleTicketBookingConfirmationInfoComponent.jsx";
import {useNavigate} from "react-router-dom";
import {
    CloseCircleFilled,
    ClockCircleFilled,
    CheckCircleFilled,
    SearchOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import {TicketTimer} from "../../../../../SystemUtils/UserTicketCart/TicketTimer/TicketTimer.jsx";
import {
    ticketBookingProcessingService
} from "../../../../../SystemUtils/UserTicketCart/TicketManagementService/TicketBookingProcessingService.js";
import "./TicketBookingsCarousel.css";


const { Text } = Typography;

// Кольори каруселі: латунний акцент замість стандартного синього antd
const bookingTheme = {
    token: {
        colorPrimary: "#d9a441",
        colorError: "#c62828",
        borderRadius: 6
    },
    components: {
        Button: {
            primaryColor: "#101f2a"
        }
    }
};

function TicketBookingsCarousel({tickets, loading, onSubmit, potentialTicketCartState, potentialTicketCartDispatch})
{
    const [form] = Form.useForm();
    const carouselRef = useRef(null);
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();

    const total = tickets.length;
    const renderStepItems = tickets.map((t, idx) => {
        const isCurrent = idx === current;

        if (t.ticket_status === "EXPIRED") {
            return {
                title: <span className="rwb-step__title rwb-step__title--warn">Квиток {idx + 1}</span>,
                status: 'error',
                icon: <ClockCircleFilled style={{ color: '#c78a00' }} />,
                description: <span className="rwb-step__note rwb-step__note--warn">Резервація прострочена</span>
            };
        }

        if (t.ticket_status !== "RESERVED") {
            return {
                title: <span className="rwb-step__title rwb-step__title--error">Квиток {idx + 1}</span>,
                status: 'error',
                icon: <CloseCircleFilled style={{ color: '#c62828' }} />,
                description: <span className="rwb-step__note rwb-step__note--error">Місце зайняте</span>
            };
        }

        return {
            title: <span className={`rwb-step__title rwb-step__title--${isCurrent ? 'current' : 'ok'}`}>Квиток {idx + 1}</span>,
            status: 'finish',
            icon: <CheckCircleFilled style={{ color: isCurrent ? '#c79227' : '#2e7d4f' }} />,
            description: (
                <>
                    <span className={`rwb-step__note rwb-step__note--${isCurrent ? 'current' : 'ok'}`}>
                        {'Успішно зарезервовано'}
                    </span>
                    <span className="rwb-step__timer">
                        <TicketTimer
                            expirationTime={t.booking_expiration_time}
                            onExpire={() => {
                                potentialTicketCartDispatch({
                                    type: "CHANGE_TICKET_STATUS_FOR_CART",
                                    ticket: { ...t, ticket_status: "EXPIRED" }
                                });
                            }}
                        />
                    </span>
                </>
            )
        };
    });

    const handleConfirm = () => {
        const values = form.getFieldsValue();
        ticketBookingProcessingService.FILL_TICKETS_WITH_PASSENGER_INFO(tickets, values, potentialTicketCartDispatch);
        navigate("/ticket-booking-completion");
    }
    useEffect(() => {
        if (tickets.length > 0) {
            const initialPassengers = tickets.map(t => ({
                firstName: t.passenger_trip_info?.passenger_name || "",
                lastName: t.passenger_trip_info?.passenger_surname || ""
            }));
            form.setFieldsValue({ passengers: initialPassengers });
        }
    }, [tickets, form]);

    const handleStepChange = (step) => {
        carouselRef.current?.goTo(step);
        setCurrent(step);
    };
    const go = async (delta) => {
        const target = Math.min(Math.max(current + delta, 0), total - 1);
        carouselRef.current?.goTo(target);
        setCurrent(target);
    };
    return (
        <ConfigProvider theme={bookingTheme}>
        <section className="rwb">
            <header className="rwb__board">
                <div>
                    <span className="rwb__eyebrow">Shevchenko Railway</span>
                    <h2 className="rwb__title">Оформлення квитків</h2>
                </div>
                {!loading && total > 0 && (
                    <span className="rwb__count">Квитків у кошику: {total}</span>
                )}
            </header>
            <div className="rwb__body">
                {loading ? (
                        <div className="rwb__state">
                            <Spin size="large" tip="Завантаження квитків..." />
                        </div>
                ) : total > 0 ? (
                    <>
                    <Steps
                        size="small"
                        current={current}
                        onChange={handleStepChange}
                        items={renderStepItems}
                        type="navigation"
                    />
                <Form form={form} layout="vertical">
                    <Carousel
                        ref={carouselRef}
                        dots
                        infinite={false}
                        draggable
                        adaptiveHeight
                        afterChange={(i) => setCurrent(i)}
                    >
                        {tickets.map((t, idx) => (
                            <div key={`ticket-slide-${idx}`} className="rwb__slide">
                                <SingleTicketBookingConfirmationInfoComponent
                                    ticket={t}
                                    index={idx}
                                    total={total}
                                    namePrefix={["passengers", idx]}
                                    potentialTicketCartState={potentialTicketCartState}
                                    potentialTicketCartDispatch={potentialTicketCartDispatch}
                                />
                            </div>
                        ))}
                    </Carousel>

                    <div className="rwb__nav">
                        <Button onClick={() => {go(-1)}} disabled={current === 0}>
                            Назад
                        </Button>

                        <span className="rwb__counter">
                            {current + 1}/{total}
                        </span>

                        <div className="rwb__nav-right">
                            <Button
                                onClick={() => {go(+1)}}
                                disabled={current === total - 1}
                            >
                                Далі
                            </Button>
                            <Button type="primary" onClick={() => handleConfirm()}>
                                Підтвердити
                            </Button>
                        </div>
                    </div>
                </Form>
                    </>) :(
                    <div className="rwb__state">
                        <Empty
                            image={<ShoppingCartOutlined style={{ fontSize: 64, color: '#a89a78' }} />}
                            description={
                                <span>
                                    <Text strong style={{ fontSize: '16px', display: 'block', fontWeight: "bold" }}>Ваш кошик квитків порожній</Text>
                                    <Text type="secondary" style = {{fontWeight: 500}}>Поверніться до пошуку доступних поїздів і оберіть квитки для подорожі</Text>
                                </span>
                            }
                        >
                            <Button type="primary" shape="round" icon={<SearchOutlined />} onClick={() => navigate('/')}>
                                До пошуку
                            </Button>
                        </Empty>
                    </div>
                )}
            </div>
        </section>
        </ConfigProvider>
    );
}
export default TicketBookingsCarousel;



// const handleConfirm = () =>
// {
//     const values = form.getFieldsValue();
//     const completedTicketsWithPassengerTripInfo = tickets.map((ticket, idx) => {
//         const passenger_info = values.passengers?.[idx] || {};
//         return {
//             ...ticket,
//             status: "RESERVED_WITH_PASSENGER_TRIP_INFO",
//             passenger_trip_info: {
//                 passenger_name: passenger_info.firstName || "",
//                 passenger_surname: passenger_info.lastName || ""
//             }
//         };
//     });
//     potentialTicketCartDispatch({type: "CLEAR_CART"});
//     for(const ticket of completedTicketsWithPassengerTripInfo)
//     {
//         potentialTicketCartDispatch({type: "ADD_TICKET", ticket: ticket});
//     }
//     localStorage.setItem("potentialTicketsCart", JSON.stringify({
//         potentialTicketsList: completedTicketsWithPassengerTripInfo}));
//     navigate("/ticket-booking-completion");
// }

// useEffect(() => {
//     form.setFieldsValue({
//         passengers: tickets.map(() => ({ firstName: "", lastName: "" })),
//     });
//     setCurrent(0);
// }, [total, form]);
