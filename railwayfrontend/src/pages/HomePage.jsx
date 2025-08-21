import React from 'react';
import './HomePage.css';
import TripsSearchForm2 from "../components/TrainSearchForm/TripsSearchForm2.jsx";
import BackgroundCarousel from '../components/BackgroundCarousel';
import BackgroundImageCarousel from "../components/HomePageComponents/BackgroundImageCarousel.jsx";
import TripsSearchForm from "../components/TrainSearchForm/TripsSearchForm.jsx";
function HomePage()
{
    return (
        <div className="home-container">
            <BackgroundImageCarousel />
            <TripsSearchForm />
        </div>
    )
}
export default HomePage;