import{
    AlertEsquina
}from "../Service/Alerts.js"

import{
    buscarAdministrador,
    DeshabilitarAdmin
}from "../Service/AdministradoresService.js"

const idCoordinador = document.getElementById("idCoordinador");
const idUsuario = document.getElementById("idUsuario");
const idProyecto = document.getElementById("idProyecto");
const NombreCoordi = document.getElementById("NombreCoordi");
const ApellidoCoordi = document.getElementById("ApellidoCoordi");
const CorreoCoordi = document.getElementById("CorreoCoordi");
const RolCoordi = document.getElementById("RolCoordi");
const ProyectoCoordi = document.getElementById("ProyectoCoordi");
const Foto_Perfil = document.getElementById("Foto_Perfil");
const btnDisabled = document.getElementById("btnDisabled");
const btnBack = document.getElementById("btnBack");

async function BuscarCoordi(adminId) {
    try{
        const data = buscarAdministrador(adminId);
        return data;
    }catch(err){
        console.error('Error al cargar datos' , err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡ERROR AL CARGAR DATOS!",
            html: "Hubieron problemas al cargar la informacion del perfil.",
        });
        btnDisabled.disabled = true;
    }
}

btnDisabled.addEventListener('click', async (e) => {
    e.preventDefault;
    const idCoordi = idCoordinador.value;
    const respuesta = await DeshabilitarAdmin(idCoordi);
    if(respuesta.status = "suCcess"){
        AlertEsquina.fire({
            icon: "success",
            title: "¡COORDINADOR DESHABILITADO!",
            html: "El coordinador se deshabilito con exito.",
            willClose: () => {
                location.replace("Coordinadores - Admin.html");
            }
        });
    }else if(respuesta.status = "failed"){
        AlertEsquina.fire({
            icon: "error",
            title: "¡OPERACION FALLIDA!",
            html: "El coordinador no pudo ser deshabilitado.",
        });
        return;
    }else{
        AlertEsquina.fire({
            icon: "error",
            title: "¡OPERACION NO REALIZADA!",
            html: "Hubieron problemas con la conexion, por lo que no se pudo realizar la operacion.",
        });
        return;
    }
});

async function RellenarInfoCoordi(){
    const IdCoordi = localStorage.getItem("IdCoordi");
    const Coordi = await BuscarCoordi(IdCoordi);

    idCoordinador.value = Coordi.id;
    idUsuario.value = Coordi.idUsuario;
    if(Coordi.id_proyecto == null){
        idProyecto.value = "";
        ProyectoCoordi.value = 'No hay ningun proyecto asignado';
    }else{
        idProyecto.value = Coordi.id_proyecto;
        ProyectoCoordi.value = Coordi.nombre_Proyecto;
    }
    NombreCoordi.value = Coordi.nombre;
    ApellidoCoordi.value = Coordi.apellido;
    CorreoCoordi.value = Coordi.correo_electronico;
    RolCoordi.value = Coordi.rol;
    Foto_Perfil.src = Coordi.foto_perfil;
}

btnBack.addEventListener('click', () => {
    localStorage.removeItem("IdCoordi");
    location.replace("Coordinadores - Admin.html");
});

window.addEventListener('DOMContentLoaded', () => {
    RellenarInfoCoordi();
});