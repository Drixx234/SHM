import{
    AlertEsquina
}from "../Service/Alerts.js"

import{
    cargarProyectos
}from "../Service/ProyectosService.js"

import{
    listarRoles
}from "../Service/RolesService.js"

import{
    agregarUsuario,
    buscarElUsuario
}from "../Service/UsuariosService.js"

import{
    uploadImageToFolder
}from "../Service/CloudinaryService.js"

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
const btnPlus = document.getElementById("btnPlus");
const NewPerfilFoto = document.getElementById("NewPerfilFoto");
const ImagePreview = document.getElementById("ImagePreview");
const NewName = document.getElementById("NewName");
const NewApellido = document.getElementById("NewApellido");
const NewCorreo = document.getElementById("NewCorreo");
const NewPassword = document.getElementById("NewPassword");
const NewConfirm = document.getElementById("NewConfirm");
const RolAdmin = document.getElementById("RolAdmin");
const ProyectoAdmin = document.getElementById("ProyectoAdmin");

const divs_cards = document.getElementById("divs_cards");
const PageableCenter = document.getElementById("PageableCenter");
const ModalNew = document.getElementById("ModalNew");
const Modal_New = new bootstrap.Modal(ModalNew);

const Array_AllowLetters = [
  "A","B","C","D","E","F","G","H","I","J","K","L","M",
  "N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
  "a","b","c","d","e","f","g","h","i","j","k","l","m",
  "n","o","p","q","r","s","t","u","v","w","x","y","z"
];

let Page = 0

