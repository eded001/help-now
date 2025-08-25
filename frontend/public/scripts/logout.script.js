import { logout } from "./utils/user.util.js";

const logoutIcon = document.querySelector('#logout');

logoutIcon.addEventListener('click', async () => {
    try {
    const response = await logout()

    if (!response.ok) {
        throw new Error('Erro ao fazer logout.');
    }

    window.location.href = '/login';

    } catch (error) {
        console.error(error);
        alert('Falha ao fazer logout. Tente novamente.');
    }
});