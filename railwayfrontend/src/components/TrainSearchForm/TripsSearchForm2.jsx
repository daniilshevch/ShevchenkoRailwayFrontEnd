import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./TripsSearchForm.css";
import StationInput from "./StationInputAssistant.jsx"
function TripsSearchForm2({compact = false, initialStart = "", initialEnd = "", initialDate = ""})
{
    const [startStation, setStartStation] = useState(initialStart);
    const [endStation, setEndStation] = useState(initialEnd);
    const [departureDate, setDepartureDate] = useState(initialDate);
    const navigate = useNavigate();
    const handleSearch = (event) => {
        event.preventDefault();
        if (!startStation || !endStation || !departureDate)
        {
            alert("Invalid data");
        }
        const trainListPageUrl = `/search-trips/${encodeURIComponent(startStation)}/${encodeURIComponent(endStation)}?departure-date=${departureDate}`;
        navigate(trainListPageUrl);
        console.log(startStation);
        console.log(endStation);
        console.log(departureDate);
    };
    return (
        <form onSubmit={handleSearch} className={`trips-search-form ${compact ? "compact-form" : ""}`}>
            <div className="station-inputs">
                <StationInput
                    label="ЗВІДКИ" 
                    value={startStation}
                    onChange={setStartStation}
                    initialValue = {initialStart}
                />
                <StationInput
                    label="КУДИ"
                    value={endStation}
                    onChange={setEndStation}
                    initialValue = {initialEnd}
                />
                <div className="date-input">
                    <label htmlFor="ДАТА">Дата</label>
                    <input 
                    type="date"
                    id="departureDate"
                    value={departureDate}
                    onChange={event => setDepartureDate(event.target.value)}
                    />
                </div>
            </div>
            <button type = "submit" className = "trips-search-button">ПОШУК КВИТКІВ</button>
        </form>
    )
}
export default TripsSearchForm2;