import { templateSupport, templateClient } from '../helpers/ticketTemplate.helper.js';
import { statusMap, advanceTicketState } from '../helpers/ticketState.helper.js';

function createTicket(ticketData, type) {
    const temp = document.createElement('div');

    const templateFn = type === 'support' ? templateSupport : templateClient;
    temp.innerHTML = templateFn(ticketData, statusMap);

    const ticketElement = temp.firstElementChild;

    if (type === 'support') {
        const button = ticketElement.querySelector('.ticket__button');
        if (button) {
            button.addEventListener('click', () =>
                advanceTicketState(ticketData, ticketElement)
            );
        }
    }

    return ticketElement;
}

function addTicketToDOM(ticketData, type = 'client') {
    const ticketElement = createTicket(ticketData, type);
    return ticketElement;
}

export { addTicketToDOM };