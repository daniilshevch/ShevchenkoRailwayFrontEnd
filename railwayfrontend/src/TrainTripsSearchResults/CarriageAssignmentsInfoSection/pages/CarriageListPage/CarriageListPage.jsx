import React, {useEffect, useReducer, useState, useMemo, useCallback    } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import CarriageListLayout from '../../components/CarriageListLayout/CarriageListLayout.jsx';
import {message, Spin} from 'antd';
import './CarriageListPage.css';
import {initialPotentialTicketCartState, potentialTicketCartReducer} from "../../../../../SystemUtils/UserTicketCart/UserPotentialTicketCartSystem.js";
import UserPotentialTicketCartDrawer from "../../../../../SystemUtils/UserTicketCart/UserPotentialTicketCartDrawer/UserPotentialTicketCartDrawer.jsx";
import CarriageTypeAndQualityFilter
    from "../../components/CarriageTypeAndQualityFilter/CarriageTypeAndQualityFilter.jsx";
import { divideTypeAndQuality } from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TypeAndQualityDivider.js";
import CarriageFilteringHeader from "../../components/CarriageFilteringHeader/CarriageFilteringHeader.jsx";
import TrainRaceInfoHeader from "../../components/TrainRaceInfoHeader/TrainRaceInfoHeader.jsx";
import changeTrainRouteIdIntoUkrainian
    from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TrainRoutesDictionary.js";
import TrainScheduleModal from "../../../TrainRacesInfoSection/components/TrainScheduleModal/TrainScheduleModal.jsx";
import {
    stationTitleIntoUkrainian
} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/StationsDictionary.js";
import {
    CANCEL_TICKET_BOOKING_RESERVATION_BEFORE_PURCHASE,
    REFRESH_TRAIN_TRIP_WITH_BOOKINGS_INFO_DATA_URL
} from "../../../../../SystemUtils/ServerConnectionConfiguration/Urls/TrainSearchUrls.js";
import {
    EAGER_BOOKINGS_SEARCH_MODE
} from "../../../../../SystemUtils/ServerConnectionConfiguration/ProgramFunctioningConfiguration/ProgramFunctioningConfiguration.js";
import {SERVER_URL} from "../../../../../SystemUtils/ServerConnectionConfiguration/ConnectionConfiguration.js";
import CarriageListLegend from "../../components/CarriageListLegend/CarriageListLegend.jsx";
const seatKeyCodeForCart = (train_race_id, carriage_position_in_squad, place_in_carriage, trip_starting_station, trip_ending_station) =>
{
   return `${train_race_id}|${carriage_position_in_squad}|${place_in_carriage}|${trip_starting_station}|${trip_ending_station}`;
};

