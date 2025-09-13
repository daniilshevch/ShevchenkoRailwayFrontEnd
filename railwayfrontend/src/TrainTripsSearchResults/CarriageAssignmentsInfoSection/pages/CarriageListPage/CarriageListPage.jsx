import React, {useEffect, useReducer, useState, useMemo, useCallback    } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import CarriageListLayout from '../../components/CarriageListLayout/CarriageListLayout.jsx';
import {message} from 'antd';
import './CarriageListPage.css';
import {initialPotentialTicketCartState, potentialTicketCartReducer} from "../../../../../SystemUtils/UserTicketCart/UserPotentialTicketCartSystem.js";
import UserPotentialTicketCartDrawer from "../../../../../SystemUtils/UserTicketCart/UserPotentialTicketCartDrawer.jsx";
import CarriageTypeAndQualityFilter
    from "../../components/CarriageTypeAndQualityFilter/CarriageTypeAndQualityFilter.jsx";
import { divideTypeAndQuality } from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TypeAndQualityDivider.js";
import CarriageFilteringHeader from "../../components/CarriageFilteringHeader/CarriageFilteringHeader.jsx";
import TrainRaceInfoHeader from "../../components/TrainRaceInfoHeader/TrainRaceInfoHeader.jsx";
import changeTrainRouteIdIntoUkrainian
    from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TrainRoutesDictionary.js";
import TrainScheduleModal from "../../../TrainRacesInfoSection/components/TrainScheduleModal/TrainScheduleModal.jsx";
const seatKeyCodeForCart = (train_race_id, carriage_position_in_squad, place_in_carriage, trip_starting_station, trip_ending_station) =>
{
   return `${train_race_id}|${carriage_position_in_squad}|${place_in_carriage}|${trip_starting_station}|${trip_ending_station}`;
};

