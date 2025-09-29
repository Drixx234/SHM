import{
    AlertEsquina
}from "../Service/Alerts.js"

import{
    nuevoProyecto,
    traerProyectosCompletos,
    buscarProyectoPorNombre
}from "../Service/ProyectosService.js"

import{
    uploadImageToFolder
}from "../Service/CloudinaryService.js"

const Proyecto_Square = document.getElementById("Proyecto_Square");
const divs_cards = document.getElementById("divs_cards");
const PageableCenter = document.getElementById("PageableCenter");

const btn_Agregar_Proyecto = document.getElementById("btn_Agregar_Proyecto");
const ModalNew = document.getElementById("ModalNew");
const DialogInsert = new bootstrap.Modal(ModalNew);

//Inputs del modal
const PostForm = document.getElementById("PostForm");
const NewLogo = document.getElementById("NewLogo");
const ImagePreviewLogo = document.getElementById("ImagePreviewLogo");
const NewMuestra = document.getElementById("NewMuestra");
const ImagePreviewMuestra = document.getElementById("ImagePreviewMuestra");
const NewName = document.getElementById("NewName");
const NewConcepto = document.getElementById("NewConcepto");
const NewCupos = document.getElementById("NewCupos");

const Array_AllowLetters = [
  "A","B","C","D","E","F","G","H","I","J","K","L","M",
  "N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
  "a","b","c","d","e","f","g","h","i","j","k","l","m",
  "n","o","p","q","r","s","t","u","v","w","x","y","z", ' ', 'Del', 'Delete', 'Backspace'
];

let Page = 0;

//Metodos de Service//
async function CrearProyecto(json) {
    try {
        const response = await nuevoProyecto(json);
        const res = await response.json();
        if(res.status == "success"){
            return true;
        }else{
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR EN EL SERVIDOR!",
                html: "Hubo problemas internos, por lo que no se pudo crear el proyecto.",
            });
            return false;
        }
    } catch (err) {
        console.error('Hubo problemas creando un nuevo proyecto', err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡CONEXION FALLIDA!",
            html: "Hubo problemas con la conexion, por lo que no se pudo crear el proyecto.",
        });
        return false;
    }
}
async function ConseguirPorNombre(nombre) {
    try {
        return await buscarProyectoPorNombre(nombre, 0, 15);
    } catch (err) {
        console.error('Hubo problemas consiguiendo los proyectos por el nombre', err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡CONEXION FALLIDA!",
            html: "Hubo problemas con la conexion, por lo que no se pudieron obtener los proyectos.",
        });
        return null;
    }
}
async function ConseguirTodosProyectos() {
    try {
        return await traerProyectosCompletos(Page, 15);
    } catch (err) {
        console.error('Hubo problemas consiguiendo los proyectos', err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡CONEXION FALLIDA!",
            html: "Hubo problemas con la conexion, por lo que no se pudieron obtener los proyectos.",
        });
        return null;
    }
}
async function SubirFoto(file) {
    try{
        const response = await uploadImageToFolder(file, "Foto_Proyectos");
        if(response && response.data) {
            return response.data;
        } else {
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR AL SUBIR LA FOTO!",
                html: "Hubo problemas intentando subir la foto a la nube.",
                willClose: () => {
                    PostForm.disabled = false;
                }
            });
            return null;
        }
    }catch(err){
        console.error("Error al subir imagen", err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡ERROR AL SUBIR LA FOTO!",
            html: "Hubo problemas intentando subir la foto a la nube.",
            willClose: () => {
                PostForm.disabled = false;
            }
        });
        return null;
    }
}

//Metodos de input de busqueda//
Proyecto_Square.addEventListener('keydown', (e) => {
    if (!Array_AllowLetters.includes(e.key)) {
        e.preventDefault();
    }
});
Proyecto_Square.addEventListener('blur', () =>{
    setTimeout(() => {
        Proyecto_Square.value = '';
        Page = 0;
        RellenarProyectos();
    }, 1000);
});
Proyecto_Square.addEventListener('input', async () => {
    if(Proyecto_Square.value.length < 8){
        return;
    }else{
        let Name = Proyecto_Square.value.trim();
        await BuscarByNombre(Name);
    }
});

