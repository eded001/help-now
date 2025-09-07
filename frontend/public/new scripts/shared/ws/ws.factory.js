import { handleMessage, handleError, handleOpen, handleClose } from "./ws.handlers.js";

let socket = null;

export function createWebSocket(url) {
    socket = new WebSocket(url);

    socket.onopen = handleOpen;
    socket.onmessage = handleMessage;
    socket.onerror = handleError;
    socket.onclose = handleClose;

    return socket;
}

export function getWebSocket() {
    return socket;
}