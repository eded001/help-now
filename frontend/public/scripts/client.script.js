import { startSession } from "./ws.client.js";

// utils e helpers
import { getUserInfos } from "./utils/sessionInfo.util.js";
import { populateSelect } from "./utils/dom.util.js";

// constants
import { elements } from "./constants/elements.constant.js";
import { problems } from "./constants/main.constant.js";

window.addEventListener("DOMContentLoaded", async () => {
    const nameUserSpan = document.querySelector("#name-user");

    const { name } = await getUserInfos();
    nameUserSpan.textContent = name;

    populateSelect(elements.problemCategorySelect, problems);

    startSession();
});