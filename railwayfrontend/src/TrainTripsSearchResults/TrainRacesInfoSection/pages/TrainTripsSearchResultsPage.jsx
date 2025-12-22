import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { message, Spin } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import TrainTripCard from '../components/TrainTripCard/TrainTripCard.jsx';
import CompactTripSearchForm from "../components/CompactTripsSearchForm/CompactTripsSearchForm.jsx";
import DateSlider from "../components/DateSlider/DateSlider.jsx";
import './TrainTripsSearchResultsPage.css';
import {
    FETCH_TRAIN_TRIPS_WITH_DETAILED_BOOKINGS_INFO_URL, FETCH_TRAIN_TRIPS_WITHOUT_DETAILED_BOOKINGS_INFO_URL
} from "../../../../SystemUtils/ServerConnectionConfiguration/Urls/TrainSearchUrls.js";
import {
    EAGER_BOOKINGS_SEARCH_MODE
} from "../../../../SystemUtils/ServerConnectionConfiguration/ProgramFunctioningConfiguration/ProgramFunctioningConfiguration.js";

const antIcon = <SyncOutlined spin style={{ fontSize: 40 }} />;

function TrainTripsSearchResultsPage() {
    const [messageApi, contextHolder] = message.useMessage();
    const { start, end } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const departureDate = searchParams.get("departure-date");
    const [initialDate] = useState(departureDate);

    const [trainTripsList, setTrainTripsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTrainsWithoutFreePlaces, setShowTrainsWithoutFreePlaces] = useState(false);

    useEffect(() => {
        const fetchTrainTripsData = async () => {
            setLoading(true);
            try {
                let response = null;
                if(EAGER_BOOKINGS_SEARCH_MODE) {
                    response = await fetch(FETCH_TRAIN_TRIPS_WITH_DETAILED_BOOKINGS_INFO_URL(start, end, departureDate));
                }
                else
                {
                    response = await fetch(FETCH_TRAIN_TRIPS_WITHOUT_DETAILED_BOOKINGS_INFO_URL(start, end, departureDate));
                }
                if (!response.ok) throw new Error('Fetch failed');
                const data = await response.json();
                setTrainTripsList(data);
            } catch (error) {
                console.error(error);
                messageApi.error("Не вдалося завантажити дані про курсування поїздів");
            } finally {
                setLoading(false);
            }
        };
        fetchTrainTripsData();
    }, [start, end, departureDate, messageApi]);

    const handleDateSliderChange = (new_date) => {
        navigate(`/search-trips/${start}/${end}?departure-date=${new_date}`);
    };

    const displayedTrains = useMemo(() => {
        if (!trainTripsList) return [];

        return trainTripsList.filter(train => {
            if (showTrainsWithoutFreePlaces) return true;
            const stats = train.grouped_carriage_statistics_list || {};
            const totalFreePlaces = Object.values(stats).reduce((acc, cat) => acc + (cat.free_places || 0), 0);
            return totalFreePlaces > 0;
        });
    }, [trainTripsList, showTrainsWithoutFreePlaces]);

    return (
        <div className="train-trips-page">
            {contextHolder}

            <section className="search-form-wrapper">
                <CompactTripSearchForm
                    compact
                    initialStartStation={start}
                    initialEndStation={end}
                    initialTripDate={departureDate}
                    onShowTrainsWithoutFreePlacesChange={setShowTrainsWithoutFreePlaces}
                />
            </section>

            <section className="date-slider">
                <DateSlider
                    start={dayjs(initialDate)}
                    value={departureDate}
                    onChange={handleDateSliderChange}
                />
            </section>

            <main className="train-cards-container">
                <h2 className="train-cards-container-header">Знайдені поїзди</h2>

                {loading ? (
                    <div className="loader-center">
                        <Spin indicator={antIcon} />
                    </div>
                ) : displayedTrains.length > 0 ? (
                    displayedTrains.map(train => (
                        <TrainTripCard
                            key={train.train_race_id}
                            train={train}
                            showWithoutFreePlaces={showTrainsWithoutFreePlaces}
                        />
                    ))
                ) : (
                    <div className="no-results-message">
                        <h3 className="no-available-trains-info">Не вдалося знайти доступні місця</h3>
                        <p className="no-available-trains-details">
                            <strong>Можливі причини</strong>: поїзди не курсують, продаж ще не відкрито або всі місця розкуплені.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default TrainTripsSearchResultsPage;