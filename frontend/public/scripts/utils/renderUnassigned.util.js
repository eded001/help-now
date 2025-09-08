import { addTicketToDOM } from "./ticket.util.js";
import { normalizeTickets } from "../helpers/ticket.adapter.js";

export async function renderUnassigned() {
    try {
        const response = await fetch('/api/tickets/unassigned');
        if (!response.ok) throw new Error("Erro HTTP:", response.status);

        const tickets = await response.json();
        console.log(tickets);

        const normalizedTickets = normalizeTickets(tickets.data);

        normalizedTickets.forEach(ticket => {
            document.querySelector('.user__tickets').appendChild(addTicketToDOM(ticket, "support"));
        });

    } catch (error) {
        console.error("Erro ao carregar tickets:", error.message);
    }
}