//Metodos de los input de muestra e icono del Modal//
NewLogo.addEventListener("change", () => {
    const file = NewLogo.files?.[0];
    if(file){
        const reader = new FileReader();
        reader.onload = () => (ImagePreviewLogo.src = reader.result);
        reader.readAsDataURL(file);
    } else {
        NewLogo.value = "";
        ImagePreviewLogo.src = '';
    }
});
NewMuestra.addEventListener("change", () => {
    const file = NewMuestra.files?.[0];
    if(file){
        const reader = new FileReader();
        reader.onload = () => (ImagePreviewMuestra.src = reader.result);
        reader.readAsDataURL(file);
    } else {
        NewMuestra.value = "";
        ImagePreviewMuestra.src = '';
    }
});

//Metodos del html//
async function RellenarProyectos() {
    const ProyectosRe = await ConseguirTodosProyectos();
    if(ProyectosRe == null){
        AlertEsquina.fire({
            icon: "error",
            title: "¡CONEXION FALLIDA!",
            html: "Hubo problemas con la conexion, por lo que no se pudo obtener la informacion del proyecto.",
        });
        return;
    }
    
    const Proyectos = ProyectosRe.content;
    if(Proyectos.length == 0){
        AlertEsquina.fire({
            icon: "info",
            title: "¡SIN RESULTADOS!",
            html: "No hubo coincidencia de ningun proyecto.",
        });
        return;
    }else{
        let Color;
        let VigenciaP;

        divs_cards.innerHTML = '';
        Proyectos.forEach(Proyecto => {
            if(Proyecto.vigencia == false){
                Color = 'border-top: 4px solid var(--primary);';
                VigenciaP = 'Proyecto Desactivado';
            }else{
                Color = 'border-top: 4px solid var(--secondary);';
                VigenciaP = 'Proyecto Activo';
            }

            divs_cards.innerHTML += `
                <div class="proyecto-card" onclick="VerProyecto('${Proyecto.id}')" style="${Color}">
                    <div class="Cards_body">
                        <div class="proyecto-header">
                            <img src="${Proyecto.icono}" class="proyecto-image" alt="Imagen de Coordinador">
                        </div>
                        <div class="proyecto-details">
                            <h3 class="proyecto-detail">${Proyecto.nombre}</h3>
                            <h4 class="proyecto-detail">${VigenciaP}</h4>
                        </div>
                    </div>
                </div>
            `;
        });

        if(Proyectos.length == 15 && Page == 0){
            PageableCenter.innerHTML = `
                <button class="page-btn" onclick="SiguientePagina()">
                    Siguente Pagina...
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right-from-line-icon lucide-arrow-right-from-line"><path d="M3 5v14"/><path d="M21 12H7"/><path d="m15 18 6-6-6-6"/></svg>
                </button>
            `
        }else if(Proyectos.length < 15 && Page > 0){
            PageableCenter.innerHTML = `
                <button class="page-btn" onclick="PaginaAnterior()">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-from-line-icon lucide-arrow-left-from-line"><path d="m9 6-6 6 6 6"/><path d="M3 12h14"/><path d="M21 19V5"/></svg>
                    Pagina Anterior...
                </button>
            `
        }else if(Proyectos.length == 15 && Page > 0){
            PageableCenter.innerHTML = `
                <button class="page-btn" onclick="PaginaAnterior()">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-from-line-icon lucide-arrow-left-from-line"><path d="m9 6-6 6 6 6"/><path d="M3 12h14"/><path d="M21 19V5"/></svg>
                    Pagina Anterior...
                </button>
                <button class="page-btn" onclick="SiguientePagina()">
                    Siguente Pagina...
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right-from-line-icon lucide-arrow-right-from-line"><path d="M3 5v14"/><path d="M21 12H7"/><path d="m15 18 6-6-6-6"/></svg>
                </button>
            `
        }
    }
}
async function BuscarByNombre(nombre) {
    const ProyectosJS = await ConseguirPorNombre(nombre);
    
    if(ProyectosJS == null){
        AlertEsquina.fire({
            icon: "error",
            title: "¡CONEXION FALLIDA!",
            html: "Hubo problemas con la conexion, por lo que no se pudieron obtener los proyectos.",
        });
        return;
    }
    
    const Proyectos = ProyectosJS.content;
    if(Proyectos.length == 0){
        AlertEsquina.fire({
            icon: "info",
            title: "¡SIN RESULTADOS!",
            html: "No hubo coincidencia de ningun proyecto.",
        });
        return;
    }else{
        let Color;
        let VigenciaP;
        
        divs_cards.innerHTML = '';
        Proyectos.forEach(Proyecto => {
            if(Proyecto.vigencia == false){
                Color = 'border-top: 4px solid var(--primary);';
                VigenciaP = 'Proyecto Desactivado';
            }else{
                Color = 'border-top: 4px solid var(--secondary);';
                VigenciaP = 'Proyecto Activo';
            }

            divs_cards.innerHTML += `
                <div class="proyecto-card" onclick="VerProyecto('${Proyecto.id}')" style="${Color}">
                    <div class="Cards_body">
                        <div class="proyecto-header">
                            <img src="${Proyecto.icono}" class="proyecto-image" alt="Imagen de Coordinador">
                        </div>
                        <div class="proyecto-details">
                            <h3 class="proyecto-detail">${Proyecto.nombre}</h3>
                            <h4 class="proyecto-detail">${VigenciaP}</h4>
                        </div>
                    </div>
                </div>
            `;
        });
    }
}
function VerProyecto(id) {
    localStorage.setItem("IdProyecto", id);
    window.location.href = "Info Proyecto - Admin.html";
}
function SiguientePagina() {
    Page++;
    RellenarProyectos();
}
function PaginaAnterior() {
    Page--;
    RellenarProyectos();
}
btn_Agregar_Proyecto.addEventListener('click', () => {
    LimpiarFormulario();
    DialogInsert.show();
});

