const API_URL_Generalidades = "http://localhost:8080/apiGeneralidades";

export async function obtenerLimiteHoras() {
    const res = await fetch(`${API_URL_Generalidades}/getLimiteHoras`, {
        credentials: "include"
    });
    return res.json();
}

export async function obtenerLogo() {
    const res = await fetch(`${API_URL_Generalidades}/getLogo`, {
        credentials: "include"
    });
    return res.json();
}

export async function ActualizarValores(id, valor) {
    return await fetch(`${API_URL_Generalidades}/ActualizarValor/${id}/${valor}`, {
        credentials: "include",
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'}
    });
}