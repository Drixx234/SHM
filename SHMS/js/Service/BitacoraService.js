const API_URL_Bitacora = "http://localhost:8080/apiMovimientos";

export async function GetAllMovimientos(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Bitacora}/getAllPage?page=${page}&size=${size}`);
    return res.json();
}

export async function buscarMovimiento(id) {
    const res = await fetch(`${API_URL_Bitacora}/getById/${id}`);
    return res.json();
}

export async function agregarABitacora(data) {
    await fetch(`${API_URL_Bitacora}/postMovimiento`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}