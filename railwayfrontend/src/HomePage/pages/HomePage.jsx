import React from 'react';
import './HomePage.css';
import BackgroundImageCarousel from "../components/BackgroundImageCarousel/BackgroundImageCarousel.jsx";
import TripsSearchForm from "../components/TripsSearchForm/TripsSearchForm.jsx";
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