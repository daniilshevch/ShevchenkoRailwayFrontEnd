import {React, useReducer} from "react";
import {SERVER_URL} from "../ServerConnectionConfiguration/ConnectionConfiguration.js";
const initialPotentialTicketCartState = {
    potentialTicketsList: [],
    isOpen: false,
    totalSum: 0
};
function potentialTicketCartReducer(state, action)
{
    const addTicket = () => {
        const ticketExistance = state.potentialTicketsList.some(potential_ticket =>
            potential_ticket.train_race_id === action.ticket.train_race_id
            && potential_ticket.carriage_position_in_squad === action.ticket.carriage_position_in_squad
            && potential_ticket.place_in_carriage === action.ticket.place_in_carriage
            && potential_ticket.trip_starting_station === action.ticket.trip_starting_station
            && potential_ticket.trip_ending_station === action.ticket.trip_ending_station
        );
        const updatedTicketsList = ticketExistance ? state.potentialTicketsList : [...state.potentialTicketsList, action.ticket];
        let newTotalSum = state.totalSum;
        if (ticketExistance === false) {
            newTotalSum += action.ticket.price;
        }
        return {...state, potentialTicketsList: updatedTicketsList, totalSum: newTotalSum};
    }
    const removeTicket = () => {
        const updatedTicketsList = state.potentialTicketsList.filter(potential_ticket => !(potential_ticket.train_race_id === action.ticket.train_race_id
            && potential_ticket.carriage_position_in_squad === action.ticket.carriage_position_in_squad
            && potential_ticket.place_in_carriage === action.ticket.place_in_carriage
            && potential_ticket.trip_starting_station === action.ticket.trip_starting_station
            && potential_ticket.trip_ending_station === action.ticket.trip_ending_station));

        const newTotalSum = updatedTicketsList.reduce(
            (sum, ticket) => sum + (ticket.price || 0),
            0
        );
        return {...state, potentialTicketsList: updatedTicketsList, totalSum: newTotalSum};
    }

    switch (action.type)
    {
        case "ALLOCATE_FROM_LOCAL_STORAGE": {
            const localStorageItem = action.payload;
            return {
                potentialTicketsList: localStorageItem?.potentialTicketsList ?? [],
                isOpen: localStorageItem.potentialTicketsList.length > 0,
                totalSum: (localStorageItem?.potentialTicketsList ?? []).reduce((sum, ticket) => sum + (ticket.price || 0), 0)
            };
        }
        case "OPEN":
            return {...state, isOpen: true};
        case "CLOSE":
            return {...state, isOpen: false};
        case "ADD_TICKET": {

            return addTicket();
        }
        case "REMOVE_TICKET": {
            return removeTicket();
        }
        case "CHANGE_TICKET_STATUS": {
            removeTicket();
            return addTicket();
        }
        case "CLEAR_CART":
            return {...state, potentialTicketsList: [], totalSum: 0};
        default:
            return state;

    }
}
export {initialPotentialTicketCartState, potentialTicketCartReducer};
function UserTicketCart()
{


}