import React, {useEffect, useReducer} from "react";
import {useNavigate} from "react-router-dom";
import { Card, Descriptions, Form, Input, Typography, Button, Popconfirm, Space, Result, message } from "antd";
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
const { Text, Title } = Typography;
import {LeftOutlined} from "@ant-design/icons";
import { CloseCircleFilled, ClockCircleOutlined, UndoOutlined, ArrowLeftOutlined } from '@ant-design/icons';
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
    if (ticket.ticket_status === "EXPIRED") {
        return         (
            <>
            {contextHolder}
            <Card
                size="small"
                title={`Квиток ${index + 1} із ${total}`}
                extra={
                    <Space size={6}>
                        <Button
                            icon={<LeftOutlined />}
                            onClick={() => {returnToTrainTripBooking(ticket.train_race_id, ticket.trip_starting_station, ticket.trip_ending_station)}}
                            style={{
                                backgroundColor: '#e6f7ff',
                                color: '#0052cc',
                                borderColor: '#91d5ff',
                                fontWeight: 600,
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            До списку вагонів
                        </Button>

                        <Popconfirm
                            title="Скасувати бронь на цей квиток?"
                            okText="Так"
                            cancelText="Ні"
                            onConfirm={() => cancelTicketReservation(ticket)}
                        >
                            <Button
                                danger
                                icon={<CloseCircleFilled style={{ fontSize: '14px' }} />}
                                style={{
                                    backgroundColor: '#fff1f0',
                                    fontWeight: 600,
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                Скасувати бронь
                            </Button>
                        </Popconfirm>
                    </Space>
                }
            >
                <div className="ticket-two-col">
                    <div className="ticket-two-col__left">
                        <Descriptions size="small" column={1} bordered style={{ marginBottom: 16 }}>
                            <Descriptions.Item label="Поїзд" span={2}>
                                <Text className="train-route-id">{changeTrainRouteIdIntoUkrainian(getTrainRouteIdFromTrainRaceId(ticket.train_race_id))}</Text><Text className={`train-class-section-${ticket.train_route_quality_class}`}>({ticket.train_route_quality_class})</Text><Text className="station-title"> ({stationTitleIntoUkrainian(ticket.full_route_starting_station)}</Text><Text className="arrow"> →</Text><Text className="station-title">{stationTitleIntoUkrainian(ticket.full_route_ending_station)})</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Відправлення">
                                <Text className="station-title">{stationTitleIntoUkrainian(ticket.trip_starting_station)}</Text><Text className="station-time"> ({formatDM_HM(ticket.trip_starting_station_departure_time)})</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Прибуття">
                                <Text className="station-title">{stationTitleIntoUkrainian(ticket.trip_ending_station)}</Text><Text className="station-time"> ({formatDM_HM(ticket.trip_ending_station_arrival_time)})</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Вагон">
                                <Text className="carriage-number">№{ticket.carriage_position_in_squad}</Text><Text className="carriage-section"> ({changeCarriageTypeIntoUkrainian(ticket.carriage_type)}, </Text><Text className={`carriage-class-section-${ticket.carriage_quality_class}`}>{ticket.carriage_quality_class}</Text><Text className="carriage-section">)</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Місце у вагоні">
                                <Text className="place-number">{ticket.place_in_carriage}, {UpperOrLower(ticket.place_in_carriage)}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Ціна">
                                <Text className="place-number">{ticket.price} грн</Text>
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                    <div className="ticket-two-col__right" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '16px',
                        minWidth: '240px'
                    }}>
                        <Result
                            style={{ padding: 0, marginTop: -10 }}
                            icon={<ClockCircleOutlined style={{ color: '#faad14', fontSize: '64px' }} />}
                            title={
                                <Title level={4} style={{ margin: '-20px 0 -5px 0', color: '#faad14', fontSize: '20px', lineHeight: '1.3' }}>
                                    Час резерву вийшов
                                </Title>
                            }
                            subTitle={
                                <Text type="secondary" style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginTop: '0px', marginBottom: '0px' }}>
                                    Тимчасова резервація квитка для Вашої покупки закінчилась. Поверніться до списку вагонів, видаліть місце з кошику
                                    та спробуйте повторно його забронювати. Або оберіть інші місця.
                                </Text>
                            }
                            extra={
                                <div style={{ marginTop: '-15px' }}>
                                    <Button
                                        type="primary"
                                        ghost
                                        size="middle"
                                        icon={<ArrowLeftOutlined />}
                                        style={{ borderRadius: '6px', fontSize: '14px', color: '#faad14',
                                            borderColor: '#faad14', }}
                                        onClick={() => navigate(-1)}
                                    >
                                        До списку вагонів
                                    </Button>
                                </div>
                            }
                        />
                    </div>
                </div>
            </Card>
            </>
        )
    }
    if(ticket.ticket_status !== "RESERVED")
    {
        return         (
            <>
                {contextHolder}
            <Card
            size="small"
            title={`Квиток ${index + 1} із ${total}`}
            extra={
                <Space size={6}>
                    <Button
                        icon={<LeftOutlined />}
                        onClick={() => {returnToTrainTripBooking(ticket.train_race_id, ticket.trip_starting_station, ticket.trip_ending_station)}}
                        style={{
                            backgroundColor: '#e6f7ff',
                            color: '#0052cc',
                            borderColor: '#91d5ff',
                            fontWeight: 600,
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        До списку вагонів
                    </Button>

                    <Popconfirm
                        title="Скасувати бронь на цей квиток?"
                        okText="Так"
                        cancelText="Ні"
                        onConfirm={() => cancelTicketReservation(ticket)}
                    >
                        <Button
                            danger
                            icon={<CloseCircleFilled style={{ fontSize: '14px' }} />}
                            style={{
                                backgroundColor: '#fff1f0',
                                fontWeight: 600,
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            Скасувати бронь
                        </Button>
                    </Popconfirm>
                </Space>
            }
        >
            <div className="ticket-two-col">
                <div className="ticket-two-col__left" style = {{opacity: 1}}>
                    <Descriptions size="small" column={1} bordered style={{ marginBottom: 16 }}>
                        <Descriptions.Item label="Поїзд" span={2}>
                            <Text className="train-route-id">{changeTrainRouteIdIntoUkrainian(getTrainRouteIdFromTrainRaceId(ticket.train_race_id))}</Text><Text className={`train-class-section-${ticket.train_route_quality_class}`}>({ticket.train_route_quality_class})</Text><Text className="station-title"> ({stationTitleIntoUkrainian(ticket.full_route_starting_station)}</Text><Text className="arrow"> →</Text><Text className="station-title">{stationTitleIntoUkrainian(ticket.full_route_ending_station)})</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Відправлення">
                            <Text className="station-title">{stationTitleIntoUkrainian(ticket.trip_starting_station)}</Text><Text className="station-time"> ({formatDM_HM(ticket.trip_starting_station_departure_time)})</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Прибуття">
                            <Text className="station-title">{stationTitleIntoUkrainian(ticket.trip_ending_station)}</Text><Text className="station-time"> ({formatDM_HM(ticket.trip_ending_station_arrival_time)})</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Вагон">
                            <Text className="carriage-number">№{ticket.carriage_position_in_squad}</Text><Text className="carriage-section"> ({changeCarriageTypeIntoUkrainian(ticket.carriage_type)}, </Text><Text className={`carriage-class-section-${ticket.carriage_quality_class}`}>{ticket.carriage_quality_class}</Text><Text className="carriage-section">)</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Місце у вагоні">
                            <Text className="place-number">{ticket.place_in_carriage}, {UpperOrLower(ticket.place_in_carriage)}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ціна">
                            <Text className="place-number">{ticket.price} грн</Text>
                        </Descriptions.Item>
                    </Descriptions>
                </div>
                <div className="ticket-two-col__right" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '16px',
                    minWidth: '240px'
                }}>
                    <Result
                        style={{ padding: 0, marginTop: -10 }}
                        icon={<CloseCircleFilled style={{ color: '#ff4d4f', fontSize: '64px' }} />}
                        title={
                            <Title level={4} style={{ margin: '-20px 0 -5px 0', color: '#cf1322', fontSize: '20px', lineHeight: '1.3' }}>
                                Місце вже зайняте
                            </Title>
                        }
                        subTitle={
                            <Text type="secondary" style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginTop: '0px', marginBottom: '0px' }}>
                                Інший пасажир встиг забронювати місце раніше за Вас. Поверніться до списку вагонів, видаліть місце з кошику
                                та спробуйте повторно його забронювати. Або оберіть інші місця.
                            </Text>
                        }
                        extra={
                            <div style={{ marginTop: '-15px' }}>
                                <Button
                                    danger
                                    size="middle"
                                    icon={<ArrowLeftOutlined />}
                                    style={{ borderRadius: '6px', fontSize: '14px' }}
                                    onClick={() => navigate(-1)}
                                >
                                    До списку вагонів
                                </Button>
                            </div>
                        }
                    />
                </div>
            </div>
        </Card>
            </>
        )
    }
    return (
        <>
            {contextHolder}
        <Card
            size="small"
            title={`Квиток ${index + 1} із ${total}`}
            extra={
                <Space size={6}>
                    <Button
                        icon={<LeftOutlined />}
                        onClick={() => {returnToTrainTripBooking(ticket.train_race_id, ticket.trip_starting_station, ticket.trip_ending_station)}}
                        style={{
                            backgroundColor: '#e6f7ff',
                            color: '#0052cc',
                            borderColor: '#91d5ff',
                            fontWeight: 600,
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        До списку вагонів
                    </Button>

                    <Popconfirm
                        title="Скасувати бронь на цей квиток?"
                        okText="Так"
                        cancelText="Ні"
                        onConfirm={() => cancelTicketReservation(ticket)}
                    >
                        <Button
                            danger
                            icon={<CloseCircleFilled style={{ fontSize: '14px' }} />}
                            style={{
                                backgroundColor: '#fff1f0',
                                fontWeight: 600,
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            Скасувати бронь
                        </Button>
                    </Popconfirm>
                </Space>
            }
        >
            <div className="ticket-two-col">
                <div className="ticket-two-col__left">
                    <Descriptions size="small" column={1} bordered style={{ marginBottom: 16 }}>
                        <Descriptions.Item label="Поїзд" span={2}>
                            <Text className="train-route-id">{changeTrainRouteIdIntoUkrainian(getTrainRouteIdFromTrainRaceId(ticket.train_race_id))}</Text><Text className={`train-class-section-${ticket.train_route_quality_class}`}>({ticket.train_route_quality_class})</Text><Text className="station-title"> ({stationTitleIntoUkrainian(ticket.full_route_starting_station)}</Text><Text className="arrow"> →</Text><Text className="station-title">{stationTitleIntoUkrainian(ticket.full_route_ending_station)})</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Відправлення">
                            <Text className="station-title">{stationTitleIntoUkrainian(ticket.trip_starting_station)}</Text><Text className="station-time"> ({formatDM_HM(ticket.trip_starting_station_departure_time)})</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Прибуття">
                            <Text className="station-title">{stationTitleIntoUkrainian(ticket.trip_ending_station)}</Text><Text className="station-time"> ({formatDM_HM(ticket.trip_ending_station_arrival_time)})</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Вагон">
                            <Text className="carriage-number">№{ticket.carriage_position_in_squad}</Text><Text className="carriage-section"> ({changeCarriageTypeIntoUkrainian(ticket.carriage_type)}, </Text><Text className={`carriage-class-section-${ticket.carriage_quality_class}`}>{ticket.carriage_quality_class}</Text><Text className="carriage-section">)</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Місце у вагоні">
                            <Text className="place-number">{ticket.place_in_carriage}, {UpperOrLower(ticket.place_in_carriage)}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ціна">
                            <Text className="place-number">{ticket.price} грн</Text>
                        </Descriptions.Item>
                    </Descriptions>
                </div>
                <div className="ticket-two-col__right">
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
                        <Input   allowClear />
                    </Form.Item>
                </div>
            </div>
        </Card>
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