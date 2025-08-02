import React from 'react';
import CarriageInfoPanel from './CarriageInfoPanel';
import CarriageSeatLayout from './CarriageSeatLayout';
import './CarriageCard.css';
function CarriageCard({ carriageData, onSeatClick }) {
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
                    type={carriage_type}
                    qualityClass={carriage_quality_class}
                    onSeatClick={onSeatClick}
                 />
            </div>
        </div>
    );
}
export default CarriageCard;
