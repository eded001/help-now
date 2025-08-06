const os = require('os');

module.exports = {
    getLocalIPv4() {
        const interfaces = os.networkInterfaces();

        for (const name in interfaces) {
            for (const iface of interfaces[name]) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    return iface.address;
                }
            }
        }

        return null;
    }
}