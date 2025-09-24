import React, { useEffect, useRef, useState } from "react";
import { Carousel, Card, Space, Typography, Form, Button, message } from "antd";
import SingleTicketBookingConfirmationInfoComponent
    from "../SingleTicketBookingArrangementInfo/SingleTicketBookingConfirmationInfoComponent.jsx";


const { Title, Text } = Typography;
function TicketBookingsCarousel({tickets, onSubmit, potentialTicketCartState, potentialTicketCartDispatch})
{
    const [form] = Form.useForm();
    const carouselRef = useRef(null);
    const [current, setCurrent] = useState(0);
    const total = tickets.length;
    useEffect(() => {
        form.setFieldsValue({
            passengers: tickets.map(() => ({ firstName: "", lastName: "" })),
        });
        setCurrent(0);
    }, [total, tickets, form]);
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
                            <Button type="primary" onClick={() => {}}>
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