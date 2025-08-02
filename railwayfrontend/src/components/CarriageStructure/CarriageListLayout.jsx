import React from 'react';
import CarriageCard from './CarriageCard';
import './CarriageListLayout.css';

function CarriageListLayout({ carriages, onSeatClick })
{
    return (
        <div className="carriage-list">
            {carriages.map((carriage) => (
                <CarriageCard
                    key={carriage.carriage_position_in_squad}
                    carriageData={carriage}
                    onSeatClick={onSeatClick}
                />
            ))}
        </div>
    )
}
export default CarriageListLayout;