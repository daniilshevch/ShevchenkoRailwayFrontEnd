import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import TrainTripCard from '../components/TrainRaceInfo/TrainTripCard';
import './TrainTripsSearchResults.css'
import TripsSearchForm from '../components/TrainSearchForm/TripsSearchForm';
function TrainTripsSearchResults()
{
    const { start, end } = useParams();
    const [searchParams] = useSearchParams();
    const departureDate = searchParams.get("departure-date");

    const [trainTripsList, setTrainTripsList] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchTrainTripsData = async () => {
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
    return (
        <div className="train-trips-page">
            <TripsSearchForm compact="true" initialStart={start} initialEnd={end} initialDate={departureDate} />
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