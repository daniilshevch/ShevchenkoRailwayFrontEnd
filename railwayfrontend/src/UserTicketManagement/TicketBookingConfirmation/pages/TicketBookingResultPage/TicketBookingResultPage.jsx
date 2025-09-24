import {useEffect, useReducer} from "react";
import {
    initialPotentialTicketCartState,
    potentialTicketCartReducer
} from "../../../../../SystemUtils/UserTicketCart/UserPotentialTicketCartSystem.js";
import {SERVER_URL} from "../../../../../SystemUtils/ConnectionConfiguration/ConnectionConfiguration.js";


function TicketBookingResultPage()
{
    const [potentialTicketCartState, potentialTicketCartDispatch] = useReducer(potentialTicketCartReducer, initialPotentialTicketCartState);
    const completeTicketBookingProcess = async (ticket, userInfo) => {
        const token = localStorage.getItem("token");
        const ticket_info = {
            id: ticket.id,
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
        const user_and_trip_info = {
            passenger_name: userInfo.passenger_name,
            passenger_surname: userInfo.passenger_surname
        };
        const booking_confirmation_body = {
            ticket_booking_dto: ticket_info,
            user_info_dto: user_and_trip_info
        };
        const response = await fetch(`${SERVER_URL}/Client-API/CompleteTicketBookingProcessing/Complete-Ticket-Booking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(booking_confirmation_body)
        });
        if (!response.ok)
        {
            console.log(response);
        }
    };

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
}
export default TicketBookingResultPage;