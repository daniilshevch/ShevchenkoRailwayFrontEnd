import React from "react";
import { Tag, Tooltip } from "antd";
import { UserOutlined } from "@ant-design/icons";
import {
    changeCarriageTypeIntoUkrainian
} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/CarriagesDictionaries.js";

const getQualityStyles = (qualityClass, status = null) => {
    if(status === "Returned")
    {
        return { color: "#8c8c8c", bg: "#f5f5f5", border: "#d9d9d9" };
    }
    switch (qualityClass) {
        case "A": return { color: "#cf1322", bg: "#fff1f0", border: "#ffa39e" };
        case "B": return { color: "#389e0d", bg: "#f6ffed", border: "#b7eb8f" };
        case "C": return { color: "#096dd9", bg: "#e6f7ff", border: "#91d5ff" };
        default:  return { color: "#595959", bg: "#fafafa", border: "#d9d9d9" };
    }
};

export default function SingleTicketLabel({ t, onClick }) {
    const styles = getQualityStyles(t.carriage_quality_class, t.ticket_status);

    const passengerFullName = [t.passenger_name, t.passenger_surname]
        .filter(Boolean)
        .join(" ");

    return (
        <Tooltip
            title={(
                <>
                    <div><strong>Тип:</strong> {t.carriage_type}</div>
                    {passengerFullName && <div><strong>Пасажир:</strong> {passengerFullName}</div>}
                    <div><strong>Статус:</strong> {t.ticket_status}</div>
                </>
            )}
        >
            <Tag
                onClick={onClick}
                style={{
                    display: "inline-flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "6px 10px",
                    margin: "0 8px 8px 0",
                    backgroundColor: styles.bg,
                    border: `1px solid ${styles.border}`,
                    borderRadius: "6px",
                    cursor: "default",
                    minWidth: "200px"
                }}
            >
                <div style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: styles.color,
                    marginBottom: "4px",
                    borderBottom: `1px solid ${styles.border}88`,
                    paddingBottom: "4px"
                }}>
                    Вагон {t.carriage_position_in_squad}
                    <span style={{ opacity: 0.6, margin: "0 4px", fontWeight: 400 }}>|</span>
                    Місце {t.place_in_carriage}
                </div>

                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%"
                }}>
                    <span style={{
                        fontSize: "10px",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        color: styles.color,
                        opacity: 0.7,
                        letterSpacing: "0.5px",
                        marginRight: "10px"
                    }}>
                        {changeCarriageTypeIntoUkrainian(t.carriage_type)}
                    </span>

                    {passengerFullName && (
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "12px",
                            color: styles.color,
                            opacity: 0.9,
                            maxWidth: "130px"
                        }}>
                            <UserOutlined style={{ marginRight: "2px", fontSize: "15px" }} />
                            <span style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                fontWeight: 700
                            }}>
                                {passengerFullName}
                            </span>
                        </div>
                    )}
                </div>
            </Tag>
        </Tooltip>
    );
}