function CarriageListPage()
{
    const [messageApi, contextHolder] = message.useMessage();
    const [searchParams, setSearchParams] = useSearchParams();
    const {train_race_id, start, end} = useParams();

    //Стани даних
    const [carriageStats, setCarriageStats] = useState({});
    const [carriages, setCarriages] = useState(null);
    const [startingStationDepartureTime, setStartingStationDepartureTime] = useState(null);
    const [endingStationArrivalTime, setEndingStationArrivalTime] = useState(null);
    const [trainRouteId, setTrainRouteId] = useState(null);
    const [trainRouteClass, setTrainRouteClass] = useState(null);
    const [trainStops, setTrainStops] = useState(null);
    const [fullRouteStartingStationTitle, setFullRouteStartingStationTitle] = useState(null);
    const [fullRouteEndingStationTitle, setFullRouteEndingStationTitle] = useState(null);
    const [fullTrainData, setFullTrainData] = useState(null);

    //Стани UI
    const [isScheduleVisible, setIsScheduleVisible] = useState(false);
    const [showCarriagesWithoutFreePlaces, setShowCarriagesWithoutFreePlaces] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    //Завантаження даних з сервера
    const loadTrainDataFromServer = async (lazy_load_mode = false,  refresh_mode = false) => {
        setIsLoading(true);
        try {
            const response = await fetch(REFRESH_TRAIN_TRIP_WITH_BOOKINGS_INFO_DATA_URL(train_race_id, start, end));
            if (!response.ok) {
                throw new Error("Помилка при оновленні даних");
            }
            const newData = await response.json();
            if(EAGER_BOOKINGS_SEARCH_MODE) {
                localStorage.setItem("generalTrainRaceData", JSON.stringify(newData));
            }
            //setCarriageStats(newData.grouped_carriage_statistics_list);
            applyTrainData(newData);
            setRefreshTrigger(prev => prev + 1);
            if(refresh_mode) {
                messageApi.success("Дані успішно оновлено");
            }
            if(lazy_load_mode)
            {
                messageApi.success("Успішно завантажені доступні місця з серверу");
            }
        } catch (error) {
            console.error(error);
            messageApi.error("Не вдалося оновити дані про місця");
        } finally {
            setIsLoading(false);
        }
    };

    //Універсальна функція оновлення станів з отриманого об'єкта
    const applyTrainData = useCallback((data) => {
        setCarriageStats(data.grouped_carriage_statistics_list);
        setStartingStationDepartureTime(data.trip_starting_station_departure_time);
        setEndingStationArrivalTime(data.trip_ending_station_arrival_time);
        setTrainRouteClass(data.train_route_class);
        setTrainRouteId(data.train_route_id);
        setTrainStops(data.train_schedule);
        setFullRouteStartingStationTitle(data.full_route_starting_station_title);
        setFullRouteEndingStationTitle(data.full_route_ending_station_title);
        setFullTrainData(data);
        return data;
    }, []);

    //Ініціалізація інформації про доступні для покупки місця в поїзді
    useEffect(() => {
        const trainData = localStorage.getItem("generalTrainRaceData");
        let useCache = false;
        if(EAGER_BOOKINGS_SEARCH_MODE && trainData)
        {
            try
            {
                const parsedTrainData = JSON.parse(trainData);
                let isSameTrainRace = String(parsedTrainData.train_race_id) === String(train_race_id);
                let isSameStartStation = String(parsedTrainData.trip_starting_station_title) === String(start);
                let isSameEndStation = String(parsedTrainData.trip_ending_station_title) === String(end);


                if(isSameTrainRace && isSameStartStation && isSameEndStation)
                {
                    applyTrainData(parsedTrainData);
                    setRefreshTrigger(prev => prev + 1);
                    useCache = true;
                }
                else
                {
                    console.warn("Дані в localStorage не відповідають запиту");
                }
            }
            catch(error)
            {
                console.error(error.message);
            }
        }
        if(!useCache)
        {
            loadTrainDataFromServer(true, false);
        }
    }, [train_race_id, start, end, applyTrainData]);
    
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
    const handleFilterChange = ({ queryParams, showCarriagesWithoutFreePlaces: showFull }) => {
        if(showFull !== undefined)
        {
            setShowCarriagesWithoutFreePlaces(showFull)
        }
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
            window.dispatchEvent(new Event('cartUpdated'));
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
            full_route_starting_station: fullRouteStartingStationTitle,
            full_route_ending_station: fullRouteEndingStationTitle,
            price: price ?? 0,
            ticket_status: "SELECTED_YET_NOT_RESERVED"
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
    async function cancelTicketReservation(ticket)
    {
        const token = localStorage.getItem("token");
        potentialTicketCartDispatch({type: "REMOVE_TICKET", ticket: ticket});
        const ticket_info = {
            id: ticket.id,
            full_ticket_id: ticket.full_ticket_id,
            user_id: ticket.user_id,
            train_route_on_date_id: ticket.train_race_id,
            passenger_carriage_position_in_squad: ticket.carriage_position_in_squad,
            passenger_carriage_id: ticket.passenger_carriage_id,
            starting_station_title: ticket.trip_starting_station,
            ending_station_title: ticket.trip_ending_station,
            place_in_carriage: ticket.place_in_carriage,
            ticket_status: ticket.ticket_status === "RESERVED" ? "Booking_In_Progress" : null,
            booking_initialization_time: ticket.booking_initialization_time,
            booking_expiration_time: ticket.booking_expiration_time
        };
        const response = await fetch(CANCEL_TICKET_BOOKING_RESERVATION_BEFORE_PURCHASE, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(ticket_info)
        });
        if (!response.ok)
        {
            try {
                const errorData = await response.json();
                console.error("Докладна помилка (JSON):", errorData);
                // Наприклад, якщо сервер шле { message: "Текст помилки" }
                alert(errorData.message || "Сталася помилка");
            } catch (e) {
                // Якщо це не JSON, спробуємо просто як текст
                const errorText = await response.text();
                console.error("Докладна помилка (Text):", errorText);
            }
            console.log(response);
        }
    }
    const removePotentialTicketFromCart = (potentialTicket) =>
    {
        console.log("REMOVE OF TEMPORARY TICKET BOOKING CANCELLATION");
        potentialTicketCartDispatch({type: "REMOVE_TICKET", ticket: potentialTicket});
        if(potentialTicket.ticket_status === "RESERVED")
        {
            console.log("RESERVED section");
            cancelTicketReservation(potentialTicket);
        }
    }




    useEffect(() => {
        const typeParams = searchParams.getAll("type");
        const trainDataObject = fullTrainData;
        if (trainDataObject)
        {
            try
            {
                const carriage_statistics_list = trainDataObject.carriage_statistics_list;
                const groupedCarriageStatisticsList = trainDataObject.grouped_carriage_statistics_list;
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
    }, [searchParams, refreshTrigger]);
    const displayedCarriages = useMemo(() => {
        if (!carriages) return null;

        return carriages.filter(carriage => {
            if (showCarriagesWithoutFreePlaces) {
                return true;
            }
            return carriage.free_places > 0;
        });
    }, [carriages, showCarriagesWithoutFreePlaces]);
    return (
        <div className = "main-layout-container">
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
                onRefresh={() => loadTrainDataFromServer(false, true)}
                isLoading={isLoading}
            ></CarriageFilteringHeader>
            <div className="carriage-list-page">
                {!carriages ? (
                        <div className="loading-container">
                        <Spin size="large" tip="Завантаження доступних вагонів..." />
                        </div>
                    )
                    :(
                    <>
                        <CarriageListLayout
                            carriages={displayedCarriages}
                            onSeatClick={onSeatClickAction}
                            startStation={start}
                            endStation={end}
                            isSeatSelectedInPotentialTicketCart = {isSeatSelectedInPotentialTicketCart}
                        />
                        <CarriageListLegend></CarriageListLegend>
                        <UserPotentialTicketCartDrawer
                            cartState={potentialTicketCartState}
                            removePotentialTicketFromCart={removePotentialTicketFromCart}
                        />
                    </>
                )
            }
            </div>
            <TrainScheduleModal
                visible={isScheduleVisible}
                onClose={() => setIsScheduleVisible(false)}
                trainStops={trainStops}
                trainQualityClass={trainRouteClass}
                trainRouteId={changeTrainRouteIdIntoUkrainian(trainRouteId)}
                startingStationUkrainianTitle={stationTitleIntoUkrainian(fullRouteStartingStationTitle)}
                endingStationUkraininTitle={stationTitleIntoUkrainian(fullRouteEndingStationTitle)}
            />
        </div>
    )

}
export default CarriageListPage;