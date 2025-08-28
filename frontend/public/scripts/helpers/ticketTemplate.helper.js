import { translateProblem } from './translate.helper.js';

export function ticketTemplate(ticketData, statusMap) {
    const { category, title, code, status } = ticketData;

    return `
        <div class="ticket">
            <div class="ticket__header">
                <a href="#" class="ticket__code">#${code || ''}</a>
                <span class="ticket__category">${translateProblem(category)}</span>
            </div>
            <div class="ticket__title">${title}</div>
            <div class="ticket__footer">
                <span class="ticket__status ${statusMap[status]?.class || ''}">
                    ${statusMap[status]?.text || ''}
                </span>
                ${status !== 'closed' && status !== 'resolved'
            ? `<button class="ticket__button">${statusMap[status]?.button || ''}</button>`
            : ''
        }
            </div>
        </div>
    `;
}