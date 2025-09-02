import { sendMessage } from "./ws.support";
const acceptButtons = document.querySelectorAll('.ticket__button');

acceptButtons.forEach(acceptButton => {
    acceptButton.addEventListener("click", event => {
        const id = event.currentTarget.closest('.ticket').querySelector(".ticket__code").textContent;
        const idFormatted = id.split('#')[1];

        sendMessage({
            type: "accept",
        })
    });
});