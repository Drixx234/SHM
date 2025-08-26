import{
    AlertEsquina
}from "../Service/Alerts.js"

import{
    cargarProyectos
}from "../Service/ProyectosService.js"

import{
    getAllCoordinadores,
    findAllByNombre,
    findAllByProyecto,
    agregarAdministrador
}from "../Service/AdministradoresService.js"

localStorage.removeItem("IdCoordi");

const Coordi_Square = document.getElementById("Coordi_Square");
const Menu_Proyectos = document.getElementById("dropdown-Proyectos");
const btn_Reset = document.getElementById("btn-Reset");

const divs_cards = document.getElementById("divs_cards");
const PageableCenter = document.getElementById("PageableCenter");

const Array_BlockLetters = ["{", "}", "[", "]", "+", "=", "-", "_", "/", "?", ".", ",", "<", ">", ":", ";", "(", ")", "|", "*", "&", "^", "%", "$", "#", "@", ,"'", '"', "!", "~", "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

let Page = 0

Coordi_Square.addEventListener('keydown', (e) => {
    if (Array_BlockLetters.includes(e.key)) {
        e.preventDefault();
    }
});
Coordi_Square.addEventListener('blur', () =>{
    Coordi_Square.value = '';
    Page = 0;
    CargarTodosCoordinadores(Page);
});
Coordi_Square.addEventListener('input', async () => {
    if(Coordi_Square.value.length < 3){
        return;
    }else{
        let Name = Coordi_Square.value;
        await BuscarByNombre(Name);
    }
});
async function BuscarByNombre(nombre) {
    try{
        const res = await findAllByNombre(nombre, 0, 6);
        Llenar_Cards(res, false);
    }catch(err){
        console.error("Hubieron problemas cargando", err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡ERROR AL CARGAR DATOS!",
            html: "Hubieron problemas intentando buscar los coordinadores por nombre.",
        });
    }
}
async function BuscarPorProyecto(id) {
    try{
        const res = await findAllByProyecto(id, Page, 15);
        Llenar_Cards(res, true);
    }catch(err){
        console.log();
        AlertEsquina.fire({
            icon: "error",
            title: "¡ERROR AL CARGAR DATOS!",
            html: "Hubieron problemas intentando cargar los coordinadores.",
        });
    }
}
async function cargar_Proyectos() {
    try{
        const data = await cargarProyectos();
        return data;
    }catch(err){
        console.error("Hubieron problemas cargando", err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡ERROR AL CARGAR DATOS!",
            html: "Hubieron problemas intentando cargar la caja de proyecciones.",
        });
    }
}
async function Llenar_Box_Proyectos(){
    const proyectos = await cargar_Proyectos();
    Menu_Proyectos.innerHTML = '';
    proyectos.forEach((proyecto) => {
        Menu_Proyectos.innerHTML += `
            <li><button type="button" class="Item_Proyectos" onClick="BuscarPorProyecto('${proyecto.id}');">${proyecto.nombre}</button></li>
        `;
    });
}
async function CargarTodosCoordinadores(n) {
    try{
        const res = await getAllCoordinadores(n, 15);
        Llenar_Cards(res, true);
    }catch(err){
        console.log("No se pudo cargar", err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡ERROR AL CARGAR DATOS!",
            html: "Hubieron problemas intentando cargar los coordinadores.",
        });
    }
}
function Llenar_Cards(JSAdministradores, Paginacion){
    divs_cards.innerHTML = '';
    PageableCenter.innerHTML = '';

    const Administradores = JSAdministradores.content;
    let Color;

    Administradores.forEach(administrador => {
        divs_cards.innerHTML += `
                <div class="Cards" onclick="VerCoordinador('${administrador.id}')">
                    <div class="Cards_body">
                        <div style="display: flex; align-items: center;">
                            <img src="${administrador.foto_perfil}" class="card_img" alt="Imagen de Coordinador">
                        </div>
                        <hr class="Cards_hr">
                        <div class="card_info">
                            <h3>${administrador.nombre} ${administrador.apellido}</h3>
                            <h4>${administrador.correo_electronico}</h4>
                        </div>
                    </div>
                </div>
        `;
    });
    if(Paginacion){
        if(Administradores.length > 0 && Page > 0){
            PageableCenter.innerHTML = `
                    <button onclick="PaginaAnterior()">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-from-line-icon lucide-arrow-left-from-line"><path d="m9 6-6 6 6 6"/><path d="M3 12h14"/><path d="M21 19V5"/></svg>
                        Pagina Anterior...
                    </button>
                    <button onclick="SiguientePagina()">
                        Siguente Pagina...
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right-from-line-icon lucide-arrow-right-from-line"><path d="M3 5v14"/><path d="M21 12H7"/><path d="m15 18 6-6-6-6"/></svg>
                    </button>
            `;
        }else if(Administradores.length == 0 && Page > 0){
            PageableCenter.innerHTML = `
                    <button onclick="PaginaAnterior()">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-from-line-icon lucide-arrow-left-from-line"><path d="m9 6-6 6 6 6"/><path d="M3 12h14"/><path d="M21 19V5"/></svg>
                        Pagina Anterior...
                    </button> 
            `;
        }else if(Administradores.length == 0){
            PageableCenter.innerHTML = '';
            AlertEsquina.fire({
                icon: "error",
                title: "¡SIN RESULTADOS!",
                html: "No se encontro ningun resultado de coordinadores.",
            });
        }else{
            PageableCenter.innerHTML = `
                    <button onclick="SiguientePagina()">
                        Siguente Pagina...
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right-from-line-icon lucide-arrow-right-from-line"><path d="M3 5v14"/><path d="M21 12H7"/><path d="m15 18 6-6-6-6"/></svg>
                    </button>
            `;
        }
    }
}
function SiguientePagina(){
    Page++;
    CargarTodosCoordinadores(Page);
}
function PaginaAnterior(){
    Page--;
    CargarTodosCoordinadores(Page);
}
function VerCoordinador(id){
    console.log("La funcion llega");
    localStorage.setItem("IdCoordi", id);
    window.location.href = "Coordinador Profile - Admin.html";
}
function CargaInicialCoordis(){
    Llenar_Box_Proyectos();
    CargarTodosCoordinadores();
}
btn_Reset.addEventListener('click', () => {
    Page = 0;
    CargarTodosCoordinadores(Page);
});


window.SiguientePagina = SiguientePagina;
window.PaginaAnterior = PaginaAnterior;
window.VerCoordinador = VerCoordinador;
window.BuscarPorProyecto = BuscarPorProyecto;
window.addEventListener('DOMContentLoaded', CargaInicialCoordis);