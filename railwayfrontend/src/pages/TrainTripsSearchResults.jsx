import React, { useEffect, useState, useRef } from 'react';
import {useNavigate, useParams, useSearchParams} from 'react-router-dom';
import TrainTripCard from '../components/TrainRaceInfo/TrainTripCard';
import './TrainTripsSearchResults.css'
import TripsSearchForm from "../components/TrainSearchForm/TripsSearchForm.jsx";
import CompactTripSearchForm from "../components/TrainSearchForm/CompactTripsSearchForm.jsx";
import DateSlider from "../TrainTripsSearchResults/DateSlider.jsx";
import dayjs from 'dayjs';
function TrainTripsSearchResults()
{
    const { start, end } = useParams();
    const [searchParams] = useSearchParams();
    const departureDate = searchParams.get("departure-date");
    const [currentDate, setCurrentDate] = useState(departureDate);
    const [trainTripsList, setTrainTripsList] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchTrainTripsData = async () => {
            setLoading(true);
            try
            {
                const response = await fetch(`https://localhost:7230/Client-API/TrainSearch/Search-Train-Routes-Between-Stations-With-Bookings/${start}/${end}?departure_date=${departureDate}`);
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
    const handleDateSliderChange = async (value) => {
        const fetchTrainTripsDataForDate = async (date) => {
            setLoading(true);
            try
            {
                const response = await fetch(`https://localhost:7230/Client-API/TrainSearch/Search-Train-Routes-Between-Stations-With-Bookings/${start}/${end}?departure_date=${date}`);
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
        fetchTrainTripsDataForDate(value);
        setCurrentDate(value);
        const url = new URL(window.location.href);
        url.searchParams.set("departure-date", value);
        window.history.replaceState(null, '', url);
    };
    return (
        <div className="train-trips-page">
            <div className = "search-form-wrapper">
                <CompactTripSearchForm
                    compact="true"
                    initialStartStation={start}
                    initialEndStation={end}
                    initialTripDate={currentDate}
                />
            </div>
            <div className = "date-slider">
                <DateSlider
                    start={dayjs(departureDate)}
                    onChange={handleDateSliderChange}
                />
            </div>
            <div className = "train-cards-container">
                <h2>Знайдені поїзди</h2>
                {trainTripsList.map(train => (
                    <TrainTripCard key={train.train_race_id} train={train} />
                ))}
            </div>
        </div>
    );
}
export default TrainTripsSearchResults;
