const API_URL_Generalidades = "http://localhost:8080/apiGeneralidades";

export async function obtenerLimiteHoras() {
    const res = await fetch(`${API_URL_Generalidades}/getLimiteHoras`);
    return res.json();
}

export async function obtenerLogo() {
    const res = await fetch(`${API_URL_Generalidades}/getLogo`);
    return res.json();
}

export async function ActualizarValores(id, valor) {
    return await fetch(`${API_URL_Generalidades}/ActualizarValor/${id}/${valor}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'}
    });
}