const form = document.querySelector('form');
const userNameInput = document.querySelector("#username-user");
const userUsernameInput = document.querySelector("#id-user");
const userPasswordInput = document.querySelector("#pass-user");

import { register } from "./utils/user.util.js";

form.addEventListener('submit', event => {
    event.preventDefault();

    const user = {
        name: userNameInput.value.trim(),
        username: userUsernameInput.value.trim(),
        password: userPasswordInput.value.trim()
    }

    if (user.name === '' || user.username === '' || user.password === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    } else {
        (async () => {
            const result = await register(user);
            console.log(result);
        })();
    }
});