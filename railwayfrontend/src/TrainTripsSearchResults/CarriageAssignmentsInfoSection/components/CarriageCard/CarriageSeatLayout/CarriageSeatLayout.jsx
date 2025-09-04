import React from 'react';
import CarriageSeatGroup from '../CarriageSeatGroup/CarriageSeatGroup.jsx';
import "./CarriageSeatLayout.css";
import {MdWc} from 'react-icons/md';
function getWcComponentClassName(side, carriageType, seatsAmount)
{
    if(seatsAmount === 18 || seatsAmount === 20 || seatsAmount === 36 || seatsAmount === 40)
    {
        return `${side}-wc-block-${carriageType}-${seatsAmount}`;
    }
    else
    {
        return `${side}-wc-block`;
    }
}
function getCarriageSeatLayoutClassName(carriageType, seatsAmount)
{
    if(seatsAmount === 18 || seatsAmount === 20 || seatsAmount === 36 || seatsAmount === 40)
    {
        return `carriage-seat-layout-${carriageType}-${seatsAmount}`;
    }
    else
    {
        return `carriage-seat-layout`;
    }
}
function CarriageSeatLayout({ seats, carriageType, carriageQualityClass, carriageNumber, onSeatClick, price, startStation, endStation, isSeatSelectedInPotentialTicketCart })
{
    const groupedSeats = [];

    if (carriageType.toLowerCase() === "platskart")
    {
        for(let i = 0; i < 9; i++)
        {
            const seatBlock = [];
            seatBlock.push(...seats.slice(4 * i, 4 * i + 4));
            seatBlock.push(seats[53 - i * 2]);
            seatBlock.push(seats[53 - i * 2 - 1]);
            groupedSeats.push(seatBlock);
        }
    }
    else if (carriageType.toLowerCase() === "coupe")
    {
        for (let i = 0; i < seats.length; i += 4)
        {
            groupedSeats.push(seats.slice(i, i + 4));
        }
    }
    else if (carriageType.toLowerCase() === "sv") {
        for (let i = 0; i < seats.length; i += 2) {
            groupedSeats.push(seats.slice(i, i + 2));
        }
    }
    return (
        <div className={getCarriageSeatLayoutClassName(carriageType.toLowerCase(), seats.length)}>
            <div className = {getWcComponentClassName("left", carriageType.toLowerCase(),  seats.length)}>
                <MdWc className = "wc-icon"></MdWc>
            </div>
            {groupedSeats.map((groupOfSeats, index) => (
                <CarriageSeatGroup
                    key={index}
                    carriageType={carriageType}
                    seatsInGroup={groupOfSeats}
                    carriageQualityClass={carriageQualityClass}
                    carriageNumber={carriageNumber}
                    onSeatClick={onSeatClick}
                    price={price}
                    startStation={startStation}
                    endStation={endStation}
                    isSeatSelectedInPotentialTicketCart={isSeatSelectedInPotentialTicketCart}
                />
            ))}
            <div className = {getWcComponentClassName("right", carriageType.toLowerCase(), seats.length)}>
                <MdWc className = "wc-icon"></MdWc>
            </div>
        </div>
    );
}
export default CarriageSeatLayout;