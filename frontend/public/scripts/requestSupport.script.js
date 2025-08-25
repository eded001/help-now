// utils e helpers
import { getUserInfos } from "./utils/sessionInfo.util.js";
import { getClientId, sendMessageToSupport } from "./ws.client.js";

const form = document.querySelector("#ticketForm");

const message = {
    type: "client-message",
    id: getClientId(),
    host: false,
    payload: {
        userInfos: { name: "", department: "" },
        helpInfos: { category: "", title: "", description: "" }
    }
};

form.addEventListener("submit", async event => {
    event.preventDefault();

    const { name, department } = await getUserInfos();
    message.payload.userInfos = { name, department };

    const formGroups = document.querySelectorAll(".form-group input, .form-group select, .form-group textarea");
    let isValid = true;

    formGroups.forEach(input => {
        if (input.name in message.payload.helpInfos) {
            if (!input.value.trim()) {
                isValid = false;
            } else {
                message.payload.helpInfos[input.name] = input.value.trim();
            }
        }
    });

    if (!isValid) {
        alert("Preencha todos os campos obrigatórios antes de enviar.");
        return;
    }

    sendMessageToSupport(message.payload);
    form.reset();
});