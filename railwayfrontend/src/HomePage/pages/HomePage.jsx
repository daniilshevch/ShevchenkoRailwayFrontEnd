import React, {useEffect} from 'react';
import {useLocation} from "react-router-dom";
import './HomePage.css';
import BackgroundImageCarousel from "../components/BackgroundImageCarousel/BackgroundImageCarousel.jsx";
import TripsSearchForm from "../components/TripsSearchForm/TripsSearchForm.jsx";
import StationBoard from "../../TrainScheduleThroughStation/StationBoard/StationBoard.jsx";
import ServicesSection from "../components/ExtraInformation/ServicesSection.jsx";
import Footer from "../components/Footer/Footer.jsx";
function HomePage()
{
    const { hash } = useLocation();
    useEffect(() => {
        if (hash === '#schedule-board') {
            const element = document.getElementById('schedule-board');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        if (hash === '#ticket-search') {
            const element = document.getElementById('ticket-search');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }

    }, [hash]);
    return (
        <div className="home-container">
            <div  id="ticket-search" className="hero-section" style={{ position: 'relative', height: '700px' }}>
                <BackgroundImageCarousel />
                <div className="overlay">
                    <TripsSearchForm />
                </div>
            </div>

            <div id="schedule-board" className="board-section" style={{ padding: '40px 100px' }}>
                <StationBoard />
            </div>
            <ServicesSection />
            <Footer></Footer>
        </div>
    )
}
export default HomePage;