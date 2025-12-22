import React from 'react';
import './HomePage.css';
import BackgroundImageCarousel from "../components/BackgroundImageCarousel/BackgroundImageCarousel.jsx";
import TripsSearchForm from "../components/TripsSearchForm/TripsSearchForm.jsx";
import StationBoard from "../../TrainScheduleThroughStation/StationBoard/StationBoard.jsx";
function HomePage()
{
    return (
        <div className="home-container">
            {/* Секція першого екрану */}
            <div className="hero-section" style={{ position: 'relative', height: '700px' }}>
                <BackgroundImageCarousel />
                <div className="overlay">
                    <TripsSearchForm />
                </div>
            </div>

            {/* Секція табло (з'явиться нижче) */}
            <div className="board-section" style={{ padding: '40px 100px' }}>
                <StationBoard />
            </div>
        </div>
    )
}
export default HomePage;