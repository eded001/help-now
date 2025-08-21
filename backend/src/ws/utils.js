function heartbeat(socket) {
    if (!socket.isAlive) return socket.terminate();
    socket.isAlive = false;
    socket.ping();
}

function safeSend(socket, data) {
    if (socket.readyState === socket.OPEN) {
        socket.send(JSON.stringify(data));
    }
}

module.exports = { heartbeat, safeSend };