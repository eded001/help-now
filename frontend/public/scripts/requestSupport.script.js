// utils e helpers
import { getUserInfos } from "./utils/sessionInfo.util.js";
import { getClientId, sendMessageToSupport } from "./ws.client.js";

const form = document.querySelector("#ticketForm");

const message = {
    type: "client-message",
    id: getClientId(),
    host: false,
    payload: {
        category: "",
        title: "",
        username: "",
    }
};

form.addEventListener("submit", async event => {
    event.preventDefault();

    const formGroups = document.querySelectorAll(".form-group input, .form-group select, .form-group textarea");
    let isValid = true;

    formGroups.forEach(input => {
        if (input.name in message.payload) {
            if (!input.value.trim()) {
                isValid = false;
            } else {
                message.payload[input.name] = input.value.trim();
            }
        }
    });

    message.payload.username = (await getUserInfos()).username;
    message.payload.name = (await getUserInfos()).name;
    message.payload.status = "open";

    if (!isValid) {
        alert("Preencha todos os campos obrigatórios antes de enviar.");
        return;
    }

    sendMessageToSupport(message.payload);
    form.reset();
});