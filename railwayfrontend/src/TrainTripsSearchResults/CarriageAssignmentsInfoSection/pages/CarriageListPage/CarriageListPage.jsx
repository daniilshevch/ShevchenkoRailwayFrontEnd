import React, {useEffect, useReducer, useState} from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import CarriageListLayout from '../../components/CarriageListLayout/CarriageListLayout.jsx';
import {Button, Divider, Space, Drawer, Typography} from 'antd';
import './CarriageListPage.css';
import {initialPotentialTicketCartState, potentialTicketCartReducer} from "../../../../../SystemUtils/UserTicketCart/UserPotentialTicketCartSystem.js";
import UserPotentialTicketCartDrawer from "../../../../../SystemUtils/UserTicketCart/UserPotentialTicketCartDrawer.jsx";
function CarriageListPage()
{
    const [searchParams] = useSearchParams();
    const [carriages, setCarriages] = useState(null);
    const {train_race_id} = useParams();

    const [cartState, cartDispatch] = useReducer(potentialTicketCartReducer, initialPotentialTicketCartState);

    useEffect(() => {
        try
        {
            const potentialTicketsCart = localStorage.getItem("potentialTicketsCart");
            if (potentialTicketsCart)
            {
                cartDispatch({type: "ALLOCATE_FROM_LOCAL_STORAGE", payload: JSON.parse(potentialTicketsCart)});
            }
        }
        catch(error)
        {
            console.error(error);
        }
    }, []);
    useEffect(() => {
        try
        {
            localStorage.setItem("potentialTicketsCart", JSON.stringify({
                potentialTicketsList: cartState.potentialTicketsList}));
        }
        catch(error)
        {
            console.error(error);
        }
    }, [cartState.potentialTicketsList]);

    const onSeatClickAction = (carriageNumber, seatNumber, price) => {
        const potentialTicket = {
            train_race_id: train_race_id,
            carriage_position_in_squad: carriageNumber,
            place_in_carriage: seatNumber,
            price: price ?? 0
        };
        console.log(carriageNumber);
        console.log(seatNumber);
        console.log(price);
        cartDispatch({type: "ADD_TICKET", ticket: potentialTicket});
    }
    const removePotentialTicketFromCart = (potentialTicket) =>
    {
        cartDispatch({type: "REMOVE_TICKET", ticket: potentialTicket});
    }




    useEffect(() => {
        const typeParams = searchParams.getAll("type");
        const qualityParams = searchParams.getAll("quality");
        const trainData = localStorage.getItem("generalTrainRaceData");
        if (trainData)
        {
            try
            {
                const trainDataObject = JSON.parse(trainData);
                const carriage_statistics_list = trainDataObject.carriage_statistics_list;
                const groupedCarriageStatisticsList = trainDataObject.grouped_carriage_statistics_list;
                console.log(groupedCarriageStatisticsList);
                console.log(typeParams);
                let carriagesList = [];
                if (typeParams.length > 0) {
                    for (const type of typeParams) {
                        const typeGroup = groupedCarriageStatisticsList?.[type];
                        console.log(typeGroup);
                        if (!typeGroup) {
                            continue;
                        }
                        const qualityClassDictionary = typeGroup.carriage_quality_class_dictionary;
                        let selectedQualities = undefined;
                        if (qualityParams.length > 0) {
                            selectedQualities = qualityParams.filter(quality => qualityClassDictionary[quality] != undefined);
                        }
                        else {
                            selectedQualities = Object.keys(qualityClassDictionary);
                        }
                        for (const quality of selectedQualities) {
                            const qualityClassData = qualityClassDictionary[quality];
                            if (!qualityClassData) {
                                continue;
                            }
                            carriagesList.push(...(qualityClassData.carriage_statistics_list || []));

                        }
                        carriagesList.sort((a, b) => a.carriage_position_in_squad - b.carriage_position_in_squad);
                    }
                }
                else
                {
                    carriagesList = carriage_statistics_list;
                }
                console.log(carriagesList);
                setCarriages(carriagesList);
            }
            catch (error)
            {
                console.error(error);
            }
        }
    }, [searchParams]);
    return (
        <div className="carriage-list-page">
            {carriages ? (
                <>
                    <CarriageListLayout
                        carriages={carriages}
                        onSeatClick={onSeatClickAction}
                    />
                    <UserPotentialTicketCartDrawer
                        cartState={cartState}
                        removePotentialTicketFromCart={removePotentialTicketFromCart}
                    />
                </>
            ) : (
            <p>Завантаження...</p>
        )}
        </div>
    )

}
export default CarriageListPage;