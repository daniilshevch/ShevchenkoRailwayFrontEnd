import React, {useState, useEffect} from "react";
import { Typography, Divider, Row, Col, Tag, Dropdown, Button, Space, Modal } from "antd";
import { changeCarriageTypeIntoUkrainian } from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/CarriagesDictionaries.js";
import { stationTitleIntoUkrainian } from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/StationsDictionary.js";
import changeTrainRouteIdIntoUkrainian
    from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TrainRoutesDictionary.js";
import {
    UserOutlined,
    EllipsisOutlined,
    DownloadOutlined,
    RollbackOutlined,
    DownOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import {SERVER_URL} from "../../../../../SystemUtils/ServerConnectionConfiguration/ConnectionConfiguration.js";
const { confirm } = Modal;

const { Title, Text } = Typography;

export default function SingleTicketBookingProfilePage({ t, onRefresh, onReturnClose }) {
    const [isReturning, setIsReturning] = useState(false);
    const [modal, contextHolder] = Modal.useModal();
    const [ticketStatus, setTicketStatus] = useState(t.ticket_status);
    if (!t) return null;
    useEffect(() => {
        setTicketStatus(t.ticket_status);
    }, [t]);


    // Форматування дати
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString("uk-UA", {
            day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
        });
    };
    const handleDownloadPDF = async () => {
        const token = localStorage.getItem("token");
        try
        {
            const response = await fetch(`${SERVER_URL}/download-ticket-pdf`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            body: JSON.stringify(t)
            });
            if (!response.ok) {
                let errorDetails;
                try {
                    errorDetails = await response.json();
                } catch (e) {
                    // Якщо це не JSON (наприклад, просто текст "Something went wrong"), читаємо як текст
                    errorDetails = null;
                }

                // 2. Спробуємо прочитати як текст, якщо JSON не розпарсився
                if (!errorDetails) {
                    const errorText = await response.text();
                    throw new Error(errorText || `Помилка сервера: ${response.status}`);
                }
                const errorMessage = errorDetails.message
                    || errorDetails.title
                    || JSON.stringify(errorDetails)
                    || "Не вдалося завантажити файл";

                throw new Error(errorMessage);
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // 3. Створюємо невидимий елемент <a>
            const link = document.createElement('a');
            link.href = url;
            // 4. Встановлюємо ім'я файлу (таке ж, як на бекенді)
            link.setAttribute('download', `ticket_${t.full_ticket_id}.pdf`);

            // 5. Додаємо в DOM, клікаємо і видаляємо
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            // 6. Очищаємо пам'ять
            window.URL.revokeObjectURL(url);

        }
        catch (error) {
            console.error("Download error:", error);
        }

    };

    const handleReturnTicket =  async () => {
        setIsReturning(true);
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${SERVER_URL}/return-ticket-for-current-user/${t.full_ticket_id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(t)
            });
            setTicketStatus("Returned");
            if (!response.ok) {
                let errorDetails;
                try {
                    errorDetails = await response.json();
                } catch (e) {
                    errorDetails = null;
                }

                const errorMessage = errorDetails.message
                    || errorDetails.title
                    || JSON.stringify(errorDetails)
                    || "Не вдалося завантажити файл";

                throw new Error(errorMessage);
            }
        }
        catch (error) {
            console.error("Return error:", error);
        }
        finally {
            setIsReturning(false);
        }
        onRefresh();
        onReturnClose();

    };
    const showReturnConfirm = () => {
        modal.confirm({
            title: 'Ви дійсно хочете повернути цей квиток?',
            icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
            content: 'Цю дію неможливо скасувати. Кошти будуть повернуті згідно з правилами перевізника.',
            okText: 'Так, повернути',
            okType: 'danger',
            cancelText: 'Ні, залишити',
            onOk() {
                return handleReturnTicket(); // Викликаємо логіку повернення
            },
            onCancel() {
                console.log('Скасовано повернення');
            },
        });
    };
    const menuItems = [
        {
            key: '1',
            label: 'Завантажити PDF',
            icon: <DownloadOutlined />,
            onClick: handleDownloadPDF,
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: 'Повернути квиток',
            icon: <RollbackOutlined />,
            danger: true,
            onClick: showReturnConfirm,
        },
    ];
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
        <>
            {contextHolder}
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
                        <Tag color={ticketStatus === "Booked_And_Active" ? "green" : "red"} style={{ marginTop: 8 }}>
                            {ticketStatus}
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


                        <div style={{
                            marginTop: "20px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end" // Вирівнювання по низу, щоб кнопка була на рівні імені
                        }}>
                            <div>
                                <Text type="secondary" style={{ fontSize: "12px" }}><UserOutlined /> Пасажир</Text>
                                <div style={{ fontSize: "16px", fontWeight: "bold" }}>{passengerName}</div>
                            </div>

                            {/* Меню дій */}
                            <Dropdown menu={{ items: menuItems }} trigger={['hover']}>
                                <Button
                                    size="middle"
                                    style={{
                                        // 2. Кастомні стилі для "дорогого" вигляду
                                        borderRadius: "10px",       // Сильне заокруглення
                                        padding: "0 24px",          // Ширша кнопка
                                        height: "40px",             // Трохи вища
                                        border: `1px solid ${getBorderColor(t.carriage_quality_class)}`,// Ніжний бордер
                                        background: "white",      // Світло-блакитний фон (дуже сучасно)
                                        color: getBorderColor(t.carriage_quality_class),           // Синій текст
                                        fontWeight: "600",
                                        boxShadow: "0 2px 5px rgba(24, 144, 255, 0.15)", // Легка кольорова тінь
                                        transition: "all 0.3s ease" // Плавна анімація
                                    }}
                                    // Додаємо ефект при наведенні через CSS-клас або просто розраховуємо на стандартну поведінку AntD + наші стилі
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