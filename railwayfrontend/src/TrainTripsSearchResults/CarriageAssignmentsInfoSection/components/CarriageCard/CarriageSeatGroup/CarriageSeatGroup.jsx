import React from 'react';
import CarriageSeat from '../CarriageSeat/CarriageSeat.jsx';
import './CarriageSeatGroup.css';
function CarriageSeatGroup({ seatsInGroup, carriageType, carriageQualityClass, carriageNumber, onSeatClick, price, startStation, endStation, isSeatSelectedInPotentialTicketCart, getTicketFromCart  })
{
    const renderPlatskartSeats = () =>
    {
        const topRow = [seatsInGroup[1], seatsInGroup[3]];
        const bottomRow = [seatsInGroup[0], seatsInGroup[2]];
        const sideRow = [seatsInGroup[4], seatsInGroup[5]];
        return (
            <div className="platskart-container">
                <div className="platskart-row">
                    {topRow.map(seat => (
                        <CarriageSeat
                            key={seat.place_in_carriage}
                            seatNumber={seat.place_in_carriage}
                            isFree={seat.is_free}
                            carriageType={carriageType}
                            carriageQualityClass={carriageQualityClass}
                            carriageNumber={carriageNumber}
                            onClick={onSeatClick}
                            price={price}
                            startStation={startStation}
                            endStation={endStation}
                            isSeatSelectedInPotentialTicketCart={isSeatSelectedInPotentialTicketCart}
                            getTicketFromCart = {getTicketFromCart}
                        />
                    ))}
                </div>
                <div className="platskart-row">
                    {bottomRow.map(seat => (
                        <CarriageSeat
                            key={seat.place_in_carriage}
                            seatNumber={seat.place_in_carriage}
                            isFree={seat.is_free}
                            carriageType={carriageType}
                            carriageQualityClass={carriageQualityClass}
                            carriageNumber={carriageNumber}
                            onClick={onSeatClick}
                            price={price}
                            startStation={startStation}
                            endStation={endStation}
                            isSeatSelectedInPotentialTicketCart={isSeatSelectedInPotentialTicketCart}
                        />
                    ))}
                </div>
                <div className="platskart-row-side">
                    {sideRow.map(seat => (
                        <CarriageSeat
                            key={seat.place_in_carriage}
                            seatNumber={seat.place_in_carriage}
                            isFree={seat.is_free}
                            carriageType={carriageType}
                            carriageQualityClass={carriageQualityClass}
                            carriageNumber={carriageNumber}
                            onClick={onSeatClick}
                            price={price}
                            startStation={startStation}
                            endStation={endStation}
                            isSeatSelectedInPotentialTicketCart={isSeatSelectedInPotentialTicketCart}
                        />
                    ))}
                </div>

            </div>
        );


    }
    const renderCoupeSeats = () =>
    {
        const topRow = [seatsInGroup[1], seatsInGroup[3]];
        const bottomRow = [seatsInGroup[0], seatsInGroup[2]];
        return (
            <div className="coupe-container">
                <div className="coupe-row">
                    {topRow.map(seat => (
                        <CarriageSeat
                            key={seat.place_in_carriage}
                            seatNumber={seat.place_in_carriage}
                            isFree={seat.is_free}
                            carriageType={carriageType}
                            carriageQualityClass={carriageQualityClass}
                            carriageNumber={carriageNumber}
                            onClick={onSeatClick}
                            price={price}
                            startStation={startStation}
                            endStation={endStation}
                            isSeatSelectedInPotentialTicketCart={isSeatSelectedInPotentialTicketCart}
                        />
                    ))}
                </div>
                <div className="coupe-row">
                    {bottomRow.map(seat => (
                        <CarriageSeat
                            key={seat.place_in_carriage}
                            seatNumber={seat.place_in_carriage}
                            isFree={seat.is_free}
                            carriageType={carriageType}
                            carriageQualityClass={carriageQualityClass}
                            carriageNumber={carriageNumber}
                            onClick={onSeatClick}
                            price={price}
                            startStation={startStation}
                            endStation={endStation}
                            isSeatSelectedInPotentialTicketCart={isSeatSelectedInPotentialTicketCart}
                        />
                    ))}
                </div>

            </div>
        )
    }
    const renderSvSeats = () =>
    {
        const row = [seatsInGroup[0], seatsInGroup[1]];
        return (
            <div className="sv-container">
                <div className="sv-row">
                    {row.map(seat => (
                        <CarriageSeat
                            key={seat.place_in_carriage}
                            seatNumber={seat.place_in_carriage}
                            isFree={seat.is_free}
                            carriageType={carriageType}
                            carriageQualityClass={carriageQualityClass}
                            carriageNumber={carriageNumber}
                            onClick={onSeatClick}
                            price={price}
                            startStation={startStation}
                            endStation={endStation}
                            isSeatSelectedInPotentialTicketCart={isSeatSelectedInPotentialTicketCart}
                        />
                    ))}
                </div>
            </div>
        )

    }

    switch (carriageType.toLowerCase())
    {
        case "platskart":
            return renderPlatskartSeats();
        case "coupe":
            return renderCoupeSeats();
        case "sv":
            return renderSvSeats();
        default:
            return renderCoupeSeats();
    }

}
export default CarriageSeatGroup;