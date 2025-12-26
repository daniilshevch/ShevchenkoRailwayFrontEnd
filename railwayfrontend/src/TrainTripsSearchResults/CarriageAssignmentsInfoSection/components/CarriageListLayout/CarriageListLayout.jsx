import React from 'react';
import CarriageCard from '../CarriageCard/CarriageCard.jsx';
import './CarriageListLayout.css';

function CarriageListLayout({ carriages, onSeatClick, startStation, endStation, isSeatSelectedInPotentialTicketCart, getTicketFromCart })
{
    return (
        <div className="carriage-list">
            {carriages.map((carriage) => (
                <CarriageCard
                    key={carriage.carriage_position_in_squad}
                    carriageData={carriage}
                    onSeatClick={onSeatClick}
                    startStation={startStation}
                    endStation={endStation}
                    isSeatSelectedInPotentialTicketCart={isSeatSelectedInPotentialTicketCart}
                    getTicketFromCart = {getTicketFromCart}
                />
            ))}
        </div>
    )
}
export default CarriageListLayout;