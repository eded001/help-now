import { generateSessionId, generateUUID } from "./utils/uuid.util.js";
import { env } from "./constants/main.constant.js";
import { getUserInfos } from "./utils/sessionInfo.util.js";
import { addTicketToDOM } from "./utils/ticket.util.js";

let webSocket = null;
let clientId = null;

const { ip, port } = env;

function startSession() {
    const sessionId = generateSessionId();
    clientId = generateUUID();

    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        console.log("WebSocket já conectado");
        return;
    }

    webSocket = new WebSocket(`ws://${ip}:${port}`);

    webSocket.addEventListener("open", async () => {
        const { username, name } = await getUserInfos();

        sendMessage({
            type: "client-init",
            id: clientId,
            session: sessionId,
            user: { username, name }
        });
    });

    webSocket.addEventListener("message", handleClientMessage);

    webSocket.addEventListener("error", (error) => {
        console.error("Erro no WebSocket do cliente:", error);
    });

    webSocket.addEventListener("close", () => {
        console.log("WebSocket do cliente fechado");
    });
}

function sendMessage(data) {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        webSocket.send(JSON.stringify(data));
    } else {
        console.warn("WebSocket do cliente não está pronto para envio");
    }
}

async function sendMessageToSupport(payload) {
    const { username, name } = await getUserInfos();

    sendMessage({
        type: "client-request",
        clientId,
        payload,
        user: { username, name }
    });
}

function handleClientMessage(event) {
    const response = JSON.parse(event.data);

    switch (response.type) {
        case "confirmation":
            console.log(response.payload);
            break;
        case "db-info":
            console.log(response.payload);
            addTicketToDOM(response.payload, document.querySelector('.user__tickets'));
        default:
            break;
        case "host-confirm":
            console.log(response.payload);
            console.log("Mensagem recebida:", response.payload);
            break;
    }
}

function getWebSocket() {
    return webSocket;
}

function getClientId() {
    return clientId;
}

export { startSession, handleClientMessage, getWebSocket, getClientId, sendMessageToSupport };