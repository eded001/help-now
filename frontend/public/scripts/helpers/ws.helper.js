import { getWebSocket, getClientId, sendMessageToSupport } from "../ws.client.js";

function handleSubmit({ userInfos: { name, department }, helpInfos: { category, title, description } }) {
    const ws = getWebSocket();
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        alert("Erro: WebSocket não está conectado.");
        return;
    }

    const payload = {
        userInfos: { name, department },
        helpInfos: { category, title, description }
    };

    sendMessageToSupport(payload);
}

export { handleSubmit };