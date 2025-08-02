import React from 'react';
import CarriageSeat from './CarriageSeat';
import './CarriageSeatGroup.css';
function CarriageSeatGroup({ seats, type, qualityClass, onSeatClick })
{
    const renderPlatskartSeats = () =>
    {
        const topRow = [seats[1], seats[3]];
        const bottomRow = [seats[0], seats[2]];
        const sideRow = [seats[4], seats[5]];
        return (
            <div className="platskart-container">
                <div className="platskart-row">
                    {topRow.map(seat => (
                        <CarriageSeat
                            key={seat.place_in_carriage}
                            number={seat.place_in_carriage}
                            isFree={seat.is_free}
                            type={type}
                            qualityClass={qualityClass}
                            onClick={onSeatClick}
                        />
                    ))}
                </div>
                <div className="platskart-row">
                    {bottomRow.map(seat => (
                        <CarriageSeat
                            key={seat.place_in_carriage}
                            number={seat.place_in_carriage}
                            isFree={seat.is_free}
                            type={type}
                            qualityClass={qualityClass}
                            onClick={onSeatClick}
                        />
                    ))}
                </div>
                <div className="platskart-row-side">
                    {sideRow.map(seat => (
                        <CarriageSeat
                            key={seat.place_in_carriage}
                            number={seat.place_in_carriage}
                            isFree={seat.is_free}
                            type={type}
                            qualityClass={qualityClass}
                            onClick={onSeatClick}
                        />
                    ))}
                </div>

            </div>
        );


    }
    const renderCoupeSeats = () =>
    {
        const topRow = [seats[1], seats[3]];
        const bottomRow = [seats[0], seats[2]];
        return (
            <div className="coupe-container">
                <div className="coupe-row">
                    {topRow.map(seat => (
                        <CarriageSeat
                            key={seat.place_in_carriage}
                            number={seat.place_in_carriage}
                            isFree={seat.is_free}
                            type={type}
                            qualityClass={qualityClass}
                            onClick={onSeatClick}
                        />
                    ))}
                </div>
                <div className="coupe-row">
                    {bottomRow.map(seat => (
                        <CarriageSeat
                            key={seat.place_in_carriage}
                            number={seat.place_in_carriage}
                            isFree={seat.is_free}
                            type={type}
                            qualityClass={qualityClass}
                            onClick={onSeatClick}
                        />
                    ))}
                </div>

            </div>
        )
    }
    const renderSvSeats = () =>
    {
        const row = [seats[0], seats[1]];
        return (
            <div className="sv-container">
                <div className="sv-row">
                    {row.map(seat => (
                        <CarriageSeat
                            key={seat.place_in_carriage}
                            number={seat.place_in_carriage}
                            isFree={seat.is_free}
                            type={type}
                            qualityClass={qualityClass}
                            onClick={onSeatClick}
                        />
                    ))}
                </div>
            </div>
        )

    }

    switch (type.toLowerCase())
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