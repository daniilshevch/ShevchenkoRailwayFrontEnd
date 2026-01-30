import React, {useState, useEffect, useMemo} from "react";
import { Typography, Divider, Row, Col, Tag, Dropdown, Button, Space, Modal, message } from "antd";
import { changeCarriageTypeIntoUkrainian } from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/CarriagesDictionaries.js";
import { stationTitleIntoUkrainian } from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/StationsDictionary.js";
import changeTrainRouteIdIntoUkrainian
    from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TrainRoutesDictionary.js";
import {
    UserOutlined,
    DownloadOutlined,
    RollbackOutlined,
    DownOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
    changeTicketBookingServerStatusIntoUkrainian
} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TicketBookingStatusDictionary.js";
import {userTicketManagementService} from "../../services/UserTicketManagementService.js";

const { Title, Text } = Typography;

export default function SingleTicketBookingProfilePage({ ticket, onRefresh, onReturnClose }) {
    const [isReturning, setIsReturning] = useState(false);
    const [modal, contextHolder] = Modal.useModal();
    const [messageApi, messageContextHolder] = message.useMessage();
    const [ticketStatus, setTicketStatus] = useState(ticket.ticket_status);
    if (!ticket) return null;
    useEffect(() => {
        setTicketStatus(ticket.ticket_status);
    }, [ticket]);


    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString("uk-UA", {
            day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
        });
    }
    const colorForTicketStatus = (status) => {
        switch (status) {
            case "Booking_In_Progress":
                return "cyan";
            case "Booked_And_Active":
                return "green";
            case "Booked_And_Used":
                return "orange";
            case "Archieved":
                return "purple";
            case "Returned":
                return "default";
            default:
                return "black";
        }
    }

    const handleDownloadPDF = async () => {
        try {
            await userTicketManagementService.DOWNLOAD_TICKET_PDF(ticket);
            messageApi.success("Квиток завантажено успішно");
        } catch (error) {
            console.error("Download error:", error);
            messageApi.error(error.message);
        }
    }

    const handleReturnTicket = async () => {
        try {
            await userTicketManagementService.RETURN_TICKET_AFTER_PURCHASE(ticket);
            setTicketStatus("Returned");
            messageApi.info("Квиток успішно повернуто");
            onRefresh();
            onReturnClose();
        } catch (error) {
            console.error("Return error:", error);
            messageApi.error(error.message);
        } finally {
            setIsReturning(false);
        }
    }
    const showReturnConfirm = () => {
        modal.confirm({
            title: 'Ви дійсно хочете повернути цей квиток?',
            icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
            content: 'Цю дію неможливо скасувати. Кошти будуть повернуті згідно з правилами Shevchenko Railway',
            okText: 'Так, повернути',
            okType: 'danger',
            cancelText: 'Ні, залишити',
            onOk() {
                return handleReturnTicket();
            },
            onCancel() {
                console.log('Скасовано повернення');
            },
        });
    };
    const menuItems = useMemo(() => {
        const items = [];
        if (ticketStatus !== "Returned") {
            items.push({
                key: 'download',
                label: 'Завантажити PDF',
                icon: <DownloadOutlined />,
                onClick: handleDownloadPDF,
            });
        }
        switch (ticketStatus) {
            case "Booked_And_Active":
                items.push({ type: 'divider' });
                items.push({
                    key: 'return',
                    label: 'Повернути квиток',
                    icon: <RollbackOutlined />,
                    danger: true,
                    onClick: showReturnConfirm,
                });
                break;

            case "Booked_And_Used":
                items.push({ type: 'divider' });
                items.push({
                    key: 'info',
                    label: 'Переглянути деталі поїздки',
                    icon: <ExclamationCircleOutlined />,
                    onClick: () => console.log("Поїздка вже завершена"),
                });
                break;

            case "Archieved":
                items.push({ type: 'divider' });
                items.push({
                    key: 'info',
                    label: 'Оцінити поїздку',
                    icon: <ExclamationCircleOutlined />,
                    onClick: () => console.log("Оцінка поїздки"),
                });
                break;

            case "Returned":
                items.push({
                    key: 'status',
                    label: 'Квиток повернуто',
                    disabled: true,
                });
                break;

            default:
                break;
        }

        return items;
    }, [ticketStatus]);
    const passengerName = [ticket.passenger_name, ticket.passenger_surname].filter(Boolean).join(" ");

    const getBorderColor = (quality, status = null) => {
        if(status === "Returned")
        {
            return "grey";
        }
        switch (quality) {
            case "S": return "purple";
            case "A": return "#cf1322";
            case "B": return "#389e0d";
            case "C": return "#096dd9";
            default: return "#d9d9d9";
        }
    };

    return (
        <>
            {contextHolder}
            {messageContextHolder}
            <div style={{
                border: `2px solid ${getBorderColor(ticket.carriage_quality_class, ticket.ticket_status)}`,
                borderRadius: "12px",
                padding: "20px",
                position: "relative",
                overflow: "hidden",
                backgroundColor: "#fff"
            }}>
                <div style={{
                    position: "absolute",
                    top: 0, left: 0, bottom: 0,
                    width: "8px",
                    backgroundColor: getBorderColor(ticket.carriage_quality_class, ticket.ticket_status)
                }} />

                <Row gutter={[24, 24]} align="middle">
                    <Col xs={24} md={10} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{
                            padding: "10px",
                            background: "white",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                        }}>
                            <img
                                src={ticket.qr_code}
                                alt="QR Code"
                                style={{ width: "100%", maxWidth: "220px", height: "auto", display: "block" }}
                            />
                        </div>
                        <Tag color={colorForTicketStatus(ticketStatus)} style={{ marginTop: 20, fontWeight: "bold", fontSize: 13 }}>
                            {changeTicketBookingServerStatusIntoUkrainian(ticketStatus)}
                        </Tag>
                    </Col>

                    <Col xs={24} md={14}>
                        <Title level={3} style={{ margin: 0, color: "#1f1f1f" }}>
                            Поїзд {changeTrainRouteIdIntoUkrainian(ticket.train_route_id)}
                        </Title>
                        <Text type="secondary" style={{fontSize: "16x", fontWeight: 500}}>
                            {stationTitleIntoUkrainian(ticket.full_route_starting_station_title)} — {stationTitleIntoUkrainian(ticket.full_route_ending_station_title)}
                        </Text>

                        <Divider style={{ margin: "12px 0" }} />

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                            <div>
                                <Text type="secondary" style={{fontSize: "16x", fontWeight: 500}}>Відправлення</Text>
                                <div style={{ fontWeight: 600, fontSize: "16px" }}>
                                    {formatDate(ticket.departure_time)}
                                </div>
                                <div style={{ fontSize: "16px", fontWeight: "bold" }}>{stationTitleIntoUkrainian(ticket.trip_starting_station_title)}</div>
                            </div>
                            <div>
                                <Text type="secondary" style={{fontSize: "16x", fontWeight: 500}}>Прибуття</Text>
                                <div style={{ fontWeight: 600, fontSize: "16px" }}>
                                    {formatDate(ticket.arrival_time)}
                                </div>
                                <div style={{ fontSize: "16px", fontWeight: "bold" }}>{stationTitleIntoUkrainian(ticket.trip_ending_station_title)}</div>
                            </div>
                        </div>

                        <Divider style={{ margin: "12px 0" }} />

                        <Row gutter={[12, 12]}>
                            <Col span={12}>
                                <div style={{ background: "#f5f5f5", padding: "8px", borderRadius: "6px" }}>
                                    <Text type="secondary" style={{ fontSize: "13px", fontWeight: 500 }}>ВАГОН</Text>
                                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#1890ff", lineHeight: "1.2" }}>
                                        {ticket.carriage_position_in_squad}
                                    </div>
                                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#434343" }}>
                                        {changeCarriageTypeIntoUkrainian(ticket.carriage_type)}
                                        <span style={{
                                            color: getBorderColor(ticket.carriage_quality_class),
                                            marginLeft: "6px",
                                            fontWeight: "700"
                                        }}>
                    • Клас {ticket.carriage_quality_class}
                </span>
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ background: "#f5f5f5", padding: "8px", borderRadius: "6px" }}>
                                    <Text type="secondary" style={{ fontSize: "13px", fontWeight    : 500 }}>МІСЦЕ</Text>
                                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#1890ff", lineHeight: "1.2" }}>
                                        {ticket.place_in_carriage}
                                    </div>
                                    <div style={{ fontSize: "13px", fontWeight: 700 }}>{ticket.place_in_carriage % 2 === 0 ? "Верхнє" : "Нижнє"}</div>
                                </div>
                            </Col>
                        </Row>


                        <div style={{
                            marginTop: "20px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end"
                        }}>
                            <div>
                                <Text type="secondary" style={{ fontSize: "14px", fontWeight: 700 }}><UserOutlined /> Пасажир</Text>
                                <div style={{ fontSize: "16px", fontWeight: "bold" }}>{passengerName}</div>
                            </div>

                            <Dropdown menu={{ items: menuItems }} trigger={['hover']}>
                                <Button
                                    size="middle"
                                    style={{
                                        borderRadius: "10px",
                                        padding: "0 24px",
                                        height: "40px",
                                        border: `1px solid ${getBorderColor(ticket.carriage_quality_class, ticket.ticket_status)}`,
                                        background: "white",
                                        color: getBorderColor(ticket.carriage_quality_class, ticket.ticket_status),
                                        fontWeight: "600",
                                        boxShadow: "0 2px 5px rgba(24, 144, 255, 0.15)",
                                        transition: "all 0.3s ease"
                                    }}
                                    className="custom-action-btn"
                                >
                                    <Space size={8}>
                                        <span>Дії з квитком</span>
                                        <DownOutlined style={{ fontSize: "10px", marginLeft: 4 }} />
                                    </Space>
                                </Button>
                            </Dropdown>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
}



