async function request(endpoint, method = 'GET', body) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    };

    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`/api/${endpoint}`, options);
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
}

export { request };