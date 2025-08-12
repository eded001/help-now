import { departments } from "../main.js";

const selectElement = document.querySelector("#department-user");

document.addEventListener('DOMContentLoaded', () => {
    const defaultOption = document.createElement('option');
    defaultOption.value = 'none';

    for (const [key, value] of Object.entries(departments)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = value;
        selectElement.appendChild(option);
    }
});