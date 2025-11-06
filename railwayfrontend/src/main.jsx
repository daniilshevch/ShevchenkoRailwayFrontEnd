import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import HomePage from './HomePage/pages/HomePage.jsx';
import GeneralLayout from './GeneralWebsiteElements/GeneralLayout/GeneralLayout.jsx';
import TrainTripsSearchResultsPage from './TrainTripsSearchResults/TrainRacesInfoSection/pages/TrainTripsSearchResultsPage.jsx';
import CarriageListPage from './TrainTripsSearchResults/CarriageAssignmentsInfoSection/pages/CarriageListPage/CarriageListPage.jsx';
import AdminTrainRoutesList from './AdminPanel/AdminTrainRoutesManagement/components/AdminTrainRoutesList.jsx';
import AdminTrainRacesList from './AdminPanel/AdminTrainRacesManagement/components/AdminTrainRacesList.jsx';
import AdminTrainRaceInfoPage from "./AdminPanel/AdminTrainRacesManagement/pages/AdminTrainRaceInfoPage.jsx";
import LoginPage from "./RegistrationAndLogin/pages/LoginPage/LoginPage.jsx";
import RegisterPage from "./RegistrationAndLogin/pages/RegisterPage/RegisterPage.jsx";
import DateSlider from "./TrainTripsSearchResults/TrainRacesInfoSection/components/DateSlider/DateSlider.jsx";
import CarriageTypeAndQualityFilter
    from "./TrainTripsSearchResults/CarriageAssignmentsInfoSection/components/CarriageTypeAndQualityFilter/CarriageTypeAndQualityFilter.jsx";
import {grouped_carriage_statistics_list} from "../DevelopmentHelpingTools/TestData.js";
import TicketBookingArrangementPage
    from "./UserTicketManagement/TicketBookingConfirmation/pages/TicketBookingArrangementPage/TicketBookingArrangementPage.jsx";
import SingleTicketBookingConfirmationInfoComponent
    from "./UserTicketManagement/TicketBookingConfirmation/components/SingleTicketBookingArrangementInfo/SingleTicketBookingConfirmationInfoComponent.jsx";
import {ticket} from "../DevelopmentHelpingTools/TestData.js";
import TicketBookingResultPage
    from "./UserTicketManagement/TicketBookingConfirmation/pages/TicketBookingResultPage/TicketBookingCompletionResultPage.jsx";
import TicketBookingCompletionResultPage
    from "./UserTicketManagement/TicketBookingConfirmation/pages/TicketBookingResultPage/TicketBookingCompletionResultPage.jsx";
import UserTicketsListPage from "./UserTicketManagement/TicketBookingList/pages/UserTicketsListPage.jsx";
      

createRoot(document.getElementById('root')).render(
    //<StrictMode>
        <BrowserRouter>
        <Routes>
            <Route path = "/test">
                <Route path = "date-slider" element={<DateSlider />}></Route>
                <Route path = "filter" element = {<CarriageTypeAndQualityFilter groupedSeats={grouped_carriage_statistics_list} />}></Route>
                <Route path = "ticket" element = {<SingleTicketBookingConfirmationInfoComponent ticket={ticket} /> }></Route>
            </Route>
            <Route path = "/login" element = {<LoginPage />} />
            <Route path = "/register" element = {<RegisterPage />} />
            <Route path="/admin/train-routes-list" element={<AdminTrainRoutesList />} />
            <Route path="/admin/:train_route_id/train-races-list" element={<AdminTrainRacesList />} />
            <Route path="/admin/:train_race_id/info" element = {<AdminTrainRaceInfoPage />} />
                <Route element = {<GeneralLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/:train_race_id/:start/:end/carriages" element={<CarriageListPage />} />
                    <Route path="/search-trips/:start/:end" element={<TrainTripsSearchResultsPage />} />
                    <Route path="/ticket-booking" element = {<TicketBookingArrangementPage />} />
                    <Route path="/ticket-booking-completion" element={<TicketBookingCompletionResultPage />} />
                    <Route path="/user-ticket-bookings" element = {<UserTicketsListPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    //</StrictMode>
);
