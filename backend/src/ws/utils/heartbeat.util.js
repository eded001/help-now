function heartbeat(socket) {
    if (!socket.isAlive) {
        socket.terminate();
        return;
    }
    socket.isAlive = false;
    socket.ping();
}

module.exports = { heartbeat };