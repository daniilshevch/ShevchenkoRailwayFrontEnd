import React from 'react';
import CarriageSeatGroup from './CarriageSeatGroup';
import "./CarriageSeatLayout.css";
function CarriageSeatLayout({ seats, type, qualityClass, onSeatClick })
{
    const groupedSeats = [];

    if (type.toLowerCase() === "platskart")
    {
        const seatBlock = [];
        for (let i = 0; i < 36; i += 4) {
            seatBlock.push(...seats.slice(i, i + 4));
        }
        for (let i = 53; i > 36; i -= 2)
        {
            seatBlock.push(...seats.slice(i, i + 2));
        }
    }
    else if (type.toLowerCase() === "coupe")
    {
        for (let i = 0; i < seats.length; i += 4)
        {
            groupedSeats.push(seats.slice(i, i + 4));
        }
    }
    else if (type.toLowerCase() === "sv") {
        for (let i = 0; i < seats.length; i += 2) {
            groupedSeats.push(seats.slice(i, i + 2));
        }
    }
    return (
        <div className="carriage-seat-layout">
            {groupedSeats.map((group, index) => (
                <CarriageSeatGroup
                    key={index}
                    type={type}
                    seats={group}
                    qualityClass={qualityClass}
                    onSeatClick={onSeatClick}
                />

            ))}
        </div>
    );
}
export default CarriageSeatLayout;