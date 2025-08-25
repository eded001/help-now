export function ticketTemplate(ticketData, statusMap) {
    return `
        <div class="ticket">
            <div class="ticket__header">
                <a href="#" class="ticket__code">#${ticketData.code}</a>
                <span class="ticket__category">${ticketData.category}</span>
            </div>
            <div class="ticket__title">${ticketData.title}</div>
            <div class="ticket__footer">
                <span class="ticket__status ${statusMap[ticketData.status].class}">
                    ${statusMap[ticketData.status].text}
                </span>
                ${ticketData.status !== 'closed' ? `<button class="ticket__button">${statusMap[ticketData.status].button}</button>` : ''}
            </div>
        </div>
    `;
}