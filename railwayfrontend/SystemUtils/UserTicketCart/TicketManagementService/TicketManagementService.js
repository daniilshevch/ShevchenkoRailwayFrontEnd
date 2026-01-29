import {
    CANCEL_TICKET_BOOKING_RESERVATION_BEFORE_PURCHASE
} from "../../ServerConnectionConfiguration/Urls/TrainSearchUrls.js";

class TicketManagementService {
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
        if(potentialTicketCartState.potentialTicketsList.length < 4)
        {
            potentialTicketCartDispatch({type: "ADD_TICKET", ticket: potentialTicket});
        }
        else
        {
            messageApi.info("Максимальна кількість потенційних квитків в кошику - 4")
        }
    }
    REMOVE_POTENTIAL_TICKET_FROM_CART_IF_YET_NOT_RESERVED(potentialTicketCartDispatch, potentialTicket)
    {
        potentialTicketCartDispatch({type: "REMOVE_TICKET", ticket: potentialTicket});
    }
    async CANCEL_TEMPORARY_TICKET_RESERVATION_ON_SERVER(ticket)
    {
        const token = localStorage.getItem("token");
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
                'Authorization': `Bearer ${token}`
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
}
export const ticketManagementService = new TicketManagementService();
