export function normalizeTicket(ticket) {
    return {
        ...ticket,
        createdAt: ticket.created_at,
        updatedAt: ticket.updated_at,
        resolvedAt: ticket.resolved_at,
        status: ticket.status.toLowerCase().replace("_", "-"),
        createdBy: ticket.created_by,
        assignedTo: ticket.assigned_to
    };
}

export function normalizeTickets(ticketsArray) {
    return ticketsArray.map(normalizeTicket);
}