import{
    obtenerRecientes
} from "../Service/EventosService.js"

import{
    AlertEsquina
} from "../Service/Alerts.js"

    const noti_Body = document.getElementById("Notifi-Body");
    const Events_Body = document.getElementById("Events-Body");

    // async function CargarNoti() {
    //     try{
    //         const data = await obtenerEventos;
    //         RellenarCuadro(data);
    //     } catch(err){
    //         console.error('Error al cargar datos' , err);
    //         AlertEsquina.fire({
    //             icon: "error",
    //             title: "¡NO SE PUDO CARGAR!",
    //             html: "Hubieron problemas al cargar las notificaciones.",
    //             up: "10px",
    //         });
    //     }
    // }
    async function CargarEventos() {
        try{
            const data = obtenerRecientes(0, 5);
            return data;
        }catch(err){
            console.error('Error al cargar datos', err);
            AlertEsquina.fire({
                icon: "error",
                title: "¡NO SE PUDO CARGAR!",
                html: "Hubieron problemas al cargar los eventos.",
            });
        }
    }
    // function RellenarCuadroNotis(Notis){
    //     noti_Body.innerHTML = ` `;

    //     const NotisRecent = Notis.reverse().slice(0, 5);
        
    //     NotisRecent.forEach(Noti => {
    //         noti_Body.innerHTML += `
    //         <div class="cards">
    //             <div class="card-header">   
    //                 <span class="card-name">${Noti.nameNoti}</span>
    //                 <span class="card-date"><li>${Noti.dateNoti}</li></span>
    //             </div>
    //             <hr>
    //             <p class="card-info" id="card-info">${Noti.bodyNoti}</p>
    //         </div>
    //         `;
    //         })
    // }
    async function RellenarCuadroEvents(){
        Events_Body.innerHTML = ` `;
        let response = await CargarEventos();
        let events = response.content;

        if (!events || !Array.isArray(events)) {
            console.error("No hay eventos para mostrar");
            AlertEsquina.fire({
                icon: "info",
                title: "¡NO HAY NINGUN EVENTO!",
                html: "No se econtro ningun evento por mostrar.",
            });
            return;
        }
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

    function CargaInicialDash(){
        RellenarCuadroEvents();
    }

window.addEventListener('DOMContentLoaded', CargaInicialDash);