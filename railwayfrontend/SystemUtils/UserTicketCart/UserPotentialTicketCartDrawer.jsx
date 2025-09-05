import {Button, Divider, Drawer, Space, Typography} from "antd";
import React from "react";
const { Text } = Typography;
import {stationTitleIntoUkrainian} from "../InterpreterDictionaries/StationsDictionary.js";
import changeTrainRouteIdIntoUkrainian, {getTrainRouteIdFromTrainRaceId} from "../InterpreterDictionaries/TrainRoutesDictionary.js";
import {changeCarriageTypeIntoUkrainian} from "../InterpreterDictionaries/CarriagesDictionaries.js";
import "./UserPotentialTicketCartDrawer.css";
const formatDM_HM = (value) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);

    const dm = new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long' }).format(d);
    const hm = new Intl.DateTimeFormat('uk-UA', { hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
    return `${dm}, ${hm}`; // "14 лютого, 18:36"
};
function UserPotentialTicketCartDrawer({cartState, removePotentialTicketFromCart})
{
    const tickets = cartState.potentialTicketsList;
    return (
        <Drawer
            open={cartState.potentialTicketsList.length > 0}
            placement="bottom"
            mask={false}
            height="200px"
            maskClosable={false}
            closable={true}
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
                                <div className="cart-ticket-info">
                                    <div className="cart-ticket-header">
                                        <b>Поїзд:</b>  {changeTrainRouteIdIntoUkrainian(getTrainRouteIdFromTrainRaceId(potential_ticket.train_race_id))}(клас {potential_ticket.train_route_quality_class})&nbsp;
                                        <b>Вагон:</b> {potential_ticket.carriage_position_in_squad}({changeCarriageTypeIntoUkrainian(potential_ticket.carriage_type)}, {potential_ticket.carriage_quality_class})&nbsp;
                                        <b>Місце:</b> {potential_ticket.place_in_carriage}
                                    </div>
                                    <div className="cart-ticket-route">
                                        <Text className="station-title">{stationTitleIntoUkrainian(potential_ticket.trip_starting_station)}</Text><Text className="station-time">({formatDM_HM(potential_ticket.trip_starting_station_departure_time)})</Text> - <Text className="station-title">{stationTitleIntoUkrainian(potential_ticket.trip_ending_station)}</Text><Text className="station-time">({formatDM_HM(potential_ticket.trip_ending_station_arrival_time)}</Text>)
                                    </div>
                                    {/*<Text type="primary">Ціна: {potential_ticket.price ?? 0} ₴</Text>*/}
                                </div>
                                <Button danger size="small" onClick={() => removePotentialTicketFromCart(potential_ticket)}>
                                    Видалити
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Права частина */}
                    <div className="cart-sidebar">
                        <div className="cart-total">
                            <Text strong>До сплати:</Text>
                            <Text strong className="cart-total-price">{cartState.totalSum} ₴</Text>
                        </div>
                        <Divider style={{ margin: "12px 0" }} />
                        <Button type="primary" block size="large" onClick={()=> {}}>
                            Оформити
                        </Button>
                        <Text type="secondary" className="cart-limit">
                            Обмеження: максимум 4 квитки в кошику.
                        </Text>
                    </div>
                </div>
            )}
        </Drawer>
    );
}
export default UserPotentialTicketCartDrawer;