import React, {useEffect, useReducer, useState, useMemo, useCallback} from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import CarriageListLayout from '../../components/CarriageListLayout/CarriageListLayout.jsx';
import {message, Spin} from 'antd';
import './CarriageListPage.css';
import {initialPotentialTicketCartState, potentialTicketCartReducer} from "../../../../../SystemUtils/UserTicketCart/UserPotentialTicketCartSystem.js";
import UserPotentialTicketCartDrawer from "../../../../../SystemUtils/UserTicketCart/UserPotentialTicketCartDrawer/UserPotentialTicketCartDrawer.jsx";
import CarriageFilteringHeader from "../../components/CarriageFilteringHeader/CarriageFilteringHeader.jsx";
import TrainRaceInfoHeader from "../../components/TrainRaceInfoHeader/TrainRaceInfoHeader.jsx";
import changeTrainRouteIdIntoUkrainian
    from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/TrainRoutesDictionary.js";
import TrainScheduleModal from "../../../TrainRacesInfoSection/components/TrainScheduleModal/TrainScheduleModal.jsx";
import {
    stationTitleIntoUkrainian
} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/StationsDictionary.js";
import {trainSearchService} from "../../../TrainRacesInfoSection/services/TrainTripsSearchService.js";
import CarriageListLegend from "../../components/CarriageListLegend/CarriageListLegend.jsx";
import {
    ticketBookingProcessingService
} from "../../../../../SystemUtils/UserTicketCart/TicketManagementService/TicketBookingProcessingService.js";
import {carriageDisplayService} from "../../services/CarriageDisplayService.js";

