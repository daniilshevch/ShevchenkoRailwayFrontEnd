import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { message, Spin } from "antd";
import { SyncOutlined, SearchOutlined, InfoCircleOutlined, EyeOutlined } from "@ant-design/icons";
import TrainTripCard from '../components/TrainTripCard/TrainTripCard.jsx';
import CompactTripSearchForm from "../components/CompactTripsSearchForm/CompactTripsSearchForm.jsx";
import DateSlider from "../components/DateSlider/DateSlider.jsx";
import {trainSearchService} from "../services/TrainTripsSearchService.js";
import './TrainTripsSearchResultsPage.css';
import {
    stationTitleIntoUkrainian
} from "../../../../SystemUtils/InterpreterMethodsAndDictionaries/StationsDictionary.js";
const antIcon = <SyncOutlined spin style={{ fontSize: 40 }} />;

//January
function TrainTripsSearchResultsPage() {
    const [messageApi, contextHolder] = message.useMessage();

    const { start, end } = useParams();
    const [searchParams] = useSearchParams();

    const departureDate = searchParams.get("departure-date");
    const [initialDate] = useState(departureDate);

    const [trainTripsList, setTrainTripsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTrainsWithoutFreePlaces, setShowTrainsWithoutFreePlaces] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrainTripsData = async () => {
            setLoading(true);
            try {
                const data = await trainSearchService.FETCH_TRIPS(start, end, departureDate);
                setTrainTripsList(data);
            } catch {
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
        return trainSearchService.FILTER_TRIPS(trainTripsList, showTrainsWithoutFreePlaces);
    }, [trainTripsList, showTrainsWithoutFreePlaces]);

    const renderNoResultsMessage = () => {
        if (trainTripsList.length === 0) {
            return (
                <div className="no-results-minimal">
                    <SearchOutlined className="minimal-icon" />
                    <h3 className="minimal-title">Поїздів не знайдено</h3>
                    <p className="minimal-text">
                        За напрямком <strong>{stationTitleIntoUkrainian(start)} — {stationTitleIntoUkrainian(end)}</strong> на даний момент
                        не призначено поїздів на дату {dayjs(departureDate).format('YYYY-MM-DD')}. Слідкуйте за оголошеннями про відкриття квитків
                        або скористайтесь альтернативними маршрутами
                    </p>
                </div>
            );
        }

        if (displayedTrains.length === 0 && !showTrainsWithoutFreePlaces) {
            return (
                <div className="no-results-minimal">
                    <InfoCircleOutlined className="minimal-icon warning" />
                    <h3 className="minimal-title">Всі квитки розпродані</h3>
                    <p className="minimal-text">За напрямком <strong>{stationTitleIntoUkrainian(start)} — {stationTitleIntoUkrainian(end)}</strong> в призначених поїздах
                        на даний момент немає вільних місць на дату {dayjs(departureDate).format('YYYY-MM-DD')} , оскільки всі наявні квитки були розкуплені.
                        Для перегляду призначених рейсів скористайтесь фільтром "Без вільних місць"
                    </p>
                    <div className="minimal-actions">
                        <button className="text-action-btn primary" onClick={() => setShowTrainsWithoutFreePlaces(true)}>
                            <EyeOutlined /> Рейси без вільних місць
                        </button>
                    </div>
                </div>
            );
        }
        return null;
    }

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
                    showTrainsWithoutFreePlaces={showTrainsWithoutFreePlaces}
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
                ) : renderNoResultsMessage()}
            </main>
        </div>
    );
}

export default TrainTripsSearchResultsPage;