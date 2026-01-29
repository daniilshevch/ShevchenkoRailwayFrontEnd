class TicketManagementService {

    GET_POTENTIAL_TICKET_CART_FROM_STORAGE(potentialTicketCartDispatch) {
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
    }

    SAVE_POTENTIAL_TICKET_CART_TO_STORAGE(potentialTicketCartState) {
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
    }
}
export const ticketManagementService = new TicketManagementService();
