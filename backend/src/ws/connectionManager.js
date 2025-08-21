const users = new Map();

function registerConnection(socket, { id = null, isHost = false, sessionId = null } = {}) {
    if (id) {
        if (users.has(id)) {
            const old = users.get(id);
            old.socket.close();
            users.delete(id);
        }
        users.set(id, { socket, isHost, sessionId });
    }
}

function removeConnection(socket) {
    for (const [id, entry] of users.entries()) {
        if (entry.socket === socket) {
            users.delete(id);
            console.log(`${entry.isHost ? 'Host' : 'Cliente'} '${id}' removido`);
            return;
        }
    }
    console.log('Conexão anônima removida');
}

function getUser(id) {
    return users.get(id);
}

function getHost() {
    return [...users.values()].find(u => u.isHost);
}

module.exports = { registerConnection, removeConnection, getUser, getHost };