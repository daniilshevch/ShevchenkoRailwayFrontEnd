import React, { useEffect, useMemo, useState } from "react";
import { Alert, Divider, Spin } from "antd";
import TrainTripTicketsCard from "../components/TrainTripTicketsCard/TrainTripTicketsCard.jsx";
import {SERVER_URL} from "../../../../SystemUtils/ConnectionConfiguration/ConnectionConfiguration.js";


function toDateKey(iso) {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

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

    useEffect(() => {
        const token = localStorage.getItem("token");
        let alive = true;
        (async () => {
            setLoading(true);
            setErr(null);
            try {
                const res = await fetch(`${SERVER_URL}/get-grouped-tickets-for-current-user`, { method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }});
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                if (alive) setData(Array.isArray(json) ? json : []);
            } catch (e) {
                if (alive) setErr(e);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, []);

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


        for (const arr of map.values()) {
            arr.sort(
                (a, b) => new Date(a.departure_time) - new Date(b.departure_time)
            );
        }


        return Array.from(map.entries()).sort(
            (a, b) => new Date(a[0]) - new Date(b[0])
        );
    }, [data]);

    if (loading) {
        return (
            <div style={{ padding: 24, display: "grid", placeItems: "center" }}>
                <Spin tip="Завантажую ваші квитки..." />
            </div>
        );
    }
    if (err) {
        return (
            <div style={{ padding: 24 }}>
                <Alert
                    type="error"
                    showIcon
                    message="Не вдалося завантажити поїздки"
                    description={String(err?.message || err)}/>
            </div>
        );
    }
    if (groupedByDate.length === 0) {
        return (
            <div style={{ padding: 24 }}>
                <Alert type="info" showIcon message="Немає поїздів із квитками" />
            </div>
        );
    }

    return (
        <div style={{ paddingTop: 70, maxWidth: 1200, margin: "0 auto" }}>
            {groupedByDate.map(([dateKey, trips], idx) => (
                <section key={dateKey} style={{ marginBottom: 28 }}>
                    {idx > 0 && <Divider />}
                    <h2 style={{ margin: "8px 0 16px", fontWeight: 700 }}>
                        {formatDateUkr(dateKey)}
                    </h2>

                    <div style={{ display: "grid", gap: 16 }}>
                        {trips.map(trip => (
                            <TrainTripTicketsCard key={`${trip.train_route_on_date_id}_${trip.trip_starting_station_title}_${trip.trip_ending_station_title}_${trip.departure_time}`} train={trip} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
