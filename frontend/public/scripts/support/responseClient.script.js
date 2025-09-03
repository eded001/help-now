import { sendMessageToClient } from "./ws.support.js";

const ticketsContainer = document.querySelector('.user__tickets');

ticketsContainer.addEventListener('click', event => {
    const acceptButton = event.target.closest('.ticket__button');
    if (!acceptButton) return;

    const ticketElement = acceptButton.closest('.ticket');
    if (!ticketElement) return;

    const id = ticketElement.querySelector(".ticket__code").textContent;
    const idFormatted = id.split('#')[1];

    sendMessageToClient("edgar_test", {
        response: "ok!",
        id: idFormatted
    });
});