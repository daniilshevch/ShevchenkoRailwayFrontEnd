import {Carousel} from 'antd';
import {useEffect, useReducer, useState} from "react";
import {
    initialPotentialTicketCartState,
    potentialTicketCartReducer
} from "../../../../../SystemUtils/UserTicketCart/UserPotentialTicketCartSystem.js";
import TicketBookingsCarousel from "../../components/TicketBookingsCarousel/TicketBookingsCarousel.jsx";
import "./TicketBookingArrangementPage.css";
function TicketBookingArrangementPage()
{
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
    return (
        <div className="booking-background-image">
            <TicketBookingsCarousel
                tickets={potentialTicketCartState.potentialTicketsList}
                potentialTicketCartState={potentialTicketCartState}
                potentialTicketCartDispatch={potentialTicketCartDispatch}
            />
        </div>
    )
}
export default TicketBookingArrangementPage;