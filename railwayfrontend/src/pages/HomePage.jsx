import React from 'react';
import './HomePage.css';
import TripsSearchForm from "../components/TrainSearchForm/TripsSearchForm.jsx";
import BackgroundCarousel from '../components/BackgroundCarousel';
function HomePage()
{
    return (
        <div className="home-container">
            <BackgroundCarousel />
            <div className="overlay">
                <TripsSearchForm />
            </div>
        </div>
    )
}
export default HomePage;