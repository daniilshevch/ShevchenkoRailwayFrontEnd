import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import HomePage from './pages/HomePage';
import GeneralLayout from './layouts/GeneralLayout';
import TrainTripsSearchResults from './pages/TrainTripsSearchResults';
import CarriageListPage from './pages/CarriageListPage';
import AdminTrainRoutesList from './AdminPanel/components/AdminTrainRoutesList/AdminTrainRoutesList.jsx';
import AdminTrainRacesList from './AdminPanel/components/AdminTrainRacesList/AdminTrainRacesList.jsx';
import AdminTrainRaceInfoPage from "./AdminPanel/pages/AdminTrainRaceInfoPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DateSlider from "./TrainTripsSearchResults/DateSlider.jsx";


      

createRoot(document.getElementById('root')).render(
    //<StrictMode>
        <BrowserRouter>
        <Routes>
            <Route path = "/test">
                <Route path = "date-slider" element={<DateSlider />}></Route>
            </Route>
            <Route path = "/login" element = {<LoginPage />} />
            <Route path = "/register" element = {<RegisterPage />} />
            <Route path="/admin/train-routes-list" element={<AdminTrainRoutesList />} />
            <Route path="/admin/:train_route_id/train-races-list" element={<AdminTrainRacesList />} />
            <Route path="/admin/:train_race_id/info" element = {<AdminTrainRaceInfoPage />} />
                <Route element = {<GeneralLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/:train-race-id/carriages" element={<CarriageListPage />} />
                    <Route path="/search-trips/:start/:end" element={<TrainTripsSearchResults />} />
                </Route>
            </Routes>
        </BrowserRouter>
    //</StrictMode>
);
