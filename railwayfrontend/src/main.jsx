import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import HomePage from './HomePage/pages/HomePage.jsx';
import GeneralLayout from './GeneralWebsiteElements/GeneralLayout/GeneralLayout.jsx';
import TrainTripsSearchResultsPage from './TrainTripsSearchResults/TrainRacesInfoSection/pages/TrainTripsSearchResultsPage.jsx';
import CarriageListPage from './TrainTripsSearchResults/CarriageAssignmentsInfoSection/pages/CarriageListPage/CarriageListPage.jsx';
import AdminTrainRoutesListPage from './AdminPanel/AdminTrainRoutesManagement/pages/AdminTrainRoutesListPage.jsx';
import AdminTrainRacesListPage from './AdminPanel/AdminTrainRacesManagement/pages/TrainRacesList/AdminTrainRacesListPage.jsx';
import AdminTrainRaceInfoPage from "./AdminPanel/AdminTrainRacesManagement/pages/TrainRaceInfo/AdminTrainRaceInfoPage.jsx";
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
import TicketBookingCompletionResultPage
    from "./UserTicketManagement/TicketBookingConfirmation/pages/TicketBookingResultPage/TicketBookingCompletionResultPage.jsx";
import UserTicketsListPage from "./UserTicketManagement/TicketBookingList/pages/UserTicketsListPage.jsx";
import {GoogleTest} from "../DevelopmentHelpingTools/GoogleTest.jsx";
import {GoogleAuthHandler} from "./RegistrationAndLogin/components/GoogleAuthHandler.jsx";
import UserSidePanel from "./UserProfile/UserSidePanel.jsx";
import UserDataForm from "./UserProfile/UserDataForm.jsx";
import UserProfilePage from "./UserProfile/pages/UserProfilePage.jsx";
import StationBoard from "./TrainScheduleThroughStation/StationBoard/StationBoard.jsx";
import {PrivateRoute} from "../SystemUtils/PrivateRoutes/PrivateRoute.jsx";
import AdminLoginPage from "./AdminPanel/AdminLoginPage/AdminLoginPage.jsx";
      

createRoot(document.getElementById('root')).render(
    //<StrictMode>
        <BrowserRouter>
            <GoogleAuthHandler></GoogleAuthHandler>
            <Routes>
                <Route path = "/test">
                    <Route path = "date-slider" element={<DateSlider />}></Route>
                    <Route path = "filter" element = {<CarriageTypeAndQualityFilter groupedSeats={grouped_carriage_statistics_list} />}></Route>
                    <Route path = "ticket" element = {<SingleTicketBookingConfirmationInfoComponent ticket={ticket} /> }></Route>
                    <Route path = "google" element = {<GoogleTest></GoogleTest>}></Route>
                    <Route path = "station-board" element = {<StationBoard></StationBoard>}></Route>
                </Route>
                <Route element = {<PrivateRoute allowedRoles={["Administrator"]} />}>
                    <Route path="/admin/train-routes-list" element={<AdminTrainRoutesListPage />} />
                    <Route path="/admin/:train_route_id/train-races-list" element={<AdminTrainRacesListPage />} />
                    <Route path="/admin/:train_race_id/info" element = {<AdminTrainRaceInfoPage />} />
                </Route>
                <Route path = "/login" element = {<LoginPage />} />
                <Route path = "/admin-login" element = {<AdminLoginPage />} />
                <Route path = "/register" element = {<RegisterPage />} />
                <Route path="/forbidden" element={<div>У вас немає доступу до цієї сторінки</div>} />
                    <Route element = {<GeneralLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/:train_race_id/:start/:end/carriages" element={<CarriageListPage />} />
                        <Route path="/search-trips/:start/:end" element={<TrainTripsSearchResultsPage />} />
                        <Route path="/ticket-booking" element = {<TicketBookingArrangementPage />} />
                        <Route path="/ticket-booking-completion" element={<TicketBookingCompletionResultPage />} />
                        <Route path="/user-ticket-bookings/:status" element = {<UserTicketsListPage />} />
                        <Route path="/profile" element={<UserProfilePage/>} />
                    </Route>
                </Routes>
        </BrowserRouter>
    //</StrictMode>
);
