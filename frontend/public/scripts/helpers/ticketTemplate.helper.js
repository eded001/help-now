import { translateDepartment, translateProblem } from './translate.helper.js';

export function ticketTemplate(ticketData, statusMap) {
    const { userInfos, helpInfos, code, status, dateClosed } = ticketData;

    return `
        <div class="ticket">
            <div class="ticket__header">
                <a href="#" class="ticket__code">#${code || ''}</a>
                <span class="ticket__category">${translateProblem(helpInfos.category)}</span>
                ${userInfos?.name ? `
                    <span class="ticket__separator">|</span>
                    <span class="ticket__user-info">${userInfos.name}</span>
                    <span class="ticket__separator">-</span>
                    <span class="ticket__user-info">${translateDepartment(userInfos.department)}</span>
                ` : ''}
            </div>
            <div class="ticket__title">${helpInfos.title}</div>
            <div class="ticket__footer">
                ${status === 'closed' || status === 'resolved' ?
            `<span class="ticket__info">${status === 'closed' ? 'Fechado' : 'Concluído'} em ${dateClosed || '--/--/----'}</span>`
            : ''
        }
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