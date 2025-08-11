import { request } from "../helpers/api-request.helper.js";

export default async function getNameUser() {
    const response = await request('/session-info');

    return response.name;
}