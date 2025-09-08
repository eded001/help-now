import { formatDate } from './formatDate.js';
import { translateProblem } from './translate.helper.js';

function templateSupport(ticketData, statusMap) {
    const { category, title, id, status, created_by } = ticketData;
    const { name, department, username } = created_by;

    return `
        <div class="ticket" data-username="${username}">
            <div class="ticket__header">
                <a href="#" class="ticket__code">#${id || ''}</a>
                <span class="ticket__category">${translateProblem(category)}</span>
                <span class="ticket__separator">|</span>
                <span class="ticket__user-info">${name}</span>
                <span class="ticket__separator">-</span>
                <span class="ticket__user-info">${department}</span>
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

function templateClient(ticketData, statusMap) {
    const { id, category, title, status, createdAt } = ticketData;

    return `
        <div class="ticket">
            <div class="ticket__header">
                <a href="#" class="ticket__code">#${id || ''}</a>
                <span class="ticket__category">${translateProblem(category)}</span>
            </div>
            <div class="ticket__title">${title}</div>
            <div class="ticket__footer">
                <span class="ticket__info">Aberto em ${formatDate(createdAt)}</span>
                <span class="ticket__status ${statusMap[status]?.class || ''}">
                    ${statusMap[status]?.text || ''}
                </span>
            </div>
        </div>
    `;
}

export { templateSupport, templateClient };