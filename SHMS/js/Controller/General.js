import{
    buscarAdministrador
}from "../Service/AdministradoresService.js"

import{
    obtenerLimiteHoras,
    obtenerLogo
}from "../Service/GeneralidadesService.js"

import{
    me,
    LogOut
}from "../Service/AuthService.js"

import{
    AlertEsquina
}from "../Service/Alerts.js"

    const btn_Profile = document.getElementById("btnPerson");
    const btn_Menu = document.getElementById("btnMenu");
    const btnActive = document.getElementsByClassName("Active-Btn");
    const btnUnactive = document.getElementsByClassName("Unactive-Btn");
    const NavOptions = document.getElementById("Navbar_Options");
    const img_Logo = document.getElementById("img_Logo");

    async function CargarProfile(id) {
        try{
            const data = await buscarAdministrador(id);
            btn_Profile.title = `Perfil de ${data.nombre} ${data.apellido}`;
        } catch(err){
            console.error('Error al cargar datos' , err);
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR AL CARGAR DATOS!",
                html: "Hubieron problemas al cargar la informacion del perfil.",
            });
            btn_Profile.disabled = true;
        }
    }
    function ocultarBotones(botones) {
        for (let i = 0; i < botones.length; i++) {
            botones[i].hidden = true;
        }
    }
    function mostrarBotones(botones) {
        for (let i = 0; i < botones.length; i++) {
            botones[i].hidden = false;
        }
    }
    async function Guardar_Admin() {
        try{
            const res = await me();
            const auth = await res.json();

            if(auth.authenticated){
                const idAdmin = localStorage.getItem("id_admin");
                if (idAdmin) {
                    CargarProfile(idAdmin);
                } else {
                    const res = await LogOut();
                    if(res.ok){
                        location.replace("Index.html");
                    }else{
                        AlertEsquina.fire({
                            icon: "error",
                            title: "¡ERROR CON LA COOKIE!",
                            html: "Hubieron problemas al intentar eliminar el token de autenticacion."
                        });
                    }
                }
            }else{
                const res = await LogOut();
                if(res.ok){
                    location.replace("Index.html");
                }else{
                    AlertEsquina.fire({
                        icon: "error",
                        title: "¡ERROR CON LA COOKIE!",
                        html: "Hubieron problemas al intentar eliminar el token de autenticacion."
                    });
                }
            }
        }catch(err){
            console.error("Error en la conexion", err);
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR CON LA CONEXION!",
                html: "Hubieron problemas al intentar comprobar la sesion iniciada.",
                willClose: () => {
                    location.replace("Index.html");
                }
            });
        }
    }
    function VisibilidadBotones(){
            if(window.innerWidth <= 980){
            ocultarBotones(btnActive);
            ocultarBotones(btnUnactive);
            btn_Menu.hidden = false;
            NavOptions.hidden = true

        }else{
            mostrarBotones(btnActive);
            mostrarBotones(btnUnactive);
            btn_Menu.hidden = true;
            NavOptions.hidden = false;
        }
    }

    async function ObtenerLimitHoras() {
        try{
            const Limite = await obtenerLimiteHoras();
            return Limite.limiteHoras;
        }catch(err){
            console.error("Hubieron problemas cargando el limite de Horas Sociales");
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR AL CARGAR DATOS!",
                html: "Hubieron problemas al cargar el valor del limite de horas sociales.",
            });
        }
    }

    async function ObtenerLogo(){
        try{
            const Logo = await obtenerLogo();
            return Logo.LogoRical;
        }catch(err){
            console.error("Hubieron problemas cargando el logo del colegio");
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR AL CARGAR DATOS!",
                html: "Hubieron problemas al cargar la imagen del logo.",
            });
            return null;
        }
    }

    async function CargarLogo(){
        if(!img_Logo){
            return;
        }
        const VarLogoRicaldone = localStorage.getItem("LogoRicaldone");
        if(!VarLogoRicaldone){ 
            const Logo = await ObtenerLogo();
            localStorage.setItem("LogoRicaldone", Logo);
            img_Logo.src = Logo;
        }else{
            img_Logo.src = VarLogoRicaldone;
        }
    }

    async function CargarLimite() {
        const VarLimiteHoras = localStorage.getItem("LimiteHoras");
        if(!VarLimiteHoras){
            const Limite = await ObtenerLimitHoras();
            localStorage.setItem("LimiteHoras", Limite);
        }
    }

    function CargaInicialGeneral(){
        Guardar_Admin();
        VisibilidadBotones();
        CargarLogo();
        CargarLimite();
    }

window.addEventListener("resize", VisibilidadBotones);

window.addEventListener("DOMContentLoaded", CargaInicialGeneral);
