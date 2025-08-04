import React, { useState, useEffect, useRef } from 'react';
import './StationInputAssistant.css';
import {stationsList} from "../../InterpreterDictionaries/StationsDictionary.js";

function StationInput({ label, initialValue, onChange })
{
    const [query, setQuery] = useState(stationsList.find(station => station.english == initialValue)?.ukrainian || "");
    const [suggestions, setSuggestions] = useState([]);
    const [choiceMade, setChoiceMade] = useState(false);
    const [changingStarted, setChangingStarted] = useState(false);
    const wrapperRef = useRef(null);
    useEffect(() => {
        setQuery(stationsList.find(station => station.english == initialValue)?.ukrainian || "");
    }, [initialValue]);
    useEffect(() => {
        if (query.trim() === "")
        {
            setSuggestions([]);
            return;
        }
        const appropriateStations = stationsList.filter(station => station.ukrainian.toLowerCase().includes(query.toLowerCase().trim()));
        if (choiceMade == false && changingStarted == true) {
            setSuggestions(appropriateStations);
        }
    }, [query, choiceMade]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target))
            {
                setSuggestions([]);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside)
    });
    const handleSelect = (station) =>
    {
        setQuery(station.ukrainian);
        onChange(station.english);
        setSuggestions([]);
        setChoiceMade(true);
    }
    return (
        <div className="autocomplete-wrapper" ref={wrapperRef}>
            <label>{label}</label>
            <input
                type="text"
                value = {query}
                onChange={event => {
                    setQuery(event.target.value);
                    onChange(stationsList.find(station => station.ukrainian == event.target.value)?.english);
                    setChoiceMade(false);
                    setChangingStarted(true);
                }}
            />
            {suggestions.length > 0 && (
                <ul className="suggestions">
                    {suggestions.map((station, index) => (
                    <li key={index} onClick={() => handleSelect(station)}>
                    {station.ukrainian}
                    </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
export default StationInput;