export const RECONNECT_INTERVAL = 3000;

export const webSocketInfos = {
    ip: window.env?.ip || 'localhost',
    port: window.env?.webSocketPort || '5525'
};