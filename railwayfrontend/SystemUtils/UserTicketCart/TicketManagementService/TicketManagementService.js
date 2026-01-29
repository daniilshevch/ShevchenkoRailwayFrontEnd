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
    CREATE_SELECTED_YET_NOT_RESERVED_TICKET_IN_CART(data)
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
}
export const ticketManagementService = new TicketManagementService();
