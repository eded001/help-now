import { sendMessageToClient } from "../../scripts/support/ws.support.js";

export const statusMap = {
    open: { text: 'Aberto', class: 'ticket__status--open', button: 'Aceitar' },
    'in-progress': { text: 'Em andamento', class: 'ticket__status--in-progress', button: 'Resolver' },
    closed: { text: 'Fechado', class: 'ticket__status--closed', button: null }
};

function formatDateBR(date) {
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

export function advanceTicketState(ticketData, ticketElement) {
    const statusEl = ticketElement.querySelector('.ticket__status');
    const footer = ticketElement.querySelector('.ticket__footer');
    const button = ticketElement.querySelector('.ticket__button');
    const infoEl = ticketElement.querySelector('.ticket__info');

    if (ticketData.status === 'open') {
        ticketData.status = 'in-progress';
        statusEl.textContent = statusMap['in-progress'].text;
        statusEl.className = `ticket__status ${statusMap['in-progress'].class}`;
        button.textContent = statusMap['in-progress'].button;

        sendMessageToClient(ticketData.username, {
            id: ticketData.id,
            status: ticketData.status
        });

    } else if (ticketData.status === 'in-progress') {
        ticketData.status = 'closed';
        statusEl.textContent = statusMap['closed'].text;
        statusEl.className = `ticket__status ${statusMap['closed'].class}`;
        if (button) button.remove();

        const dateClosed = new Date();
        if (infoEl) {
            infoEl.textContent = `Fechado em ${formatDateBR(dateClosed)}`;
        } else {
            const newInfo = document.createElement('span');
            newInfo.className = 'ticket__info';
            newInfo.textContent = `Fechado em ${formatDateBR(dateClosed)}`;
            footer.prepend(newInfo);
        }

        sendMessageToClient(ticketData.username, {
            id: ticketData.id,
            status: ticketData.status,
            date_closed: dateClosed.toISOString()
        });
    }
}