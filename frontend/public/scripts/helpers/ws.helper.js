import { getWebSocket, sendMessageToSupport } from "../ws.client.js";

function handleSubmit({ category, name, username, title, status }) {
    const ws = getWebSocket();
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        alert("Erro: WebSocket não está conectado.");
        return;
    }

    const payload = {
        category,
        name,
        username,
        title,
        status
    };

    sendMessageToSupport(payload);
}

export { handleSubmit };