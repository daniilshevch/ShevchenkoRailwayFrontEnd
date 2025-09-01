import React from 'react';
import { FaSnowflake } from "react-icons/fa";
import { IoWifi } from "react-icons/io5";
import { FaShower } from "react-icons/fa6";
import { IoIosRestaurant } from "react-icons/io";
import { TbDisabled } from "react-icons/tb";
import { GrCafeteria } from "react-icons/gr";
import { GiElectricalSocket } from "react-icons/gi";
import { TbCircleLetterAFilled } from "react-icons/tb";
import { TbCircleLetterBFilled } from "react-icons/tb";
import { TbCircleLetterCFilled } from "react-icons/tb";
import './CarriageInfoPanel.css';
function CarriageInfoPanel({ carriageNumber, type, qualityClass, features,  freePlaces, totalPlaces, price })
{
    const classIcons = {
        A: <TbCircleLetterAFilled className="class-icon" style={{ color: 'red' }} />,
        B: <TbCircleLetterBFilled className="class-icon" style={{ color: 'green' }} />,
        C: <TbCircleLetterCFilled className="class-icon" style={{ color: 'blue' }} />,
    };

    return (
        <div className="carriage-info-panel">
            <div className="carriage-header">
                {classIcons[qualityClass]}
                <h3>Вагон №{carriageNumber}</h3>
            </div>
            <p>Тип: {type}</p>
            <p>Місця: {freePlaces}/{totalPlaces}</p>
            <div className = "features-row">
                <p>
                    {features.wifi_availability ? (
                        <IoWifi style={{ color: 'seagreen', fontSize: '25px'}} />
                    ) : (
                        <span className="crossed-icon">
                                <IoWifi style={{ color: '#ccc', fontSize: '25px' }} />
                        </span>
                    )}
                </p>
                <p>
                    {features.air_conditioning ? (
                        <FaSnowflake style={{ color: 'cornflowerblue', fontSize: '25px'}} />
                    ) : (
                        <span className="crossed-icon">
                                <FaSnowflake style={{ color: '#ccc', fontSize: '25px'}} />
                        </span>
                    )}
                </p>
                <p>
                    {features.shower_availability ? (
                        <FaShower style={{ color: '#00bcd4', fontSize: '25px' }} />
                    ) : (
                        <span className="crossed-icon">
                                <FaShower style={{ color: '#ccc', fontSize: '25px'}} />
                        </span>
                    )}
                </p>
            </div>
            <div className="features-row">
                <p>
                    {features.food_availability ? (
                        <GrCafeteria style={{ color: "darkorange", fontSize: '25px' }} />
                    ) : (
                        <span className="crossed-icon">
                                <GrCafeteria style={{ color: '#ccc', fontSize: '25px'}} />
                        </span>
                    )}
                </p>
                <p>
                    <GiElectricalSocket style={{ color: "mediumpurple", fontSize: '25px' }} />
                </p>
                <p>
                    {features.is_inclusive ? (
                        <TbDisabled style={{ color: 'seagreen', fontSize: '25px'}} />
                    ) : (
                        <span className="crossed-icon">
                                <TbDisabled style={{ color: '#ccc', fontSize: '25px'}} />
                        </span>
                    )}
                </p>
            </div>
            <p>Ціна: {price}₴</p>
        </div>
    );
}
export default CarriageInfoPanel;