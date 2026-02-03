import {SERVER_URL} from "../../../../SystemUtils/ServerConnectionConfiguration/ConnectionConfiguration.js";
import {userAuthenticationService} from "../../../../SystemUtils/UserDefinerService/UserDefiner.js";

class UserTicketManagementService
{
    async GET_GROUPED_USER_TICKETS_FROM_SERVER(activeTab)
    {
        const currentUser = userAuthenticationService.getCurrentUser();
        if (!currentUser?.token) {
            const error = new Error("Unauthorized");
            error.status = 401;
            throw error;
        }

        const endpoint = activeTab === "active"
            ? "get-grouped-active-tickets-for-current-user"
            : "get-grouped-archieved-tickets-for-current-user";

        const res = await fetch(`${SERVER_URL}/${endpoint}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser?.token}`
            }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        return Array.isArray(json) ? json : [];
    }
    async DOWNLOAD_TICKET_PDF(ticket)
    {
        const currentUser = userAuthenticationService.getCurrentUser();
        try
        {
            const response = await fetch(`${SERVER_URL}/download-ticket-pdf`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${currentUser?.token}`
                },
                body: JSON.stringify(ticket)
            });
            if (!response.ok) {
                let errorDetails;
                try {
                    errorDetails = await response.json();
                } catch (e) {
                    errorDetails = null;
                }
                if (!errorDetails) {
                    const errorText = await response.text();
                    throw new Error(errorText || `Помилка сервера: ${response.status}`);
                }
                const errorMessage = errorDetails.message
                    || errorDetails.title
                    || JSON.stringify(errorDetails)
                    || "Не вдалося завантажити файл";
                throw new Error(errorMessage);
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ticket_${ticket.full_ticket_id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error("Download error:", error);
        }
    }
    async RETURN_TICKET_AFTER_PURCHASE(ticket)
    {
        const currentUser = userAuthenticationService.getCurrentUser();
        try {
            const response = await fetch(`${SERVER_URL}/return-ticket-for-current-user/${ticket.full_ticket_id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${currentUser?.token}`
                },
                body: JSON.stringify(ticket)
            });
            if (!response.ok) {
                let errorDetails;
                try {
                    errorDetails = await response.json();
                } catch (e) {
                    errorDetails = null;
                }
                const errorMessage = errorDetails?.message
                    || errorDetails?.title
                    || JSON.stringify(errorDetails)
                    || "Не вдалося завантажити файл";

                throw new Error(errorMessage);
            }
        }
        catch (error) {
            console.error("Return error:", error);
        }

    }
}
export const userTicketManagementService = new UserTicketManagementService();