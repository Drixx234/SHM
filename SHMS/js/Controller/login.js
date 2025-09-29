import{
    AlertEsquina
}from "../Service/Alerts.js"

import{
    LogInAdministradores
}from "../Service/AuthService.js"

window.addEventListener('DOMContentLoaded', () => {
    
    localStorage.clear();
    sessionStorage.clear();
    
    const email_Box = document.getElementById('email');
    const password_Box = document.getElementById('password');
    const formLogIn = document.getElementById('loginForm');
    const login_btn = document.getElementById('login-btn');

    async function Buscar_Administrador(json) {
        try{
            const res = await LogInAdministradores(json);
            const textResponse = await res.json();
            if(textResponse.result == "Inicio de sesion exitoso"){
                localStorage.setItem("id_admin", textResponse.id);
                return true;
            }else{
                if(textResponse.result == "Credenciales incorrectas"){
                }else{
                }
                return false;
            }
        } catch(err){
            console.error('Hubo problemas buscando el usuario', err);
            AlertEsquina.fire({
                icon: "error",
                title: "¡NO SE PUDO CARGAR!",
                html: "Hubo un problema con la conexion, no se pudieron corroborar los datos.",
            });
            throw err;
        }
    }

    formLogIn.addEventListener('submit', async function(e) {
        e.preventDefault();
        login_btn.disabled = true;

        const email = email_Box.value;
        const password = password_Box.value;
        const json = {
            "correo": email,
            "contrasenia": password,
            "id_rol": 1
        }

        console.log(json);

        const Admin = await Buscar_Administrador(json);
        
        if (Admin) {
            AlertEsquina.fire({
                icon: "success",
                title: "¡USUARIO CORRECTO!",
                html: "Bienvenido! Abriendo Dashboard!",
                willClose: () => {
                    location.replace("Dashboard - Admin.html");
                }
            });
        }else{
            AlertEsquina.fire({
                    icon: "error",
                    title: "¡CREDENCIALES INCORRECTAS!",
                    html: "No se encontro ningun usuario de Administrador. Intentalo con otra información.",
                    willClose: () => {
                        email_Box.value = '';
                        password_Box.value = '';
                        login_btn.disabled = false;
                    }
                });
        }
    });
});