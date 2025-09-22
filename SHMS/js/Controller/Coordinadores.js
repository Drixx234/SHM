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
    comprobarUsuario,
    borrarUsuario
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
const NewButton = document.getElementById("NewButton");
const Modal_New = new bootstrap.Modal(ModalNew);

const Array_AllowLetters = [
  "A","B","C","D","E","F","G","H","I","J","K","L","M",
  "N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
  "a","b","c","d","e","f","g","h","i","j","k","l","m",
  "n","o","p","q","r","s","t","u","v","w","x","y","z", ' ', 'Del', 'Delete', 'Backspace'
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
    if (!Array_AllowLetters.includes(e.key)) {
        e.preventDefault();
    }
});
Coordi_Square.addEventListener('blur', async () =>{
    setTimeout(() => {
        Coordi_Square.value = '';
        Page = 0;
        CargarTodosCoordinadores(Page);
    }, 1000);
});
Coordi_Square.addEventListener('input', async () => {
    if(Coordi_Square.value.length < 3){
        return;
    }else{
        let Name = Coordi_Square.value.trim();
        await BuscarByNombre(Name);
    }
});
async function BuscarByNombre(nombre) {
    try{
        const res = await findAllByNombre(nombre, 0, 6);
        Llenar_Cards(res, false);
    }catch(err){
        console.error("Hubo problemas cargando", err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡ERROR AL CARGAR DATOS!",
            html: "Hubo problemas intentando buscar los coordinadores por nombre.",
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
            html: "Hubo problemas intentando cargar los coordinadores.",
        });
    }
}
async function cargar_Proyectos() {
    try{
        const data = await cargarProyectos();
        console.log(data);
        return data;
    }catch(err){
        console.error("Hubo problemas cargando", err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡ERROR AL CARGAR DATOS!",
            html: "Hubo problemas intentando cargar la caja de proyecciones.",
        });
    }
}
async function Llenar_Box_Proyectos(){
    const proyectos = await cargar_Proyectos();
    
    Menu_Proyectos.innerHTML = '';

    ProyectoAdmin.innerHTML = '';
    const opt = document.createElement("option");
    opt.value = "";
    opt.disabled = true;
    opt.selected = true;
    opt.hidden = true;
    opt.textContent = "Seleccione...";
    ProyectoAdmin.appendChild(opt);

    proyectos.forEach(proyecto => {
        Menu_Proyectos.innerHTML += `
            <li><button type="button" class="dropdown-item" onClick="BuscarPorProyecto('${proyecto.id}');">${proyecto.nombre}</button></li>
        `;

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
    const idAdmin = localStorage.getItem("id_admin");
    if(id == idAdmin){
        window.location.href = "Profile - Admin.html";    
    }else{
        localStorage.setItem("IdCoordi", id);
        window.location.href = "Coordinador Profile - Admin.html";
    }
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
    if(!(NewCorreo.value.trim().endsWith('@ricaldone.edu.sv'))){
        AlertEsquina.fire({
            icon: "error",
            title: "¡CORREO RECHAZADO!",
            html: "El correo al que se ancle la cuenta debe ser institucional.",
            willClose: () => {
                NewButton.disabled = false;
            }
        });
        return false;
    }
    if(RolAdmin.value == 2 && ProyectoAdmin.value == ''){
        AlertEsquina.fire({
            icon: "error",
            title: "¡PROYECTO FALTANTE!",
            html: "No puede dejar a un coordinador sin proyecto.",
            willClose: () => {
                NewButton.disabled = false;
            }
        });
        return false;
    }
    if(NewPassword.value !== NewConfirm.value){
        AlertEsquina.fire({
            icon: "error",
            title: "¡CONFIRMACION INCORRECTA!",
            html: "Confirmacion contraseña incorrecta.",
            willClose: () => {
                NewButton.disabled = false;
            }
        });
        return false;
    }
    return true;
}
btnPlus.addEventListener('click', () => {
    LimpiarFormulario();
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
    NewButton.disabled = false;
}
ModalNew.addEventListener('submit', async (e) => {
    e.preventDefault();
    NewButton.disabled = true;
    const valid = await ValidarCampos();
    if(!valid){
        return;
    }

    const post_name = NewName.value.trim();
    const post_apellido = NewApellido.value.trim();
    const post_correo = NewCorreo.value.trim();
    const post_password = NewPassword.value.trim();
    const post_rol = RolAdmin.value;
    const post_id_proyecto = ProyectoAdmin.value;
    let idUsuario;

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
                    html: "Hubo problemas intentando subir la foto de perfil a la nube.",
                    willClose: () => {
                        NewButton.disabled = false;
                    }
                });
                return;
            }
        }catch(err){
            console.error("Error al subir imagen", err);
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR AL SUBIR LA FOTO!",
                html: "Hubo problemas intentando subir la foto de perfil a la nube.",
                willClose: () => {
                    NewButton.disabled = false;
                }
            });
            return;
        }
    }

    try{
        const com = await comprobarUsuario(post_correo);
        const resul = await com.message;
        if(resul == "Usuario existente"){
            AlertEsquina.fire({
                icon: "error",
                title: "¡USUARIO YA EXISTENTE!",
                html: "El correo ingresado ya existe y no se puede atribuir a otro usuario.",
                willClose: () => {
                    NewCorreo.value = '';
                    NewPassword.value = '';
                    NewConfirm.value = '';
                    NewButton.disabled = false;
                }
            });
            return;
        }

        const jsonU = {
            "correo": post_correo,
            "contrasenia": post_password,
            "id_rol": post_rol
        }
        const res = await agregarUsuario(jsonU);
        if(res.ok){
            const us = await res.json();
            idUsuario = us.data.id;
        }else{
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR AL CREAR USUARIO!",
                html: "Hubo problemas intentando crear el usuario.", 
                willClose: () => {
                    NewButton.disabled = false;
                }
            });
            return;
        }
    }catch(err){
        console.error("Error creando", err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡ERROR AL CREAR USUARIO!",
            html: "Hubo problemas con la conexion, no se pudo crear usuario.", 
            willClose: () => {
                NewButton.disabled = false;
            }
        });
        return;
    }

    const jsonA = {
        "nombre": post_name,
        "apellido": post_apellido,
        "foto_perfil": UpdatedFoto,
        "idUsuario": idUsuario,
        "id_proyecto": post_id_proyecto,
        "estado_admin": true
    }

    try{
        const res = await agregarAdministrador(jsonA);
        if(res.ok){
            const data = res.json();
            console.log(data.data);
            AlertEsquina.fire({
                icon: "success",
                title: "¡USUARIO CREADO CORRECTAMENTE!",
                html: "No hubo problemas creando el usuario.",
                willClose: () => {
                    LimpiarFormulario();
                    Page = 0;
                    Modal_New.hide();
                    CargarTodosCoordinadores(Page);
                }
            });
        }else{
            AlertEsquina.fire({
                icon: "error",
                title: "¡USUARIO NO CREADO CORRECTAMENTE!",
                html: "Hubo problemas creando el usuario.", 
                willClose: () => {
                    NewButton.disabled = false;
                }
            });
            return;
        }
    }catch(err){
        console.error("Hubo problemas insertando Administrador", err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡PROBLEMAS DE CONEXION!",
            html: "Hubo problemas con la conexion al intentar crear un nuevo usuario.", 
            willClose: () => {
                NewButton.disabled = false;
            }
        });
        return;
    }
});

window.SiguientePagina = SiguientePagina;
window.PaginaAnterior = PaginaAnterior;
window.VerCoordinador = VerCoordinador;
window.BuscarPorProyecto = BuscarPorProyecto;
window.addEventListener('DOMContentLoaded', CargaInicialCoordis);