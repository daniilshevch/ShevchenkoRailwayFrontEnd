import React from 'react';
import CarriageInfoPanel from './CarriageInfoPanel/CarriageInfoPanel.jsx';
import CarriageSeatLayout from './CarriageSeatLayout/CarriageSeatLayout.jsx';
import './CarriageCard.css';
function CarriageCard({ carriageData, onSeatClick, startStation, endStation, isSeatSelectedInPotentialTicketCart }) {
    const {
        carriage_position_in_squad,
        carriage_type,
        carriage_quality_class,
        ticket_price,
        wifi_availability,
        air_conditioning,
        food_availability,
        shower_availability,
        is_inclusive,
        free_places,
        total_places,
        places_availability_list
    } = carriageData;

    const features = {
        wifi_availability,
        air_conditioning,
        food_availability,
        shower_availability,
        is_inclusive,
    };
    return (
        <div className="carriage-card">
            <div className="carriage-info-side">
                <CarriageInfoPanel
                    carriageNumber={carriage_position_in_squad}
                    type={carriage_type}
                    qualityClass={carriage_quality_class}
                    freePlaces={free_places}
                    totalPlaces={total_places}
                    features={features}
                    price={ticket_price}
                 />
            </div>
            <div className="carriage-seats-side">
                <CarriageSeatLayout
                    seats={places_availability_list}
                    carriageType={carriage_type}
                    carriageQualityClass={carriage_quality_class}
                    carriageNumber={carriage_position_in_squad}
                    onSeatClick={onSeatClick}
                    price={ticket_price}
                    startStation={startStation}
                    endStation={endStation}
                    isSeatSelectedInPotentialTicketCart={isSeatSelectedInPotentialTicketCart}
                 />
            </div>
        </div>
    );
}
export default CarriageCard;