// const handleDownloadPDF = async () => {
//     const token = localStorage.getItem("token");
//     try
//     {
//         const response = await fetch(`${SERVER_URL}/download-ticket-pdf`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`
//             },
//         body: JSON.stringify(ticket)
//         });
//         if (!response.ok) {
//             let errorDetails;
//             try {
//                 errorDetails = await response.json();
//             } catch (e) {
//                 // Якщо це не JSON (наприклад, просто текст "Something went wrong"), читаємо як текст
//                 errorDetails = null;
//             }
//
//             // 2. Спробуємо прочитати як текст, якщо JSON не розпарсився
//             if (!errorDetails) {
//                 const errorText = await response.text();
//                 throw new Error(errorText || `Помилка сервера: ${response.status}`);
//             }
//             const errorMessage = errorDetails.message
//                 || errorDetails.title
//                 || JSON.stringify(errorDetails)
//                 || "Не вдалося завантажити файл";
//
//             throw new Error(errorMessage);
//         }
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//
//         // 3. Створюємо невидимий елемент <a>
//         const link = document.createElement('a');
//         link.href = url;
//         // 4. Встановлюємо ім'я файлу (таке ж, як на бекенді)
//         link.setAttribute('download', `ticket_${ticket.full_ticket_id}.pdf`);
//
//         // 5. Додаємо в DOM, клікаємо і видаляємо
//         document.body.appendChild(link);
//         link.click();
//         link.parentNode.removeChild(link);
//
//         // 6. Очищаємо пам'ять
//         window.URL.revokeObjectURL(url);
//
//     }
//     catch (error) {
//         console.error("Download error:", error);
//     }
//
// };

// const handleReturnTicket =  async () => {
//     setIsReturning(true);
//     const token = localStorage.getItem("token");
//     try {
//         const response = await fetch(`${SERVER_URL}/return-ticket-for-current-user/${ticket.full_ticket_id}`, {
//             method: "DELETE",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`
//             },
//             body: JSON.stringify(ticket)
//         });
//         setTicketStatus("Returned");
//         if (!response.ok) {
//             let errorDetails;
//             try {
//                 errorDetails = await response.json();
//             } catch (e) {
//                 errorDetails = null;
//             }
//
//             const errorMessage = errorDetails.message
//                 || errorDetails.title
//                 || JSON.stringify(errorDetails)
//                 || "Не вдалося завантажити файл";
//
//             throw new Error(errorMessage);
//         }
//     }
//     catch (error) {
//         console.error("Return error:", error);
//     }
//     finally {
//         setIsReturning(false);
//     }
//     onRefresh();
//     onReturnClose();
// };