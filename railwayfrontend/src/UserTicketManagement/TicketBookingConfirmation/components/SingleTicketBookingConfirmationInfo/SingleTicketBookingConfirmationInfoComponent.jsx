import React from "react";
import { Card, Descriptions, Form, Input, Typography } from "antd";
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
const { Text } = Typography;
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
function SingleTicketBookingConfirmationInfoComponent({ticket, index, total, namePrefix})
{
    if(!ticket)
    {
        return null;
    }
    return (
        <Card
            size="small"
            title={`Квиток ${index + 1} із ${total}`}
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
                        name={[namePrefix, "firstName"]}
                        label="Ім'я пасажира"
                        rules={[
                            { required: true, message: "Вкажіть ім'я" },
                            { whitespace: true, message: "Ім'я не може бути порожнім" },
                        ]}
                    >
                        <Input allowClear />
                    </Form.Item>

                    <Form.Item
                        name={[namePrefix, "lastName"]}
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
    );
}
export default SingleTicketBookingConfirmationInfoComponent;