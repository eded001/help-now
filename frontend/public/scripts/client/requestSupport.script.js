import { getUserInfos } from "../utils/sessionInfo.util.js";
import { getClientId, sendMessageToSupport } from "./ws.client.js";

const form = document.querySelector("#ticketForm");

const message = {
    type: "client-request",
    id: getClientId(),
    host: false,
    payload: {
        category: "",
        name: "",
        username: "",
        title: "",
        status: "",
        priority: "",
        createdAt: new Date()
    }
};

form.addEventListener("submit", async event => {
    event.preventDefault();

    const formGroups = document.querySelectorAll(".form-group input, .form-group select");
    let isValid = true;

    formGroups.forEach(input => {
        if (input.type === "radio") {
            if (input.checked) {
                message.payload[input.name] = input.value;
            }
            return;
        }

        if (input.tagName === "select") {
            if (!input.value) {
                isValid = false;
            } else {
                message.payload[input.name] = input.value;
            }
            return;
        }

        if (!input.value.trim()) {
            isValid = false;
        } else {
            message.payload[input.name] = input.value.trim();
        }
    });

    const userInfos = await getUserInfos();
    message.payload.username = userInfos.username;
    message.payload.name = userInfos.name;
    message.payload.status = "open";

    if (!isValid) {
        alert("Preencha todos os campos obrigatórios antes de enviar.");
        return;
    }

    sendMessageToSupport(message.payload);
    form.reset();
});