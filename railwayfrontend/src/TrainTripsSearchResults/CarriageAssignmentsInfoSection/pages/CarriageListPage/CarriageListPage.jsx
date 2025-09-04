import React, {useEffect, useReducer, useState, useMemo, useCallback    } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import CarriageListLayout from '../../components/CarriageListLayout/CarriageListLayout.jsx';
import {Button, Divider, Space, Drawer, Typography} from 'antd';
import './CarriageListPage.css';
import {initialPotentialTicketCartState, potentialTicketCartReducer} from "../../../../../SystemUtils/UserTicketCart/UserPotentialTicketCartSystem.js";
import UserPotentialTicketCartDrawer from "../../../../../SystemUtils/UserTicketCart/UserPotentialTicketCartDrawer.jsx";

const seatKeyCodeForCart = (train_race_id, carriage_position_in_squad, place_in_carriage, trip_starting_station, trip_ending_station) =>
{
   return `${train_race_id}|${carriage_position_in_squad}|${place_in_carriage}|${trip_starting_station}|${trip_ending_station}`;
};
function CarriageListPage()
{
    const [searchParams] = useSearchParams();
    const [carriages, setCarriages] = useState(null);
    const {train_race_id, start, end} = useParams();

    const [potentialTicketCartState, potentialTicketCartDispatch] = useReducer(potentialTicketCartReducer, initialPotentialTicketCartState);

    useEffect(() => {
        try
        {
            const potentialTicketsCart = localStorage.getItem("potentialTicketsCart");
            if (potentialTicketsCart)
            {
                potentialTicketCartDispatch({type: "ALLOCATE_FROM_LOCAL_STORAGE", payload: JSON.parse(potentialTicketsCart)});
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
                potentialTicketsList: potentialTicketCartState.potentialTicketsList}));
        }
        catch(error)
        {
            console.error(error);
        }
    }, [potentialTicketCartState.potentialTicketsList]);

    const selectedPotentialTicketSeats = useMemo(() => {
        return new Set(
        potentialTicketCartState.potentialTicketsList.map(ticket => seatKeyCodeForCart(
            ticket.train_race_id,
            ticket.carriage_position_in_squad,
            ticket.place_in_carriage,
            ticket.trip_starting_station,
            ticket.trip_ending_station)));
},[potentialTicketCartState.potentialTicketsList]);
    const isSeatSelectedInPotentialTicketCart = useCallback(
        (carriage_position_in_squad, place_in_carriage, trip_starting_station, trip_ending_station) =>
        {
            return selectedPotentialTicketSeats.has(seatKeyCodeForCart(train_race_id, carriage_position_in_squad, place_in_carriage, trip_starting_station, trip_ending_station));
        }, [train_race_id, selectedPotentialTicketSeats]);

    const onSeatClickAction = (carriageNumber, seatNumber, price, startStation, endStation) => {
        const potentialTicket = {
            train_race_id: train_race_id,
            carriage_position_in_squad: carriageNumber,
            place_in_carriage: seatNumber,
            trip_starting_station: startStation,
            trip_ending_station: endStation,
            price: price ?? 0
        };
        if(!isSeatSelectedInPotentialTicketCart(carriageNumber, seatNumber, startStation, endStation)) {
            potentialTicketCartDispatch({type: "ADD_TICKET", ticket: potentialTicket});
        }
        else
        {
            potentialTicketCartDispatch({type: "REMOVE_TICKET", ticket: potentialTicket});
        }
    }
    const removePotentialTicketFromCart = (potentialTicket) =>
    {
        potentialTicketCartDispatch({type: "REMOVE_TICKET", ticket: potentialTicket});
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
                        startStation={start}
                        endStation={end}
                        isSeatSelectedInPotentialTicketCart = {isSeatSelectedInPotentialTicketCart}
                    />
                    <UserPotentialTicketCartDrawer
                        cartState={potentialTicketCartState}
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