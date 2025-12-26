import React from 'react';
import './CarriageSeat.css';

function CarriageSeat({ seatNumber, isFree, carriageType, carriageQualityClass, carriageNumber, onClick, price, startStation, endStation, isSeatSelectedInPotentialTicketCart, getTicketFromCart})
{
    const isSelectedInPotentialCart = isSeatSelectedInPotentialTicketCart(carriageNumber, seatNumber, startStation, endStation);
    let baseClass = "";
    if(isFree && !isSelectedInPotentialCart)
    {
        baseClass = "seat-free";
    }
    else if(isFree && isSelectedInPotentialCart)
    {
        baseClass = "seat-selected-in-potential-cart";
    }
    else if(!isFree && isSelectedInPotentialCart)
    {
        baseClass = "seat-selected-in-potential-cart-and-reserved";
    }
    else
    {
        baseClass = "seat-taken";
    }
    const classByType = carriageType ? `seat-type-${carriageType}` : '';
    const classByQuality = carriageQualityClass ? `seat-${carriageQualityClass}` : '';

    return (
        <button
            className={`seat ${baseClass} ${classByQuality} ${classByType}`}
            disabled={!isFree}
            onClick={isFree ? () => onClick(carriageNumber, seatNumber, price, startStation, endStation, carriageType, carriageQualityClass) : undefined}
        >
            {seatNumber}
        </button>
    );
}
export default CarriageSeat;