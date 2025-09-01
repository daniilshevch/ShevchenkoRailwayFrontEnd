import React, { useEffect, useState} from 'react';
import {useNavigate, useParams, useSearchParams} from 'react-router-dom';
import TrainTripCard from '../components/TrainTripCard/TrainTripCard.jsx';
import './TrainTripsSearchResultsPage.css'
import CompactTripSearchForm from "../components/CompactTripsSearchForm/CompactTripsSearchForm.jsx";
import DateSlider from "../components/DateSlider/DateSlider.jsx";
import dayjs from 'dayjs';
import {SERVER_URL} from "../../../../SystemUtils/ConnectionConfiguration/ConnectionConfiguration.js";
import {message} from "antd";

function TrainTripsSearchResultsPage()
{
    const [messageApi, contextHolder] = message.useMessage();
    const { start, end } = useParams();
    const [searchParams] = useSearchParams();
    const departureDate = searchParams.get("departure-date");
    const [initialDate] = useState(departureDate);
    const [trainTripsList, setTrainTripsList] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchTrainTripsData = async () => {
            setLoading(true);
            try
            {
                const response = await fetch(`${SERVER_URL}/Client-API/TrainSearch/Search-Train-Routes-Between-Stations-With-Bookings/${start}/${end}?departure_date=${departureDate}`);
                const data = await response.json();
                setTrainTripsList(data);
            }
            catch (error)
            {
                console.error(error);
            }
            finally
            {
                setLoading(false);
            }
        }
        fetchTrainTripsData();

    }, [start, end, departureDate]);
    const handleDateSliderChange = async (new_date) => {
        navigate(`/search-trips/${start}/${end}?departure-date=${new_date}`);
    };
    return (
        <>
            {contextHolder}
            <div className="train-trips-page">
                <div className = "search-form-wrapper">
                    <CompactTripSearchForm
                        compact="true"
                        initialStartStation={start}
                        initialEndStation={end}
                        initialTripDate={departureDate}
                    />
                </div>
                <div className = "date-slider">
                    <DateSlider
                        start={dayjs(initialDate)}
                        value={departureDate}
                        onChange={handleDateSliderChange}
                    />
                </div>
                <div className = "train-cards-container">
                    <h2 className="train-cards-container-header">Знайдені поїзди</h2>
                    {trainTripsList.length > 0 ? trainTripsList.map(train => (
                        <TrainTripCard key={train.train_race_id} train={train} />
                    )): (
                        <>
                            <h3 className="no-available-trains-info">Не вдалося знайти доступні місця між заданими станціями</h3>
                            <h4 className="no-available-trains-details"><strong>Можливі причини</strong>: поїзди між станціями не курсують, продаж квитків ще не відкрито або всі місця в наявних потягах розкуплені</h4>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
export default TrainTripsSearchResultsPage;
