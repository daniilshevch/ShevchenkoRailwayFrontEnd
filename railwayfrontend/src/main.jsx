import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import HomePage from './pages/HomePage';
import GeneralLayout from './layouts/GeneralLayout';
import TrainTripsSearchResults from './pages/TrainTripsSearchResults';
import CarriageCard from './components/CarriageStructure/CarriageCard';
import CarriageListLayout from './components/CarriageStructure/CarriageListLayout';
import carriage_statistics_list from './components/TestData';
import CarriageListPage from './pages/CarriageListPage';
import AdminTrainRoutesList from './AdminPanel/components/AdminTrainRoutesList';
import AdminTrainRacesList from './AdminPanel/components/AdminTrainRacesList';
import AdminCarriageAssignmentsList from './AdminPanel/components/AdminCarriageAssignmentsList';
import AdminTrainStopsList from "./AdminPanel/components/AdminTrainStopsList.jsx";

const testSeats = [
    { place_in_carriage: 1, is_free: true },
    { place_in_carriage: 2, is_free: false },
    { place_in_carriage: 3, is_free: true },
    { place_in_carriage: 4, is_free: true },
    { place_in_carriage: 53, is_free: true },
    { place_in_carriage: 54, is_free: false },

];
const carriage = {
    "carriage_position_in_squad": 4,
    "carriage_type": "Coupe",
    "carriage_quality_class": "C",
    "ticket_price": 403,
    "free_places": 30,
    "total_places": 36,
    "air_conditioning": false,
    "shower_availability": false,
    "food_availability": false,
    "wifi_availability": false,
    "is_inclusive": false,
    "places_availability_list": [
        {
            "place_in_carriage": 1,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 2,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 3,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 4,
            "is_free": false,
            "passenger_trip_info": [
                {
                    "user_id": 7,
                    "passenger_name": "Daniil",
                    "passenger_surname": "Shevchenko",
                    "trip_starting_station": "Odesa-Holovna",
                    "trip_ending_station": "Lviv"
                }
            ]
        },
        {
            "place_in_carriage": 5,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 6,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 7,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 8,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 9,
            "is_free": false,
            "passenger_trip_info": [
                {
                    "user_id": 7,
                    "passenger_name": "Maria",
                    "passenger_surname": "Brychko",
                    "trip_starting_station": "Zhmerynka",
                    "trip_ending_station": "Ternopil"
                }
            ]
        },
        {
            "place_in_carriage": 10,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 11,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 12,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 13,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 14,
            "is_free": false,
            "passenger_trip_info": [
                {
                    "user_id": 7,
                    "passenger_name": "Daniil",
                    "passenger_surname": "Shevchenko",
                    "trip_starting_station": "Zhmerynka",
                    "trip_ending_station": "Vorokhta"
                }
            ]
        },
        {
            "place_in_carriage": 15,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 16,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 17,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 18,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 19,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 20,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 21,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 22,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 23,
            "is_free": false,
            "passenger_trip_info": [
                {
                    "user_id": 7,
                    "passenger_name": "Andrii",
                    "passenger_surname": "Hrechyn",
                    "trip_starting_station": "Odesa-Holovna",
                    "trip_ending_station": "Lviv"
                }
            ]
        },
        {
            "place_in_carriage": 24,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 25,
            "is_free": false,
            "passenger_trip_info": [
                {
                    "user_id": 7,
                    "passenger_name": "Ivan",
                    "passenger_surname": "Petrov",
                    "trip_starting_station": "Odesa-Holovna",
                    "trip_ending_station": "Lviv"
                }
            ]
        },
        {
            "place_in_carriage": 26,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 27,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 28,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 29,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 30,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 31,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 32,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 33,
            "is_free": false,
            "passenger_trip_info": [
                {
                    "user_id": 7,
                    "passenger_name": "Nastia",
                    "passenger_surname": "Borsch",
                    "trip_starting_station": "Ternopil",
                    "trip_ending_station": "Lviv"
                },
                {
                    "user_id": 7,
                    "passenger_name": "Petro",
                    "passenger_surname": "Poroshenko",
                    "trip_starting_station": "Lviv",
                    "trip_ending_station": "Ivano-Frankivsk"
                }
            ]
        },
        {
            "place_in_carriage": 34,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 35,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 36,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 37,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 38,
            "is_free": true,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 39,
            "is_free": false,
            "passenger_trip_info": null
        },
        {
            "place_in_carriage": 40,
            "is_free": true,
            "passenger_trip_info": null
        }
    ]
};
const carriageData = {
    "carriage_position_in_squad": 4,
    "carriage_type": "Coupe",
    "carriage_quality_class": "B",
    "ticket_price": 403,
    "free_places": 29,
    "total_places": 36,
    "air_conditioning": true,
    "shower_availability": false,
    "food_availability": false,
    "wifi_availability": true,
    "is_inclusive": true,
    "places_availability_list": carriage.places_availability_list
};
      




createRoot(document.getElementById('root')).render(
    //<StrictMode>
        <BrowserRouter>
        <Routes>
            <Route path="/admin/train-routes-list" element={<AdminTrainRoutesList />} />
            <Route path="/admin/:train_route_id/train-races-list" element={<AdminTrainRacesList />} />
            <Route path = "/test/carriage-assignments" element = {<AdminCarriageAssignmentsList train_race_id = "38SH_2025_02_14" />} />
            <Route path = "/test/train-stops" element = {<AdminTrainStopsList train_race_id = "38SH_2025_02_14" />} />
            <Route path="/test-carriage-list" element={<CarriageListLayout carriages={carriage_statistics_list} />} />
            <Route path="/test-carriage-card" element={<CarriageCard carriageData={carriageData} />} />
                <Route element = {<GeneralLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/:train-race-id/carriages" element={<CarriageListPage />} />
                    <Route path="/search-trips/:start/:end" element={<TrainTripsSearchResults />} />
                </Route>
            </Routes>
        </BrowserRouter>
    //</StrictMode>
);
