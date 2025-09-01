import React from 'react';
import './CarriageSeat.css';
function CarriageSeat({ number, isFree, type, qualityClass, onClick })
{
    const baseClass = isFree ? 'seat-free' : 'seat-taken';
    const classByType = type ? `seat-type-${type}` : '';
    const classByQuality = qualityClass ? `seat-${qualityClass}` : '';

    return (
        <button
            className={`seat ${baseClass} ${classByQuality} ${classByType}`}
            disabled={!isFree}
            onClick={isFree ? () => onClick(number) : undefined}
        >
            {number}
        </button>
    );
}
export default CarriageSeat;