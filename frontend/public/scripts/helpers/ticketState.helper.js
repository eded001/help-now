export const statusMap = {
    open: { text: 'Aberto', class: 'ticket__status--open', button: 'Aceitar' },
    'in-progress': { text: 'Em andamento', class: 'ticket__status--in-progress', button: 'Resolver' },
    closed: { text: 'Fechado', class: 'ticket__status--closed', button: null }
};

export function advanceTicketState(ticketData, ticketElement) {
    const statusEl = ticketElement.querySelector('.ticket__status');
    const footer = ticketElement.querySelector('.ticket__footer');
    const button = ticketElement.querySelector('.ticket__button');

    if (ticketData.status === 'open') {
        ticketData.status = 'in-progress';
        statusEl.textContent = statusMap['in-progress'].text;
        statusEl.className = `ticket__status ${statusMap['in-progress'].class}`;
        button.textContent = statusMap['in-progress'].button;
    } else if (ticketData.status === 'in-progress') {
        ticketData.status = 'closed';
        statusEl.textContent = statusMap['closed'].text;
        statusEl.className = `ticket__status ${statusMap['closed'].class}`;
        button.remove();

        const info = document.createElement('span');
        info.className = 'ticket__info';
        const date = new Date();
        info.textContent = `Fechado em ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        footer.prepend(info);
    }
}