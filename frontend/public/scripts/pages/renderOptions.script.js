import { departments, problems } from "../main.js";

const selectElementDepartments = document.querySelector("#department-user");
const selectElementProblems = document.querySelector("#category-problem");

document.addEventListener('DOMContentLoaded', () => {
    const defaultOption = document.createElement('option');
    defaultOption.value = 'none';

    for (const [key, value] of Object.entries(departments)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = value;
        selectElementDepartments.appendChild(option);
    }
});