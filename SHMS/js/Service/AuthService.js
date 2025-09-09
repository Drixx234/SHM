const API_URL_AUTH = "http://localhost:8080/apiAuth";

export async function LogInAdministradores(data) {
    return await fetch(`${API_URL_AUTH}/LoginAdmin`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}