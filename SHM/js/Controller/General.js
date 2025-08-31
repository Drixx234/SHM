import{
    buscarAdministrador
}from "../Service/AdministradoresService.js"

import{
    AlertEsquina
}from "../Service/Alerts.js"

const btn_Profile = document.getElementById("btnPerson");
    const btn_Menu = document.getElementById("btnMenu");
    const dialog_profile = document.getElementById("Profile-content");
    const body = document.getElementById("Body");
    const btnActive = document.getElementsByClassName("Active-Btn");
    const btnUnactive = document.getElementsByClassName("Unactive-Btn");
    const NavOptions = document.getElementById("Navbar_Options");

    async function CargarProfile(id) {
        try{
            const data = await buscarAdministrador(id);
            RellenarProfile(data);
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
    function RellenarProfile(perfil){
        let Proyecto_Asignado;
        if(perfil.nombre_Proyecto){
            Proyecto_Asignado = perfil.nombre_Proyecto;
        }else{
            Proyecto_Asignado = 'No hay Proyecto Asignado';
        }
        btn_Profile.title = `Perfil de ${perfil.nombre} ${perfil.apellido}`;
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
    function Guardar_Admin() {
        const idAdmin = localStorage.getItem("id_admin");
        
        if (idAdmin) {
            CargarProfile(idAdmin);
        } else {
            window.location.href = "Index.html";
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

    function CargaInicialGeneral(){
        Guardar_Admin();
        VisibilidadBotones();
    }

window.addEventListener("resize", VisibilidadBotones);

window.addEventListener("DOMContentLoaded", CargaInicialGeneral);
