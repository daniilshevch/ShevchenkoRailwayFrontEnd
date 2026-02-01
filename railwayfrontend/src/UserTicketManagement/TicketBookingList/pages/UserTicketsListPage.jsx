import React, {useEffect, useMemo, useState, useCallback, useReducer} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Alert, Divider, Spin, Tabs, Empty, Button, Typography, message} from "antd";
import {
    ShoppingCartOutlined,
    HistoryOutlined,
    EnvironmentOutlined,
    LockOutlined
} from "@ant-design/icons";
import TrainTripTicketsCard from "../components/TrainTripTicketsCard/TrainTripTicketsCard.jsx";
import ticketsBg from '../../../../public/background_images/tickets.jpg';
import {
    initialPotentialTicketCartState,
    potentialTicketCartReducer
} from "../../../../SystemUtils/UserTicketCart/UserPotentialTicketCartSystem.js";
import {
    CANCEL_TICKET_BOOKING_RESERVATION_BEFORE_PURCHASE
} from "../../../../SystemUtils/ServerConnectionConfiguration/Urls/TrainSearchUrls.js";
import UserPotentialTicketCartPanel
    from "../../../../SystemUtils/UserTicketCart/UserPonentialTicketCartPanel/UserPotentialTicketCartPanel.jsx";
import {
    ticketBookingProcessingService
} from "../../../../SystemUtils/UserTicketCart/TicketManagementService/TicketBookingProcessingService.js";
import {userTicketManagementService} from "../services/UserTicketManagementService.js";

