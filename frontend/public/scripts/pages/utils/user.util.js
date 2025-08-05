import { request } from "../helpers/api-request.helper.js";

async function register({ username, name, password }) {
    try {
        return await request('/users/register', 'POST', { username, name, password });
    } catch (error) {
        console.error('Erro no registro:', error);
        throw error;
    }
}

async function login({ username, password }) {
    try {
        return await request('/users/login', 'POST', { username, password });
    } catch (error) {
        console.error('Erro no login:', error);
        throw error;
    }
}

export { register, login };