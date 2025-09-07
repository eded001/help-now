export function parseMessage(message) {
    try {
        return JSON.parse(message);
    } catch {
        return { type: "raw", payload: message };
    }
}

export function stringifyMessage(obj) {
    return JSON.stringify(obj);
}