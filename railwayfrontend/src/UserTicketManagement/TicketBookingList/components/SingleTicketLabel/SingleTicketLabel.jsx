import React from "react";
import { Tag, Tooltip } from "antd";

// Яскраві кольори для кожного типу вагона
const qualityClassColor = (t) => {
    switch (t) {
        case "A": return "red";      // насичений фіолетовий
        case "B": return "green";   // яскравий синій
        case "C": return "blue"; // індиго
        default: return "#595959";        // темно-сірий
    }
};

export default function SingleTicketLabel({ t }) {
    const passengerFullName = [t.passenger_name, t.passenger_surname]
        .filter(Boolean)
        .join(" ");

    const seatLabel = `Вагон ${t.carriage_position_in_squad}(К) • Місце ${t.place_in_carriage} `;
    console.log(t.carriage_quality_class);
    return (
        <Tooltip
            title={(
                <>
                    <div>Тип: {t.carriage_type}</div>
                    {passengerFullName && <div>Пасажир: {passengerFullName}</div>}
                    <div>Статус: {t.ticket_status}</div>
                </>
            )}
        >
            <Tag
                style={{
                    marginBottom: 8,
                    padding: "6px 12px",
                    display: "inline-flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: "18px",
                    whiteSpace: "normal",
                    color: "white", // білий текст
                    fontWeight: 500,
                    textAlign: "center",
                    border: "none",
                    minWidth: 130,
                    backgroundColor: qualityClassColor(t.carriage_quality_class), // насичений фон
                    borderRadius: 8,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                }}
            >
                <span style={{ fontSize: 14, fontWeight: 600 }}>
                    {seatLabel}
                </span>
                {passengerFullName && (
                    <span
                        style={{
                            fontSize: 12,
                            opacity: 0.9,
                            marginTop: 2,
                            color: "white",
                        }}
                    >
                        {passengerFullName}
                    </span>
                )}
            </Tag>
        </Tooltip>
    );
}
