function register({ name, username, password, department }) {
    return fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, name, password, department })
    });
}

function login({ username, password }) {
    return fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
}

async function logout() {
    return await fetch('/api/users/logout', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

async function checkAuth() {
    return await fetch('/api/users/auth-check');
}

export { register, login, checkAuth, logout };