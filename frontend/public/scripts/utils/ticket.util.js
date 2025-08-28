import { ticketTemplate } from '../helpers/ticketTemplate.helper.js';
import { statusMap, advanceTicketState } from '../helpers/ticketState.helper.js';

function createTicket(ticketData) {
    const temp = document.createElement('div');
    temp.innerHTML = ticketTemplate(ticketData, statusMap);
    const ticketElement = temp.firstElementChild;

    const button = ticketElement.querySelector('.ticket__button');
    if (button) {
        button.addEventListener('click', () => advanceTicketState(ticketData, ticketElement));
    }

    return ticketElement;
}

function addTicketToDOM(ticketData, container) {
    const ticketElement = createTicket(ticketData);
    container.appendChild(ticketElement);
}

export { createTicket, addTicketToDOM };