NewPerfilFoto.addEventListener("change", () => {
    const file = NewPerfilFoto.files?.[0];
    if(file){
        const reader = new FileReader();
        reader.onload = () => (ImagePreview.src = reader.result);
        reader.readAsDataURL(file);
    } else {
        NewPerfilFoto.value = "";
    }
});
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

    ProyectoAdmin.innerHTML = '';
    const opt = document.createElement("option");
    opt.value = "";
    opt.disabled = true;
    opt.selected = true;
    opt.hidden = true;
    opt.textContent = "Seleccione...";
    ProyectoAdmin.appendChild(opt);

    proyectos.forEach(proyecto => {
        const opt = document.createElement("option");
        opt.value = proyecto.id;
        opt.textContent = `${proyecto.nombre}`;
        opt.title = `${proyecto.concepto}`
        ProyectoAdmin.appendChild(opt);
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
                <div class="coordinator-card" onclick="VerCoordinador('${administrador.id}')">
                    <div class="Cards_body">
                        <div class="coordinator-header">
                            <img src="${administrador.foto_perfil}" class="coordinator-image" alt="Imagen de Coordinador">
                        </div>
                        <div class="coordinator-details">
                            <h3 class="coordinator-detail">${administrador.nombre} ${administrador.apellido}</h3>
                            <h4 class="coordinator-detail">${administrador.correo_electronico}</h4>
                        </div>
                    </div>
                </div>
        `;
    });
    if(Paginacion){
        if(Administradores.length > 0 && Page > 0){
            PageableCenter.innerHTML = `
                    <button class="page-btn" onclick="PaginaAnterior()">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-from-line-icon lucide-arrow-left-from-line"><path d="m9 6-6 6 6 6"/><path d="M3 12h14"/><path d="M21 19V5"/></svg>
                        Pagina Anterior...
                    </button>
                    <button class="page-btn" onclick="SiguientePagina()">
                        Siguente Pagina...
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right-from-line-icon lucide-arrow-right-from-line"><path d="M3 5v14"/><path d="M21 12H7"/><path d="m15 18 6-6-6-6"/></svg>
                    </button>
            `;
        }else if(Administradores.length == 0 && Page > 0){
            PageableCenter.innerHTML = `
                    <button class="page-btn" onclick="PaginaAnterior()">
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
                    <button class="page-btn" onclick="SiguientePagina()">
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
    localStorage.setItem("IdCoordi", id);
    window.location.href = "Coordinador Profile - Admin.html";
}
function CargaInicialCoordis(){
    Llenar_Box_Proyectos();
    CargarTodosCoordinadores();
    CargarRolesAdmin();
}
btn_Reset.addEventListener('click', () => {
    Page = 0;
    CargarTodosCoordinadores(Page);
});
async function CargarRolesAdmin() {
    try {
        const roles = await listarRoles();
        Llenar_Box_Roles(roles);
    }catch(err){
        console.log("Hubieron problemas cargando", err);
    }
}
function Llenar_Box_Roles(roles){
    RolAdmin.innerHTML = '';
    const opt = document.createElement("option");
    opt.value = "";
    opt.disabled = true;
    opt.selected = true;
    opt.hidden = true;
    opt.textContent = "Seleccione...";
    RolAdmin.appendChild(opt);

    roles.forEach(rol => {
        if(rol.idRol != 3){
            const opt = document.createElement("option");
            opt.value = rol.idRol;
            opt.textContent = `${rol.nombreRol}`;
            RolAdmin.appendChild(opt);
        }
    });
}
function ValidarCampos(){
    if(RolAdmin.value == 2 && ProyectoAdmin.value == null){
        AlertEsquina.fire({
            icon: "error",
            title: "¡PROYECTO FALTANTE!",
            html: "No puede dejar a un coordinador sin proyecto.",
        });
    }
    if(NewPassword.value !== NewConfirm.value){
        AlertEsquina.fire({
            icon: "error",
            title: "¡CONFIRMACION INCORRECTA!",
            html: "Confirmacion contraseña incorrecta.",
        });
    }
}
btnPlus.addEventListener('click', () => {
    Modal_New.show();
});
function LimpiarFormulario(){
    NewName.value = '';
    NewApellido.value = '';
    NewCorreo.value = '';
    NewPassword.value = '';
    NewConfirm.value = '';
    NewPerfilFoto.value = '';
    ImagePreview.src = '';
}
ModalNew.addEventListener('submit', async (e) => {
    e.preventDefault();
    ValidarCampos;

    const post_name = NewName.value;
    const post_apellido = NewApellido.value;
    const post_correo = NewCorreo.value;
    const post_password = NewPassword.value;
    const post_rol = RolAdmin.value;
    let idUsuario;
    let post_id_proyecto;
    if(ProyectoAdmin.value != ''){
            post_id_proyecto = null
    }else{
        post_id_proyecto = ProyectoAdmin.value;
    }

    let UpdatedFoto;
    const file = NewPerfilFoto?.files?.[0];
    if(file){
        try{
            const response = await uploadImageToFolder(file, "Foto_Perfil_Coordinador");
            if(response && response.data) {
                UpdatedFoto = response.data;
            } else {
                AlertEsquina.fire({
                    icon: "error",
                    title: "¡ERROR AL SUBIR LA FOTO!",
                    html: "Hubieron problemas intentando subir la foto de perfil a la nube.", 
                });
                return;
            }
        }catch(err){
            console.error("Error al subir imagen", err);
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR AL SUBIR LA FOTO!",
                html: "Hubieron problemas intentando subir la foto de perfil a la nube.", 
            });
            return;
        }
    }

    try{
        const jsonU = {
            "correo": `${post_correo}`,
            "contrasenia": `${post_password}`,
            "id_rol": post_rol
        }
        const res = await agregarUsuario(jsonU);
        console.log(res);
        if(res.ok){
            const res = await buscarElUsuario(post_correo, post_password);
            idUsuario = res.id;
        }else{
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR AL CREAR USUARIO!",
                html: "Hubieron problemas con la conexion, no se pudo crear usuario.", 
            });
            return;
        }
    }catch(err){
        console.error("Error creando", err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡ERROR AL CREAR USUARIO!",
            html: "Hubieron problemas con la conexion, no se pudo crear usuario.", 
        });
        return;
    }

    const jsonA = {
        "nombre": `${post_name}`,
        "apellido": `${post_apellido}`,
        "foto_perfil": `${UpdatedFoto}`,
        "idUsuario": idUsuario,
        "id_proyecto": post_id_proyecto,
        "estado_admin": true
    }

    try{
        const res = await agregarAdministrador(jsonA);
        if(res.ok){
            AlertEsquina.fire({
                icon: "success",
                title: "¡USUARIO CREADO CORRECTAMENTE!",
                html: "No hubo problemas creando el usuario.", 
            });
        }else{
            AlertEsquina.fire({
                icon: "error",
                title: "¡USUARIO NO CREADO CORRECTAMENTE!",
                html: "Hubieron problemas creando el usuario.", 
            });
        }
    }catch(err){
        console.error("Hubieron problemas insertando Administrador", err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡USUARIO NO CREADO CORRECTAMENTE!",
            html: "Hubieron problemas creando el usuario.", 
        });
    }

    LimpiarFormulario();
    Page = 0;
    Modal_New.hide();
    CargarTodosCoordinadores(Page);
});

window.SiguientePagina = SiguientePagina;
window.PaginaAnterior = PaginaAnterior;
window.VerCoordinador = VerCoordinador;
window.BuscarPorProyecto = BuscarPorProyecto;
window.addEventListener('DOMContentLoaded', CargaInicialCoordis);