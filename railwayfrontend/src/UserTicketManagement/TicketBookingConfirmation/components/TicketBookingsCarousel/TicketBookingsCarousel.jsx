import React, { useEffect, useRef, useState } from "react";
import { Carousel, Card, Space, Typography, Form, Button, message, Steps } from "antd";
import SingleTicketBookingConfirmationInfoComponent
    from "../SingleTicketBookingArrangementInfo/SingleTicketBookingConfirmationInfoComponent.jsx";
import {useNavigate} from "react-router-dom";
import {
    CloseCircleFilled,
    ClockCircleFilled,
    CheckCircleFilled,
    InfoCircleFilled
} from '@ant-design/icons';
import {TicketTimer} from "../../../../../SystemUtils/UserTicketCart/TicketTimer/TicketTimer.jsx";


const { Title, Text } = Typography;
function TicketBookingsCarousel({tickets, onSubmit, potentialTicketCartState, potentialTicketCartDispatch})
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
                title: <span style={{fontWeight: 500, color: '#faad14' }}>Квиток {idx + 1}</span>,
                status: 'error', // Використовуємо для системного підсвічування, але іконку замінимо
                icon: <ClockCircleFilled style={{ color: '#faad14' }} />,
                description: <span style={{ color: '#faad14', fontSize: '12px', fontWeight: 'bold', marginLeft: '-60px' }}>Резервація прострочена</span>
            };
        }

        if (t.ticket_status !== "RESERVED") {
            return {
                title: <span style={{fontWeight: 500, color: '#ff4d4f' }}>Квиток {idx + 1}</span>,
                status: 'error',
                icon: <CloseCircleFilled style={{ color: '#ff4d4f' }} />,
                description: <span style={{ color: '#ff4d4f', fontSize: '12px', fontWeight: 'bold', marginLeft: '-30px' }}>Місце зайняте</span>
            };
        }

        return {
            title: <span style={{fontWeight: 500, color: isCurrent ? '#1890ff' : '#52c41a' }}>Квиток {idx + 1}</span>,
            status: 'finish',
            icon: <CheckCircleFilled style={{ color: isCurrent ? '#1890ff' : '#52c41a' }} />,
            description: (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    lineHeight: '1.2',
                    marginTop: '4px'
                }}>
                    <Text style={{ fontSize: '12px',fontWeight: 'bold', color: isCurrent ? '#1890ff' : '#52c41a', marginLeft: '-50px' }}>
                        {'Успішно зарезервовано'}
                    </Text>
                    <div style = {{marginLeft: '-40px'}}>
                        <TicketTimer
                            expirationTime={t.booking_expiration_time}
                            onExpire={() => {
                                potentialTicketCartDispatch({
                                    type: "CHANGE_TICKET_STATUS_FOR_CART",
                                    ticket: { ...t, ticket_status: "EXPIRED" }
                                });
                            }}
                        />
                    </div>
                </div>
            )
        };
    });
    const handleConfirm = () =>
    {
        const values = form.getFieldsValue();
        const completedTicketsWithPassengerTripInfo = tickets.map((ticket, idx) => {
            const passenger_info = values.passengers?.[idx] || {};
            return {
                ...ticket,
                status: "RESERVED_WITH_PASSENGER_TRIP_INFO",
                passenger_trip_info: {
                    passenger_name: passenger_info.firstName || "",
                    passenger_surname: passenger_info.lastName || ""
                }
            };
        });
        potentialTicketCartDispatch({type: "CLEAR_CART"});
        for(const ticket of completedTicketsWithPassengerTripInfo)
        {
            potentialTicketCartDispatch({type: "ADD_TICKET", ticket: ticket});
        }
        localStorage.setItem("potentialTicketsCart", JSON.stringify({
            potentialTicketsList: completedTicketsWithPassengerTripInfo}));
        console.log(completedTicketsWithPassengerTripInfo);
        navigate("/ticket-booking-completion");
    }
    useEffect(() => {
        form.setFieldsValue({
            passengers: tickets.map(() => ({ firstName: "", lastName: "" })),
        });
        setCurrent(0);
    }, [total, form]);
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
        <Card style={{ maxWidth: 1000, margin: "0 auto" }} bodyStyle={{ padding: 16 }}>
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <Title level={4} style={{ margin: 0 }}>
                    Оформлення квитків
                </Title>
                <div style={{ marginBottom: 20 }}>
                    <Steps
                        size="small"
                        current={current}
                        onChange={handleStepChange}
                        items={renderStepItems}
                        type="navigation" // Робить кроки більш схожими на кнопки-вкладки
                        style={{ padding: '0px 0' }}
                    />
                </div>
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
                            <div key={`ticket-slide-${idx}`}>
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

                    <Space
                        style={{ marginTop: 16, width: "100%", justifyContent: "space-between" }}
                    >
                        <Button onClick={() => {go(-1)}} disabled={current === 0}>
                            Назад
                        </Button>

                        <Text type="secondary">
                            {current + 1}/{total}
                        </Text>

                        <Space>
                            <Button
                                type="primary"
                                onClick={() => {go(+1)}}
                                disabled={current === total - 1}
                            >
                                Далі
                            </Button>
                            <Button type="primary" onClick={() => handleConfirm()}>
                                Підтвердити
                            </Button>
                        </Space>
                    </Space>
                </Form>
            </Space>
        </Card>
    );
}
export default TicketBookingsCarousel;