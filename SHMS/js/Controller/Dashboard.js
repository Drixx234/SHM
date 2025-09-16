import{
    obtenerRecientes
} from "../Service/EventosService.js"

import{
    AlertEsquina
} from "../Service/Alerts.js"

import{
    GetAllMovimientos
} from "../Service/BitacoraService.js"

const noti_Body = document.getElementById("Notifi-Body");
const Events_Body = document.getElementById("Events-Body");

async function CargarNoti() {
    try{
        const data = await GetAllMovimientos(0, 5);
        return data;
    } catch(err){
        AlertEsquina.fire({
            icon: "error",
            title: "¡NO SE PUDO CARGAR!",
            html: "Hubieron problemas en la conexion, por lo que no se pudieron cargar las notificaciones.",
        });
        throw err;
    }
}

async function CargarEventos() {
    try{
        const data = await obtenerRecientes(0, 5);
        return data;
    }catch(err){
        AlertEsquina.fire({
            icon: "error",
            title: "¡NO SE PUDO CARGAR!",
            html: "Hubieron problemas en la conexion, por lo que no se pudieron obtener los eventos.",
        });
        throw err;
    }
}

async function RellenarCuadroNotis(){
    const response = await CargarNoti();
    const notis = response.content;
        
    if (!notis || !Array.isArray(notis)) {
        console.error("No hay notificaciones para mostrar");
        AlertEsquina.fire({
            icon: "info",
            title: "¡NO HAY NINGUNA NOTIFICACION!",
            html: "No se econtro ninguna notificacion por mostrar."
        });
        return;
    }

    noti_Body.innerHTML = ` `;
    notis.forEach(Noti => {
        noti_Body.innerHTML += `
        <div class="cards" onclick="VerMovimiento('${Noti.id}')">
            <div class="card-header">   
                <span class="card-name">${Noti.correo}</span>
                <span class="card-date"><li>${Noti.fecha_hora_bitacora}</li></span>
            </div>
            <hr>
            <p class="card-info" id="card-info">${Noti.descripcion}</p>
        </div>
        `;
    })
}

async function RellenarCuadroEvents(){
    const response = await CargarEventos();
    const events = response.content;

    if (!events || !Array.isArray(events)) {
        console.error("No hay eventos para mostrar");
        AlertEsquina.fire({
            icon: "info",
            title: "¡NO HAY NINGUN EVENTO!",
            html: "No se econtro ningun evento por mostrar.",
        });
        return;
    }

    Events_Body.innerHTML = ` `;
    events.forEach(evento => {
        Events_Body.innerHTML += `
        <div class="cards">
            <div class="card-header">
                <span class="card-name">${evento.nombre_proyecto}</span>
                <span class="card-date"><li>${evento.fecha_hora_actividad}</li></span>
            </div>
            <hr>
            <p class="card-info" id="card-info">${evento.descripcion}</p>
        </div>
        `;
    })
}

async function CargaInicialDash(){
    await RellenarCuadroEvents();
    await RellenarCuadroNotis();
}

window.addEventListener('DOMContentLoaded', CargaInicialDash);