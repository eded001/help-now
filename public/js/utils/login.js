const { ip, port } = window.env;
const url = `http://${ip}:${port}/api`;

function login({ username, password }) {
    const body = { username };

    if (!password || password !== '') {
        throw new Error("Preencha o espaço corretamente com uma senha")
    }

    return fetch(url + '/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });
}