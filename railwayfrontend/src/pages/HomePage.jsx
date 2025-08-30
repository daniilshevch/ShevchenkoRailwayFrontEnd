import React from 'react';
import './HomePage.css';
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