function CarriageListPage() //January
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
    //Завантаження даних з сервера
    const loadTrainDataFromServer = async (lazy_load_mode = false,  refresh_mode = false) => {
        setIsLoading(true);
        try {
            const data = await trainSearchService.LOAD_TRAIN_DATA_FROM_SERVER(train_race_id, start, end);
            applyTrainData(data);
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
    //Завантаження даних про поїзд з кешу або серверу(в залежності від налаштувань використання кешу та актуальності інформації
    //в кеші, якщо він використовується)
    useEffect(() => {
        const {finalTrainData, useCache} = trainSearchService.LOAD_TRAIN_DATA_FROM_CACHE(train_race_id, start, end);
        if(finalTrainData && useCache)
        {
            applyTrainData(finalTrainData);
            setRefreshTrigger(prev => prev + 1);
        }
        else
        {
            loadTrainDataFromServer(true, false);
        }
    }, [train_race_id, start, end, applyTrainData]);


    //Частина, пов'язана з кошиком квитків
    const [potentialTicketCartState, potentialTicketCartDispatch] = useReducer(potentialTicketCartReducer, initialPotentialTicketCartState);

    //Завантаження актуального кошика з LocalStorage
    useEffect(() => {
        ticketBookingProcessingService.GET_POTENTIAL_TICKET_CART_FROM_STORAGE(potentialTicketCartDispatch)
    }, []);
    //Синхронізація LocalStorage з актуальним кошиком
    useEffect(() => {
        ticketBookingProcessingService.SAVE_POTENTIAL_TICKET_CART_TO_STORAGE(potentialTicketCartState)
    }, [potentialTicketCartState.potentialTicketsList])
    //Вертає список зайнятих місць в спеціальному форматі
    const selectedPotentialTicketSeats = useMemo(() => {
        return ticketBookingProcessingService.GET_SELECTED_POTENTIAL_TICKET_SEATS(potentialTicketCartState)
    }, [potentialTicketCartState.potentialTicketsList])
    //Перевіряє, чи певне місце заброньоване(перевірка на місце, рейс, поїздку між конкретними станціями)
    const isSeatSelectedInPotentialTicketCart = useCallback(
        (carriage_position_in_squad, place_in_carriage, trip_starting_station, trip_ending_station) =>
        {
            return ticketBookingProcessingService.IS_SEAT_SELECTED_IN_POTENTIAL_TICKET_CART(
                selectedPotentialTicketSeats,
                train_race_id,
                carriage_position_in_squad,
                place_in_carriage,
                trip_starting_station,
                trip_ending_station)
        }, [train_race_id, selectedPotentialTicketSeats]);
    //Отримання конкретного квитка з кошику
    const getTicketFromCart = (carriage_position_in_squad, place_in_carriage, trip_starting_station, trip_ending_station) =>
    {
        return ticketBookingProcessingService.GET_TICKET_FROM_CART(
            potentialTicketCartState,
            train_race_id,
            carriage_position_in_squad,
            place_in_carriage,
            trip_starting_station,
            trip_ending_station
        );
    }
    //Обробка натиснення на місце в вагоні
    const onSeatClickAction = (carriageNumber, seatNumber, price, startStation, endStation, carriageType, carriageQualityClass) =>
    {
        const potentialTicket = ticketBookingProcessingService.ALLOCATE_SELECTED_YET_NOT_RESERVED_TICKET_FOR_CART({
            train_race_id,
            trainRouteClass,
            carriageNumber,
            carriageType,
            carriageQualityClass,
            seatNumber,
            startStation,
            endStation,
            startingStationDepartureTime,
            endingStationArrivalTime,
            fullRouteStartingStationTitle,
            fullRouteEndingStationTitle,
            price
        });
        if(!isSeatSelectedInPotentialTicketCart(carriageNumber, seatNumber, startStation, endStation))
        {
            ticketBookingProcessingService.ADD_POTENTIAL_NOT_RESERVED_TICKET_TO_CART(potentialTicketCartState, potentialTicketCartDispatch, potentialTicket, messageApi);
        }
        else
        {
            ticketBookingProcessingService.REMOVE_POTENTIAL_TICKET_FROM_CART_IF_YET_NOT_RESERVED(potentialTicketCartDispatch, potentialTicket)
        }
    }
    //Прибирання квитка з кошика з скасуванням тимчасової резервації на сервері, якщо вона була розпочата
    const removePotentialTicketFromCart = (potentialTicket) =>
    {
        ticketBookingProcessingService.REMOVE_POTENTIAL_TICKET_FROM_CART_WITH_SERVER_TEMPORARY_RESERVATION_CANCELLATION(potentialTicket, potentialTicketCartDispatch, messageApi)
    }

    const initialSelectedSubtypes = useMemo(() =>
        carriageDisplayService.PARSE_INITIAL_SELECTED_SUBTYPES(searchParams), [searchParams]);
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

    useEffect(() => {
        const typeParams =  searchParams.getAll("type");
        const filteredCarriagesList = carriageDisplayService.FILTER_CARRIAGES_BY_TYPE_AND_QUALITY(fullTrainData, typeParams);
        setCarriages(filteredCarriagesList);
    }, [searchParams, fullTrainData, refreshTrigger]);


    const displayedCarriages = useMemo(() =>
        carriageDisplayService.GET_FINAL_DISPLAYED_CARRIAGES(carriages, showCarriagesWithoutFreePlaces),
        [carriages, showCarriagesWithoutFreePlaces]);

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
                            getTicketFromCart = {getTicketFromCart}
                        />
                        <CarriageListLegend/>
                        <UserPotentialTicketCartDrawer
                            cartState={potentialTicketCartState}
                            removePotentialTicketFromCart={removePotentialTicketFromCart}
                            dispatch = {potentialTicketCartDispatch}
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

















// const selectedPotentialTicketSeats = useMemo(() => {
//     return new Set(
//     potentialTicketCartState.potentialTicketsList.map(ticket => seatKeyCodeForCart(
//         ticket.train_race_id,
//         ticket.carriage_position_in_squad,
//         ticket.place_in_carriage,
//         ticket.trip_starting_station,
//         ticket.trip_ending_station)));
// },[potentialTicketCartState.potentialTicketsList]);

// const isSeatSelectedInPotentialTicketCart = useCallback(
//     (carriage_position_in_squad, place_in_carriage, trip_starting_station, trip_ending_station) =>
//     {
//         return selectedPotentialTicketSeats.has(seatKeyCodeForCart(train_race_id, carriage_position_in_squad, place_in_carriage, trip_starting_station, trip_ending_station));
//     }, [train_race_id, selectedPotentialTicketSeats]);

// const getTicketFromCart = (carriage_position_in_squad, place_in_carriage, trip_starting_station, trip_ending_station) => {
//     return potentialTicketCartState.potentialTicketsList.find(t =>
//         t.train_race_id === train_race_id &&
//         t.carriage_position_in_squad === carriage_position_in_squad &&
//         t.place_in_carriage === place_in_carriage &&
//         t.trip_starting_station === trip_starting_station &&
//         t.trip_ending_station === trip_ending_station
//     );
// };

// const onSeatClickAction = (carriageNumber, seatNumber, price, startStation, endStation, carriageType, carriageQualityClass) => {
//     const potentialTicket = {
//         train_race_id: train_race_id,
//         train_route_quality_class: trainRouteClass,
//         carriage_position_in_squad: carriageNumber,
//         carriage_type: carriageType,
//         carriage_quality_class: carriageQualityClass,
//         place_in_carriage: seatNumber,
//         trip_starting_station: startStation,
//         trip_ending_station: endStation,
//         trip_starting_station_departure_time: startingStationDepartureTime,
//         trip_ending_station_arrival_time: endingStationArrivalTime,
//         full_route_starting_station: fullRouteStartingStationTitle,
//         full_route_ending_station: fullRouteEndingStationTitle,
//         price: price ?? 0,
//         ticket_status: "SELECTED_YET_NOT_RESERVED"
//     };
//     if(!isSeatSelectedInPotentialTicketCart(carriageNumber, seatNumber, startStation, endStation)) {
//         if(potentialTicketCartState.potentialTicketsList.length < 4)
//         {
//             potentialTicketCartDispatch({type: "ADD_TICKET", ticket: potentialTicket});
//         }
//         else
//         {
//             messageApi.info("Максимальна кількість потенційних квитків в кошику - 4")
//         }
//     }
//     else
//     {
//         potentialTicketCartDispatch({type: "REMOVE_TICKET", ticket: potentialTicket});
//     }
// }

// async function cancelTicketReservation(ticket)
// {
//     const token = localStorage.getItem("token");
//     potentialTicketCartDispatch({type: "REMOVE_TICKET", ticket: ticket});
//     const ticket_info = {
//         id: ticket.id,
//         full_ticket_id: ticket.full_ticket_id,
//         user_id: ticket.user_id,
//         train_route_on_date_id: ticket.train_race_id,
//         passenger_carriage_position_in_squad: ticket.carriage_position_in_squad,
//         passenger_carriage_id: ticket.passenger_carriage_id,
//         starting_station_title: ticket.trip_starting_station,
//         ending_station_title: ticket.trip_ending_station,
//         place_in_carriage: ticket.place_in_carriage,
//         ticket_status: ticket.ticket_status === "RESERVED" ? "Booking_In_Progress" : null,
//         booking_initialization_time: ticket.booking_initialization_time,
//         booking_expiration_time: ticket.booking_expiration_time
//     };
//     const response = await fetch(CANCEL_TICKET_BOOKING_RESERVATION_BEFORE_PURCHASE, {
//         method: 'DELETE',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(ticket_info)
//     });
//     if (!response.ok)
//     {
//         try {
//             const errorData = await response.json();
//             console.error("Докладна помилка (JSON):", errorData);
//             // Наприклад, якщо сервер шле { message: "Текст помилки" }
//             alert(errorData.message || "Сталася помилка");
//         } catch (e) {
//             // Якщо це не JSON, спробуємо просто як текст
//             const errorText = await response.text();
//             console.error("Докладна помилка (Text):", errorText);
//         }
//         console.log(response);
//     }
// }
// const removePotentialTicketFromCart = (potentialTicket) =>
// {
//     console.log("REMOVE OF TEMPORARY TICKET BOOKING CANCELLATION");
//     potentialTicketCartDispatch({type: "REMOVE_TICKET", ticket: potentialTicket});
//     if(potentialTicket.ticket_status === "RESERVED")
//     {
//         console.log("RESERVED section");
//         cancelTicketReservation(potentialTicket);
//     }
// }

// useEffect(() => {
//     const typeParams = searchParams.getAll("type");
//     const trainDataObject = fullTrainData;
//     if (trainDataObject)
//     {
//         try
//         {
//             const carriage_statistics_list = trainDataObject.carriage_statistics_list;
//             const groupedCarriageStatisticsList = trainDataObject.grouped_carriage_statistics_list;
//             let carriagesList = [];
//             if (typeParams.length > 0) {
//                 for (const type of typeParams) {
//                     const typeAndQuality = divideTypeAndQuality(type);
//                     const _type = typeAndQuality.type;
//                     const qualities = typeAndQuality.qualities;
//                     const typeGroup = groupedCarriageStatisticsList?.[_type];
//                     console.log(typeGroup);
//                     console.log("----");
//                     console.log(qualities);
//                     console.log("XXXXXXXXXXXX");
//                     if (!typeGroup) {
//                         continue;
//                     }
//                     const qualityClassDictionary = typeGroup.carriage_quality_class_dictionary;
//                     let selectedQualities = undefined;
//                     if (qualities.length > 0) {
//                         selectedQualities = qualities.filter(quality => qualityClassDictionary[quality] != undefined);
//                     }
//                     else {
//                         selectedQualities = Object.keys(qualityClassDictionary);
//                     }
//                     console.log("--------");
//                     console.log(selectedQualities);
//                     for (const quality of selectedQualities) {
//                         const qualityClassData = qualityClassDictionary[quality];
//                         if (!qualityClassData) {
//                             continue;
//                         }
//                         carriagesList.push(...(qualityClassData.carriage_statistics_list || []));
//
//                     }
//                     carriagesList.sort((a, b) => a.carriage_position_in_squad - b.carriage_position_in_squad);
//                 }
//             }
//             else
//             {
//                 carriagesList = carriage_statistics_list;
//             }
//             console.log(carriagesList);
//             setCarriages(carriagesList);
//         }
//         catch (error)
//         {
//             console.error(error);
//         }
//     }
// }, [searchParams, refreshTrigger]);
// const displayedCarriages = useMemo(() => {
//     if (!carriages) return null;
//
//     return carriages.filter(carriage => {
//         if (showCarriagesWithoutFreePlaces) {
//             return true;
//         }
//         return carriage.free_places > 0;
//     });
// }, [carriages, showCarriagesWithoutFreePlaces]);

// const initialSelectedSubtypes = useMemo(() => {
//     const dict = {};
//     const tokens = searchParams.getAll("type");
//     for(const token of tokens)
//     {
//         const {type, qualities} = divideTypeAndQuality(token);
//         if(qualities.length > 0)
//         {
//             dict[type] = Array.from(new Set(qualities));
//         }
//         else
//         {
//             dict[type] = ["All"]
//         }
//     }
//     return dict;
// }, [searchParams]);