const { Text, Paragraph } = Typography;
function toDateKey(iso) {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

const emptyConfig = {
    "in-progress": {
        description: (
            <div style={{ marginTop: 12 }}>
                <Paragraph strong style={{ fontSize: '18px', marginBottom: 4 }}>
                    Ваш кошик порожній
                </Paragraph>
                <Text type="secondary" style={{ fontSize: '15px', fontWeight: '500' }}>
                    Ви ще не обрали жодного квитка для бронювання.
                    Виберіть рейс, щоб розпочати подорож.
                </Text>
            </div>
        ),
        icon: <ShoppingCartOutlined style={{ fontSize: 60, color: '#1890ff' }} />,
        actionText: "Знайти поїзд"
    },
    "active": {
        description: (
            <div style={{ marginTop: 12 }}>
                <Paragraph strong style={{ fontSize: '18px', marginBottom: 4 }}>
                    У Вас нема запланованих поїздок
                </Paragraph>
                <Text type="secondary" style={{ fontSize: '15px', fontWeight: '500' }}>
                    Наразі Ви не купляли квитки для майбутніх поїздок. Всі Ваші завершені подорожі знаходяться в архіві.
                </Text>
            </div>
        ),
        icon: <EnvironmentOutlined style={{ fontSize: 60, color: '#52c41a' }} />,
        actionText: "Планувати подорож"
    },
    "archived": {
        description: (
            <div style={{ marginTop: 12 }}>
                <Paragraph strong style={{ fontSize: '18px', marginBottom: 4 }}>
                    Ваш архів квитків порожній
                </Paragraph>
                <Text type="secondary" style={{ fontSize: '15px', fontWeight: '500' }}>
                    Наразі у Вас немає завершених подорожей. Після завершення поїздок архівні квитки з'являться тут
                </Text>
            </div>
        ),
        icon: <HistoryOutlined style={{ fontSize: 60, color: '#8c8c8c' }} />,
        actionText: "На головну"
    },
    "unauthorized": {
        description: (
            <div style={{ marginTop: 12 }}>
                <Paragraph strong style={{ fontSize: '18px', marginBottom: 4 }}>
                    Ви не авторизовані
                </Paragraph>
                <Text type="secondary" style={{ fontSize: '15px', fontWeight: '500' }}>
                    Будь ласка, увійдіть у свій акаунт, щоб переглянути квитки.
                </Text>
            </div>
        ),
        icon: <LockOutlined style={{ fontSize: 60, color: '#ff4d4f' }} />,
        actionText: "Увійти",
        path: "/login"
    }
};
function formatDateUkr(isoOrKey) {
    const d = new Date(isoOrKey);
    if (Number.isNaN(d.valueOf()) && /^\d{4}-\d{2}-\d{2}$/.test(isoOrKey)) {
        return new Date(isoOrKey + "T00:00:00Z").toLocaleDateString("uk-UA", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }
    return d.toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export default function UserTicketsListPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const {status} = useParams();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const activeTab = status || "active";

    const [potentialTicketCartState, potentialTicketCartDispatch] = useReducer(potentialTicketCartReducer, initialPotentialTicketCartState);

    useEffect(() => {
        ticketBookingProcessingService.GET_POTENTIAL_TICKET_CART_FROM_STORAGE(potentialTicketCartDispatch);
    }, []);
    useEffect(() => {
        ticketBookingProcessingService.SAVE_POTENTIAL_TICKET_CART_TO_STORAGE(potentialTicketCartState);
    }, [potentialTicketCartState.potentialTicketsList]);

    const renderEmptyState = (tab) => {
        const config = emptyConfig[tab];
        return (
            <div style={{ padding: '60px 0' }}>
                <Empty
                    image={config.icon}
                    imageStyle={{ height: 80 }}
                    description={config.description}
                >
                    <Button
                        type="primary"
                        shape="round"
                        size="large"
                        onClick={() => navigate(config.path || '/')}
                    >
                        {config.actionText}
                    </Button>
                </Empty>
            </div>
        );
    };
    const fetchData = useCallback(async (isSilent = false) => {
        if (activeTab === "in-progress") {
            setLoading(false);
            setErr(null);
            return;
        }
        if (!isSilent) setLoading(true);
        setErr(null);
        try {
            const tickets = await userTicketManagementService.GET_GROUPED_USER_TICKETS_FROM_SERVER(activeTab);
            setData(tickets);
        } catch (e) {
            setErr(e);
        } finally {
            if (!isSilent) setLoading(false);
        }
    }, [activeTab]);


    useEffect(() => {
        fetchData();
    }, [fetchData, activeTab]);

    const handleTabChange = (key) => {
        navigate(`/user-ticket-bookings/${key}`);
    };

    const groupedByDate = useMemo(() => {
        const tripsWithTickets = (data || []).filter(
            t => Array.isArray(t.ticket_bookings_list) && t.ticket_bookings_list.length > 0
        );
        const map = new Map();
        for (const trip of tripsWithTickets) {
            const key = toDateKey(trip.departure_time);
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(trip);
        }
        const sortedEntries = Array.from(map.entries());
        return sortedEntries.sort((a, b) => {
            const dateA = new Date(a[0]);
            const dateB = new Date(b[0]);
            return activeTab === "active" ? dateA - dateB : dateB - dateA;
        });
    }, [data, activeTab]);

    const removePotentialTicketFromCart = async (ticket) => {
        await ticketBookingProcessingService
            .REMOVE_POTENTIAL_TICKET_FROM_CART_WITH_SERVER_TEMPORARY_RESERVATION_CANCELLATION(ticket, potentialTicketCartDispatch, messageApi);
    }

    const backgroundStyle = {
        backgroundImage: `url(${ticketsBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        width: '100%',
        paddingTop: 60,
        paddingBottom: 40
    };

    const contentContainerStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    };

    const renderTicketsContent = () => {
        if (loading) {
            return (
                <div style={{ display: "grid", placeItems: "center", minHeight: "300px" }}>
                    <Spin tip="Завантаження..." size="large"/>
                </div>
            );
        }
        if(activeTab === "in-progress")
        {
            if (potentialTicketCartState.potentialTicketsList.length === 0) {
                return renderEmptyState("in-progress");
            }
            return <UserPotentialTicketCartPanel
                cartState={potentialTicketCartState}
                removePotentialTicketFromCart={removePotentialTicketFromCart}
                dispatch = {potentialTicketCartDispatch}
            ></UserPotentialTicketCartPanel>
        }

        if (err) {
            if (err.message.includes("401") ||
                err.message?.toLowerCase().includes("unauthorized")) {
                return renderEmptyState("unauthorized");
            }
            return <Alert type="error" showIcon message="Помилка завантаження" description={err.message} />;
        }

        if (groupedByDate.length === 0) {
            return renderEmptyState(activeTab);
        }

        return groupedByDate.map(([dateKey, trips], idx) => (
            <section key={dateKey} style={{ marginBottom: 28 }}>
                {idx > 0 && <Divider style={{ borderColor: '#ddd' }} />}
                <h2 style={{ margin: "8px 0 16px", fontWeight: 700, color: '#222' }}>
                    {formatDateUkr(dateKey)}
                </h2>
                <div style={{ display: "grid", gap: 16 }}>
                    {trips.map(trip => (
                        <TrainTripTicketsCard
                            key={trip.train_route_on_date_id}
                            train={trip}
                            onRefresh={() => fetchData(true)}
                        />
                    ))}
                </div>
            </section>
        ));
    };

    return (
        <>
            {contextHolder}
            <div style={backgroundStyle}>
                <div style={{ maxWidth: 1300, margin: "0 auto", paddingLeft: 16, paddingRight: 16,  }}>
                    <div style={contentContainerStyle}>

                        <Tabs
                            activeKey={activeTab}
                            onChange={handleTabChange}
                            centered
                            size="large"
                            items={[
                                {
                                    label: 'В процесі бронювання',
                                    key: 'in-progress',
                                },
                                {
                                    label: 'Активні квитки',
                                    key: 'active',
                                },
                                {
                                    label: 'Архів поїздок',
                                    key: 'archived',
                                },
                            ]}
                            style={{ marginBottom: 20 }}
                        />

                        {renderTicketsContent()}
                    </div>
                </div>
            </div>
        </>
    );
}


// useEffect(() => {
//     try
//     {
//         const potentialTicketsCart = localStorage.getItem("potentialTicketsCart");
//         if (potentialTicketsCart)
//         {
//             potentialTicketCartDispatch({type: "ALLOCATE_FROM_LOCAL_STORAGE", payload: JSON.parse(potentialTicketsCart)});
//         }
//     }
//     catch(error)
//     {
//         console.error(error);
//     }
// }, []);

// useEffect(() => {
//     try
//     {
//         localStorage.setItem("potentialTicketsCart", JSON.stringify({
//             potentialTicketsList: potentialTicketCartState.potentialTicketsList}));
//         window.dispatchEvent(new Event('cartUpdated'));
//     }
//     catch(error)
//     {
//         console.error(error);
//     }
// }, [potentialTicketCartState.potentialTicketsList]);

// const fetchData = useCallback(async (isSilent = false) => {
//     const token = localStorage.getItem("token");
//     if (!isSilent) setLoading(true);
//     setErr(null);
//     if (activeTab === "in-progress") {
//         setLoading(false);
//         setErr(null);
//         return;
//     }
//
//     const endpoint = activeTab === "active"
//         ? "get-grouped-active-tickets-for-current-user"
//         : "get-grouped-archieved-tickets-for-current-user";
//
//     try {
//         const res = await fetch(`${SERVER_URL}/${endpoint}`, {
//             method: "GET",
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             }
//         });
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const json = await res.json();
//         setData(Array.isArray(json) ? json : []);
//     } catch (e) {
//         setErr(e);
//     } finally {
//         if (!isSilent) setLoading(false);
//     }
// }, [activeTab]);
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
//     const response = await fetch(CANCEL_TICKET_BOOKING_RESERVATION_BEFORE_PURCHASE, {
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
