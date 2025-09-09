import{
    AlertEsquina
}from "../Service/Alerts.js"

import{
    LogInAdministradores
}from "../Service/AuthService.js"

window.addEventListener('DOMContentLoaded', () => {
    
    localStorage.removeItem("id_admin");
    
    const email_Box = document.getElementById('email');
    const password_Box = document.getElementById('password');
    const formLogIn = document.getElementById('loginForm');

    async function Buscar_Administrador(json) {
        try{
            const data = await LogInAdministradores(json);
            if(data.ok){
                 
            }else{
                AlertEsquina.fire({
                    icon: "error",
                    title: "¡USUARIO NO ENCONTRADO!",
                    html: "No se encontro ningun resultado o no corresponde a un usuario de Administrador. Intentalo con otra información.",
                    willClose: () => {
                        email_Box.value = '';
                        password_Box.value = '';
                    }
                });
                return;
            }
        } catch(err){
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
        const email = email_Box.value;
        const password = password_Box.value;
        const json = {
            "correo": email,
            "contrasenia": password,
            "id_rol": 1
        }

        await Buscar_Administrador(json);
            
        if (Admin) {
            AlertEsquina.fire({
                icon: "error",
                title: "¡USUARIO NO ENCONTRADO!",
                html: "No se encontro ningun resultado o no corresponde a un usuario de Administrador. Intentalo con otra información.",
                willClose: () => {
                    email_Box.value = '';
                    password_Box.value = '';
                }
            });
            return;
        }

        if(Admin.contrasenia == password){
            AlertEsquina.fire({
                icon: "success",
                title: "¡USUARIO CORRECTO!",
                html: "Bienvenido! Abriendo Dashboard!",
                willClose: () => {
                    localStorage.setItem("id_admin", Admin.id);
                    window.location.href = "Dashboard - Admin.html";
                }
            });
        }else{
            AlertEsquina.fire({
                icon: "error",
                title: "¡CONTRASEÑA INCORRECTA!",
                html: "La contraseña no se coincide con ningun usuario. Intentalo con otra información.",
                willClose: () => {
                    email_Box.value = '';
                    password_Box.value = '';
                }
            });
        }
    });
});