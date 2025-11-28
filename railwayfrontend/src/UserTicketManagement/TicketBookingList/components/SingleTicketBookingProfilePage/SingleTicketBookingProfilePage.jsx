import React from "react";
import { Typography, Divider, Row, Col, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { changeCarriageTypeIntoUkrainian } from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/CarriagesDictionaries.js";
import { stationTitleIntoUkrainian } from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/StationsDictionary.js";
import changeTrainRouteIdIntoUkrainian
    from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TrainRoutesDictionary.js";

const { Title, Text } = Typography;

export default function SingleTicketBookingProfilePage({ t }) {
    if (!t) return null;

    // Форматування дати
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString("uk-UA", {
            day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
        });
    };

    const passengerName = [t.passenger_name, t.passenger_surname].filter(Boolean).join(" ");

    // Колір бордера
    const getBorderColor = (quality) => {
        switch (quality) {
            case "A": return "#cf1322";
            case "B": return "#389e0d";
            case "C": return "#096dd9";
            default: return "#d9d9d9";
        }
    };

    return (
        <div style={{
            border: `2px solid ${getBorderColor(t.carriage_quality_class)}`,
            borderRadius: "12px",
            padding: "20px",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#fff" // Додамо білий фон про всяк випадок
        }}>
            {/* Декоративна смужка зліва */}
            <div style={{
                position: "absolute",
                top: 0, left: 0, bottom: 0,
                width: "8px",
                backgroundColor: getBorderColor(t.carriage_quality_class)
            }} />

            <Row gutter={[24, 24]} align="middle">
                {/* ЛІВА ЧАСТИНА: QR */}
                <Col xs={24} md={10} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                        padding: "10px",
                        background: "white",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}>
                        <img
                            src={t.qr_code}
                            alt="QR Code"
                            style={{ width: "100%", maxWidth: "220px", height: "auto", display: "block" }}
                        />
                    </div>
                    <Text type="secondary" style={{ marginTop: "10px", fontSize: "12px" }}>
                        ID: {t.full_ticket_id.split('-')[0]}...
                    </Text>
                    <Tag color={t.ticket_status === "Booked_And_Active" ? "green" : "red"} style={{ marginTop: 8 }}>
                        {t.ticket_status === "Booked_And_Active" ? "АКТИВНИЙ" : t.ticket_status}
                    </Tag>
                </Col>

                {/* ПРАВА ЧАСТИНА: ДЕТАЛІ */}
                <Col xs={24} md={14}>
                    <Title level={3} style={{ margin: 0, color: "#1f1f1f" }}>
                        Поїзд {changeTrainRouteIdIntoUkrainian(t.train_route_id)}
                    </Title>
                    <Text type="secondary" style={{fontSize: "16x", fontWeight: 500}}>
                        {stationTitleIntoUkrainian(t.full_route_starting_station_title)} — {stationTitleIntoUkrainian(t.full_route_ending_station_title)}
                    </Text>

                    <Divider style={{ margin: "12px 0" }} />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                        <div>
                            <Text type="secondary" style={{fontSize: "16x", fontWeight: 500}}>Відправлення</Text>
                            <div style={{ fontWeight: 600, fontSize: "16px" }}>
                                {formatDate(t.departure_time)}
                            </div>
                            <div style={{ fontSize: "16px", fontWeight: "bold" }}>{stationTitleIntoUkrainian(t.trip_starting_station_title)}</div>
                        </div>
                        <div>
                            <Text type="secondary" style={{fontSize: "16x", fontWeight: 500}}>Прибуття</Text>
                            <div style={{ fontWeight: 600, fontSize: "16px" }}>
                                {formatDate(t.arrival_time)}
                            </div>
                            <div style={{ fontSize: "16px", fontWeight: "bold" }}>{stationTitleIntoUkrainian(t.trip_ending_station_title)}</div>
                        </div>
                    </div>

                    <Divider style={{ margin: "12px 0" }} />

                    <Row gutter={[12, 12]}>
                        <Col span={12}>
                            <div style={{ background: "#f5f5f5", padding: "8px", borderRadius: "6px" }}>
                                <Text type="secondary" style={{ fontSize: "11px" }}>ВАГОН</Text>
                                <div style={{ fontSize: "20px", fontWeight: "bold", color: "#1890ff" }}>
                                    {t.carriage_position_in_squad}
                                </div>
                                <div style={{ fontSize: "11px" }}>{changeCarriageTypeIntoUkrainian(t.carriage_type)}</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div style={{ background: "#f5f5f5", padding: "8px", borderRadius: "6px" }}>
                                <Text type="secondary" style={{ fontSize: "11px" }}>МІСЦЕ</Text>
                                <div style={{ fontSize: "20px", fontWeight: "bold", color: "#1890ff" }}>
                                    {t.place_in_carriage}
                                </div>
                                <div style={{ fontSize: "11px" }}>Клас {t.carriage_quality_class}</div>
                            </div>
                        </Col>
                    </Row>

                    <div style={{ marginTop: "15px" }}>
                        <Text type="secondary" style={{ fontSize: "12px" }}><UserOutlined /> Пасажир</Text>
                        <div style={{ fontSize: "16px", fontWeight: "bold" }}>{passengerName}</div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}