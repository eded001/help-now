import { addTicketToDOM } from "./ticket.util.js";
import { normalizeTickets } from "../helpers/ticket.adapter.js";

export async function renderRequests() {
    try {
        const response = await fetch('/api/tickets');
        if (!response.ok) throw new Error("Erro HTTP:", response.status);

        const tickets = await response.json();

        const normalizedTickets = normalizeTickets(tickets.data);

        normalizedTickets.forEach(ticket => {
            document.querySelector('.user__tickets').appendChild(addTicketToDOM(ticket, "client"));
        });

    } catch (error) {
        console.error("Erro ao carregar tickets:", error.message);
    }
}