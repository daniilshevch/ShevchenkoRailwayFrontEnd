import {useEffect, useReducer, useState} from "react";
import {
    initialPotentialTicketCartState,
    potentialTicketCartReducer
} from "../../../../../SystemUtils/UserTicketCart/UserPotentialTicketCartSystem.js";
import TicketBookingsCarousel from "../../components/TicketBookingsCarousel/TicketBookingsCarousel.jsx";
import "./TicketBookingArrangementPage.css";
import {
    ticketBookingProcessingService
} from "../../../../../SystemUtils/UserTicketCart/TicketManagementService/TicketBookingProcessingService.js";

//January
function TicketBookingArrangementPage() //January
{
    const [isLoading, setIsLoading] = useState(true);
    const [potentialTicketCartState, potentialTicketCartDispatch] = useReducer(potentialTicketCartReducer, initialPotentialTicketCartState);
    useEffect(() => {
        ticketBookingProcessingService.GET_POTENTIAL_TICKET_CART_FROM_STORAGE(potentialTicketCartDispatch);
        setIsLoading(false);
    }, []);
    useEffect(() => {
        ticketBookingProcessingService.SAVE_POTENTIAL_TICKET_CART_TO_STORAGE(potentialTicketCartState);
    }, [potentialTicketCartState.potentialTicketsList]);
    return (
        <div className="booking-background-image">
            <TicketBookingsCarousel
                tickets={potentialTicketCartState.potentialTicketsList}
                loading = {isLoading}
                potentialTicketCartState={potentialTicketCartState}
                potentialTicketCartDispatch={potentialTicketCartDispatch}
            />
        </div>
    )
}
export default TicketBookingArrangementPage;

// useEffect(() => {
//     try
//     {
//         const potentialTicketsCart = localStorage.getItem("potentialTicketsCart");
//         if (potentialTicketsCart)
//         {
//             potentialTicketCartDispatch({type: "ALLOCATE_FROM_LOCAL_STORAGE", payload: JSON.parse(potentialTicketsCart)});
//         }
//     }
//     catch(error)
//     {
//         console.error(error);
//     }
//     finally
//     {
//         setIsLoading(false);
//     }
// }, []);
// useEffect(() => {
//     try
//     {
//         localStorage.setItem("potentialTicketsCart", JSON.stringify({
//             potentialTicketsList: potentialTicketCartState.potentialTicketsList}));
//     }
//     catch(error)
//     {
//         console.error(error);
//     }
// }, [potentialTicketCartState.potentialTicketsList]);