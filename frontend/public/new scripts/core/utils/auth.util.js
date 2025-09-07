import { request } from "../helpers/request.helper";

export const AuthAPI = {
    register: user => request('auth/register', 'POST', user),
    login: user => request('auth/login', 'POST', user),
    logout: () => request('auth/logout'),
    checkAuth: () => request('auth/auth-check')
};