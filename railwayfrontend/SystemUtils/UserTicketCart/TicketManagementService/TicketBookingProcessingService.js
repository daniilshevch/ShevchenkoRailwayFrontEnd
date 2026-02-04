import {
    CANCEL_TICKET_BOOKING_RESERVATION_BEFORE_PURCHASE
} from "../../ServerConnectionConfiguration/Urls/TrainSearchUrls.js";
import {userAuthenticationService} from "../../UserAuthenticationService/UserAuthenticationService.js";
import {SERVER_URL} from "../../ServerConnectionConfiguration/ConnectionConfiguration.js";

const maxTicketsInCart = 40;
class TicketBookingProcessingService {
    GET_POTENTIAL_TICKET_CART_FROM_STORAGE(potentialTicketCartDispatch) {
        try {
            const potentialTicketsCart = localStorage.getItem("potentialTicketsCart");
            if (potentialTicketsCart) {
                potentialTicketCartDispatch({
                    type: "ALLOCATE_FROM_LOCAL_STORAGE",
                    payload: JSON.parse(potentialTicketsCart)
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    SAVE_POTENTIAL_TICKET_CART_TO_STORAGE(potentialTicketCartState) {
        try {
            localStorage.setItem("potentialTicketsCart", JSON.stringify({
                potentialTicketsList: potentialTicketCartState.potentialTicketsList
            }));
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error(error);
        }
    }

    GENERATE_SEAT_KEY(train_race_id, carriage_position_in_squad, place_in_carriage, trip_starting_station, trip_ending_station) {
        return `${train_race_id}|${carriage_position_in_squad}|${place_in_carriage}|${trip_starting_station}|${trip_ending_station}`;
    }

    GET_SELECTED_POTENTIAL_TICKET_SEATS(potentialTicketCartState) {
        return new Set(
            potentialTicketCartState.potentialTicketsList.map(ticket => this.GENERATE_SEAT_KEY(
                ticket.train_race_id,
                ticket.carriage_position_in_squad,
                ticket.place_in_carriage,
                ticket.trip_starting_station,
                ticket.trip_ending_station)));
    }

    IS_SEAT_SELECTED_IN_POTENTIAL_TICKET_CART(selectedPotentialTicketSeats, train_race_id, carriage_position_in_squad, place_in_carriage, trip_starting_station, trip_ending_station) {
        return selectedPotentialTicketSeats.has(this.GENERATE_SEAT_KEY(train_race_id, carriage_position_in_squad, place_in_carriage, trip_starting_station, trip_ending_station));
    }

    GET_TICKET_FROM_CART(potentialTicketCartState, train_race_id, carriage_position_in_squad, place_in_carriage, trip_starting_station, trip_ending_station)
    {
        return potentialTicketCartState.potentialTicketsList.find(ticket =>
            ticket.train_race_id === train_race_id &&
            ticket.carriage_position_in_squad === carriage_position_in_squad &&
            ticket.place_in_carriage === place_in_carriage &&
            ticket.trip_starting_station === trip_starting_station &&
            ticket.trip_ending_station === trip_ending_station
        );
    }
    ALLOCATE_SELECTED_YET_NOT_RESERVED_TICKET_FOR_CART(data)
    {
        const potentialTicket = {
            train_race_id: data.train_race_id,
            train_route_quality_class: data.trainRouteClass,
            carriage_position_in_squad: data.carriageNumber,
            carriage_type: data.carriageType,
            carriage_quality_class: data.carriageQualityClass,
            place_in_carriage: data.seatNumber,
            trip_starting_station: data.startStation,
            trip_ending_station: data.endStation,
            trip_starting_station_departure_time: data.startingStationDepartureTime,
            trip_ending_station_arrival_time: data.endingStationArrivalTime,
            full_route_starting_station: data.fullRouteStartingStationTitle,
            full_route_ending_station: data.fullRouteEndingStationTitle,
            price: data.price ?? 0,
            ticket_status: "SELECTED_YET_NOT_RESERVED"
        };
        return potentialTicket;
    }
    ADD_POTENTIAL_NOT_RESERVED_TICKET_TO_CART(potentialTicketCartState, potentialTicketCartDispatch, potentialTicket, messageApi)
    {
        if(potentialTicketCartState.potentialTicketsList.length < maxTicketsInCart)
        {
            potentialTicketCartDispatch({type: "ADD_TICKET", ticket: potentialTicket});
        }
        else
        {
            messageApi.info(`Максимальна кількість потенційних квитків в кошику - ${maxTicketsInCart}`)
        }
    }
    REMOVE_POTENTIAL_TICKET_FROM_CART_IF_YET_NOT_RESERVED(potentialTicketCartDispatch, potentialTicket)
    {
        potentialTicketCartDispatch({type: "REMOVE_TICKET", ticket: potentialTicket});
    }
    async CANCEL_TEMPORARY_TICKET_RESERVATION_ON_SERVER(ticket)
    {
        const currentUser = userAuthenticationService.getCurrentUser();
        //potentialTicketCartDispatch({type: "REMOVE_TICKET", ticket: ticket});
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
                'Authorization': `Bearer ${currentUser?.token}`
            },
            body: JSON.stringify(ticket_info)
        });
        if (!response.ok)
        {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Не вдалося скасувати бронювання на сервері");
        }
    }
    async REMOVE_POTENTIAL_TICKET_FROM_CART_WITH_SERVER_TEMPORARY_RESERVATION_CANCELLATION(potentialTicket, potentialTicketCartDispatch, messageApi)
    {
        potentialTicketCartDispatch({type: "REMOVE_TICKET", ticket: potentialTicket});
        if(potentialTicket.ticket_status === "RESERVED")
        {
            try
            {
                await this.CANCEL_TEMPORARY_TICKET_RESERVATION_ON_SERVER(potentialTicket);
                messageApi.info(`Ви скасували тимчасову резервацію для місця ${potentialTicket.place_in_carriage}`);
            }
            catch(error)
            {
                console.error("Помилка скасування:", error);
            }
        }
    }
    async INITIALIZE_TICKET_BOOKING_PROCESS(dispatch)
    {
        const potentialTicketsCart = localStorage.getItem("potentialTicketsCart");
        const currentUser = userAuthenticationService.getCurrentUser();

        let ticketBookings = JSON.parse(potentialTicketsCart)?.potentialTicketsList ?? [];
        ticketBookings = ticketBookings.filter(ticket => ticket.ticket_status !== "BOOKING_FAILED"
            && ticket.ticket_status !== "EXPIRED");

        const ticketBookingsDtoForFetch = [];
        for(const ticket of ticketBookings)
        {
            const ticketDto = {
                train_route_on_date_id: ticket.train_race_id,
                passenger_carriage_position_in_squad: ticket.carriage_position_in_squad,
                starting_station_title: ticket.trip_starting_station,
                ending_station_title: ticket.trip_ending_station,
                place_in_carriage: ticket.place_in_carriage
            };
            //Якщо запит на тимчасову резервацію на сервер ще не надсилався, то надсилаємо його
            if(ticket.ticket_status === "SELECTED_YET_NOT_RESERVED")
            {
                ticketBookingsDtoForFetch.push(ticketDto);
            }
        }
        const response = await fetch(`${SERVER_URL}/Client-API/CompleteTicketBookingProcessing/Initialize-Multiple-Ticket-Bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser?.token}`
            },
            body: JSON.stringify(ticketBookingsDtoForFetch),
        });
        if(!response.ok)
        {
            throw new Error("Невірні облікові дані");
        }

        //Отримуємо відповідь від сервера і в залежності від неї оновлюємо статуси квитків
        const ticketListReservationResult =  await response.json();
        for(const ticket of ticketBookings) //Проходимся по всіх квитках, що знаходяться в кошику
        {
            if(ticket.ticket_status === "SELECTED_YET_NOT_RESERVED") {
                //Отримуємо відповідь сервера по конкретному квитку(якщо він ще був не зарезервований і ми провели звернення на сервер по ньому
                const singleTicketBookingReservationResult = ticketListReservationResult.find(ticket_booking =>
                    ticket_booking.train_route_on_date_id === ticket.train_race_id &&
                    ticket_booking.passenger_carriage_position_in_squad === ticket.carriage_position_in_squad &&
                    ticket_booking.starting_station_title === ticket.trip_starting_station &&
                    ticket_booking.ending_station_title === ticket.trip_ending_station &&
                    ticket_booking.place_in_carriage === ticket.place_in_carriage);
                const ticketBookingReservationStatus = singleTicketBookingReservationResult?.ticket_status;
                //Якщо сервер видав статус Booking_In_Progress, то резервація успішна
                if (ticketBookingReservationStatus === "Booking_In_Progress") {
                    ticket.ticket_status = "RESERVED";
                    ticket.id = singleTicketBookingReservationResult.id;
                    ticket.full_ticket_id = singleTicketBookingReservationResult.full_ticket_id;
                    ticket.user_id = singleTicketBookingReservationResult.user_id;
                    ticket.passenger_carriage_id = singleTicketBookingReservationResult.passenger_carriage_id;
                    ticket.booking_initialization_time = singleTicketBookingReservationResult.booking_initialization_time;
                    ticket.booking_expiration_time = singleTicketBookingReservationResult.booking_expiration_time;
                } else {//Інакше - резервація провалена
                    ticket.ticket_status = "BOOKING_FAILED";
                }
            }
        }
        dispatch({type: "CLEAR_CART"});
        for(const ticket of ticketBookings)
        {
            dispatch({type: "ADD_TICKET", ticket: ticket});
        }
        localStorage.setItem("potentialTicketsCart", JSON.stringify({
            potentialTicketsList: ticketBookings}));
        window.dispatchEvent(new Event('cartUpdated'));
    }
    GET_ONLY_RESERVED_TICKETS_FOR_BOOKING_COMPLETION_ON_SERVER(potentialTicketCartDispatch)
    {
        try {
            const potentialTicketsCart = localStorage.getItem("potentialTicketsCart");
            if (potentialTicketsCart) {
                const parsed = JSON.parse(potentialTicketsCart);
                const list = parsed?.potentialTicketsList ?? parsed?.potentialTickets ?? [];
                const reservedOnly = list.filter(t => t.ticket_status === "RESERVED");
                potentialTicketCartDispatch({ type: "ALLOCATE_FROM_LOCAL_STORAGE", payload: {potentialTicketsList: reservedOnly} });
                return reservedOnly;
            }
        } catch (error) {
            console.error(error);
        }
        return [];
    }
    FILL_TICKETS_WITH_PASSENGER_INFO(tickets, values, potentialTicketCartDispatch)
    {
        const completedTicketsWithPassengerTripInfo = tickets.map((ticket, idx) => {
            const passenger_info = values.passengers?.[idx] || {};
            return {
                ...ticket,
                passenger_trip_info: {
                    passenger_name: passenger_info.firstName || "",
                    passenger_surname: passenger_info.lastName || ""
                }
            };
        });
        potentialTicketCartDispatch({type: "CLEAR_CART"});
        for(const ticket of completedTicketsWithPassengerTripInfo)
        {
            potentialTicketCartDispatch({type: "ADD_TICKET", ticket: ticket});
        }
        localStorage.setItem("potentialTicketsCart", JSON.stringify({
            potentialTicketsList: completedTicketsWithPassengerTripInfo}));
    }
    async COMPLETE_MULTIPLE_TICKET_BOOKING_PURCHASE_TRANSACTION_ON_SERVER(tickets)
    {
        const currentUser = userAuthenticationService.getCurrentUser();
        //НЕОБІХІДНО ВИРІШИТИ ПРОБЛЕМУ з passenger_trip_info, якщо перехід відбувається не централізованим методом
        const ticket_completion_info_list = tickets.map(ticket => ({
            mediator_ticket_booking: {
                id: ticket.id,
                full_ticket_id: ticket.full_ticket_id,
                user_id: ticket.user_id,
                train_route_on_date_id: ticket.train_race_id,
                passenger_carriage_id: ticket.passenger_carriage_id,
                passenger_carriage_position_in_squad: ticket.carriage_position_in_squad,
                place_in_carriage: ticket.place_in_carriage,
                starting_station_title: ticket.trip_starting_station,
                ending_station_title: ticket.trip_ending_station,
                ticket_status: "Booking_In_Progress",
                booking_initialization_time: ticket.booking_initialization_time,
                booking_expiration_time: ticket.booking_expiration_time
            },
            passenger_info: {
                passenger_name: ticket.passenger_trip_info.passenger_name,
                passenger_surname: ticket.passenger_trip_info.passenger_surname
            }
        }));
        const final_payload = {
            ticket_completion_info_list: ticket_completion_info_list
        };

        const response = await fetch(`${SERVER_URL}/Client-API/CompleteTicketBookingProcessing/Complete-Multiple-Ticket-Bookings-As-Transaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser?.token}`
            },
            body: JSON.stringify(final_payload)
        });

        return response;
    }
    CLEAR_POTENTIAL_TICKET_CART(potentialTicketCartDispatch)
    {
        localStorage.removeItem("potentialTicketsCart");
        window.dispatchEvent(new Event('cartUpdated'));
        potentialTicketCartDispatch({ type: "CLEAR_CART" });
    }
}
export const ticketBookingProcessingService = new TicketBookingProcessingService();