function CarriageListPage()
{
    const [messageApi, contextHolder] = message.useMessage();
    const [searchParams, setSearchParams] = useSearchParams();
    const [carriageStats, setCarriageStats] = useState({});
    const [carriages, setCarriages] = useState(null);
    const {train_race_id, start, end} = useParams();
    const [startingStationDepartureTime, setStartingStationDepartureTime] = useState(null);
    const [endingStationArrivalTime, setEndingStationArrivalTime] = useState(null);
    const [trainRouteId, setTrainRouteId] = useState(null);
    const [trainRouteClass, setTrainRouteClass] = useState(null);
    const [isScheduleVisible, setIsScheduleVisible] = useState(false);
    const [trainStops, setTrainStops] = useState(null);

    const initialSelectedSubtypes = useMemo(() => {
        const dict = {};
        const tokens = searchParams.getAll("type");
        for(const token of tokens)
        {
            const {type, qualities} = divideTypeAndQuality(token);
            if(qualities.length > 0)
            {
                dict[type] = Array.from(new Set(qualities));
            }
            else
            {
                dict[type] = ["All"]
            }
        }
        return dict;
    }, [searchParams]);
    const initialSelectedTypes = useMemo(() => Object.keys(initialSelectedSubtypes), [initialSelectedSubtypes]);
    const handleFilterChange = ({ queryParams }) => {
        const current = searchParams.getAll("type");
        const same =
            current.length === queryParams.length &&
            current.every((v, i) => v === queryParams[i]);
        if (same) return;

        const next = new URLSearchParams(searchParams);
        next.delete("type");
        for (const t of queryParams) next.append("type", t);
        setSearchParams(next, { replace: true });
    };



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

    const onSeatClickAction = (carriageNumber, seatNumber, price, startStation, endStation, carriageType, carriageQualityClass) => {
        const potentialTicket = {
            train_race_id: train_race_id,
            train_route_quality_class: trainRouteClass,
            carriage_position_in_squad: carriageNumber,
            carriage_type: carriageType,
            carriage_quality_class: carriageQualityClass,
            place_in_carriage: seatNumber,
            trip_starting_station: startStation,
            trip_ending_station: endStation,
            trip_starting_station_departure_time: startingStationDepartureTime,
            trip_ending_station_arrival_time: endingStationArrivalTime,
            price: price ?? 0
        };
        if(!isSeatSelectedInPotentialTicketCart(carriageNumber, seatNumber, startStation, endStation)) {
            if(potentialTicketCartState.potentialTicketsList.length < 4)
            {
                potentialTicketCartDispatch({type: "ADD_TICKET", ticket: potentialTicket});
            }
            else
            {
                messageApi.info("Максимальна кількість потенційних квитків в кошику - 4")
            }
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
        const trainData = localStorage.getItem("generalTrainRaceData");
        if (trainData)
        {
            try
            {
                const trainDataObject = JSON.parse(trainData);
                const carriage_statistics_list = trainDataObject.carriage_statistics_list;
                const groupedCarriageStatisticsList = trainDataObject.grouped_carriage_statistics_list;
                setCarriageStats(groupedCarriageStatisticsList);
                const tripStartingStationDepartureTime = trainDataObject.trip_starting_station_departure_time;
                setStartingStationDepartureTime(tripStartingStationDepartureTime);
                const tripEndingStationArrivalTime = trainDataObject.trip_ending_station_arrival_time;
                setEndingStationArrivalTime(tripEndingStationArrivalTime);
                const trainRouteQualityClass = trainDataObject.train_route_class;
                const trainRouteId = trainDataObject.train_route_id;
                setTrainRouteClass(trainRouteQualityClass);
                setTrainRouteId(trainRouteId);
                setTrainStops(trainDataObject.train_schedule);
                console.log(groupedCarriageStatisticsList);
                console.log(typeParams);
                let carriagesList = [];
                if (typeParams.length > 0) {
                    for (const type of typeParams) {
                        const typeAndQuality = divideTypeAndQuality(type);
                        const _type = typeAndQuality.type;
                        const qualities = typeAndQuality.qualities;
                        const typeGroup = groupedCarriageStatisticsList?.[_type];
                        console.log(typeGroup);
                        console.log("----");
                        console.log(qualities);
                        console.log("XXXXXXXXXXXX");
                        if (!typeGroup) {
                            continue;
                        }
                        const qualityClassDictionary = typeGroup.carriage_quality_class_dictionary;
                        let selectedQualities = undefined;
                        if (qualities.length > 0) {
                            selectedQualities = qualities.filter(quality => qualityClassDictionary[quality] != undefined);
                        }
                        else {
                            selectedQualities = Object.keys(qualityClassDictionary);
                        }
                        console.log("--------");
                        console.log(selectedQualities);
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
        <>
            {contextHolder}
            <TrainRaceInfoHeader
                trainRouteId={changeTrainRouteIdIntoUkrainian(trainRouteId)}
                trainRouteQualityClass={trainRouteClass}
                startingStation={start}
                endingStation={end}
                startingStationDepartureTime={startingStationDepartureTime}
                endingStationArrivalTime={endingStationArrivalTime}
                setTrainScheduleModalVisible={setIsScheduleVisible}
            />
            <CarriageFilteringHeader
                groupedSeats={carriageStats}
                initialSelectedTypes={initialSelectedTypes}
                initialSelectedSubtypes={initialSelectedSubtypes}
                onChange={handleFilterChange}
            ></CarriageFilteringHeader>
            {/*<CarriageTypeAndQualityFilter*/}
            {/*    groupedSeats={carriageStats}*/}
            {/*    initialSelectedTypes={initialSelectedTypes}*/}
            {/*    initialSelectedSubtypes={initialSelectedSubtypes}*/}
            {/*    onChange={handleFilterChange}*/}
            {/*></CarriageTypeAndQualityFilter>*/}
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
            <TrainScheduleModal
                visible={isScheduleVisible}
                onClose={() => setIsScheduleVisible(false)}
                trainStops={trainStops}
            />
        </>
    )

}
export default CarriageListPage;