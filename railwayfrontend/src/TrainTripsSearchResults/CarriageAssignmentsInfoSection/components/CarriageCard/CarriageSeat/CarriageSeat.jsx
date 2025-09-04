import React from 'react';
import './CarriageSeat.css';

function CarriageSeat({ seatNumber, isFree, carriageType, carriageQualityClass, carriageNumber, onClick, price })
{
    const baseClass = isFree ? 'seat-free' : 'seat-taken';
    const classByType = carriageType ? `seat-type-${carriageType}` : '';
    const classByQuality = carriageQualityClass ? `seat-${carriageQualityClass}` : '';

    return (
        <button
            className={`seat ${baseClass} ${classByQuality} ${classByType}`}
            disabled={!isFree}
            onClick={isFree ? () => onClick(carriageNumber, seatNumber, price) : undefined}
        >
            {seatNumber}
        </button>
    );
}
export default CarriageSeat;