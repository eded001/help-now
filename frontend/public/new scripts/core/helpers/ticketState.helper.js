export const TicketState = {
    OPEN: "open",
    IN_PROGRESS: "in_progress",
    CLOSED: "closed"
};

export function nextState(current) {
    switch (current) {
        case TicketState.OPEN:
            return TicketState.IN_PROGRESS;
        case TicketState.IN_PROGRESS:
            return TicketState.RESOLVED;
        default:
            return current;
    }
}