//Metodos del Modal//
function LimpiarFormulario(){
    NewLogo.value = '';
    ImagePreviewLogo.src = '';
    NewMuestra.value = '';
    ImagePreviewMuestra.src = '';
    NewName.value = '';
    NewConcepto.value = '';
    NewCupos.value = '';
    PostForm.disabled = false;
}
PostForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    PostForm.disabled = true;

    const NewNameValue = NewName.value.trim();
    const NewConceptoValue = NewConcepto.value.trim();
    const NewCuposValue = NewCupos.value.trim();
    let NewLogoValue;
    let NewMuestraValue;

    const fileLogo = NewLogo?.files?.[0];
    if(fileLogo){
        const value = await SubirFoto(fileLogo);
        if(value == null){
            return;
        }else{
            NewLogoValue = value;
        }
    }

    const fileMuestra = NewMuestra?.files?.[0];
    if(fileMuestra){
        const value = await SubirFoto(fileMuestra);
        if(value == null){
            return;
        }else{
            NewMuestraValue = value;
        }
    }

    const json = {
        "nombre": NewNameValue,
        "concepto" : NewConceptoValue,
        "cupos" : NewCuposValue,
        "icono": NewLogoValue,
        "img_muestra": NewMuestraValue,
        "vigencia": true
    }

    const res = await CrearProyecto(json);
    if(!res){
        PostForm.disabled = false;
        return;
    }else{
        AlertEsquina.fire({
            icon: "success",
            title: "¡PROYECTO CREADO!",
            html: "No hubo ningun problema creando el proyecto.",
            willClose: () => {
                LimpiarFormulario();
                DialogInsert.hide();
                RellenarProyectos();
            }
        });
    }
});

async function CargaInicialProyectos(){
    await RellenarProyectos();
}

window.VerProyecto = VerProyecto;
window.SiguientePagina = SiguientePagina;
window.PaginaAnterior = PaginaAnterior;
window.addEventListener('DOMContentLoaded', CargaInicialProyectos);