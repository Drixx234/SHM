import{
    AlertEsquina
}from "../Service/Alerts.js"

import{
    buscarProyecto,
    actualizarProyecto,
    HabilitarProyecto,
    DeshabilitarProyecto
}from "../Service/ProyectosService.js"

import{
    uploadImageToFolder
}from "../Service/CloudinaryService.js"

import{
    EncontrarPorProyectos
}from "../Service/ServiciosVigentesService.js"

//Parametros de la informacion del proyecto
const idProyecto = document.getElementById("idProyecto");
const Icono_Proyecto = document.getElementById("Icono_Proyecto");
const Muestra_Proyecto = document.getElementById("Muestra_Proyecto");
const NombreProyecto = document.getElementById("NombreProyecto");
const ConceptoProyecto = document.getElementById("ConceptoProyecto");
const VigenciaProyecto = document.getElementById("VigenciaProyecto");
const CuposProyectos = document.getElementById("CuposProyectos");
const btnDeshabilitar = document.getElementById("btnDeshabilitar");
const btnHabilitar = document.getElementById("btnHabilitar");
const btnUpdate = document.getElementById("btnUpdate");
const btnBack = document.getElementById("btnBack");
const Cards_Estudiantes = document.getElementById("Cards_Estudiantes");
const PageableCenter = document.getElementById("PageableCenter");

//Elementos del modal para actualizar
const ModalUpdate = document.getElementById("ModalUpdate");
const Modal_Update = new bootstrap.Modal(ModalUpdate);
const PutForm = document.getElementById("PutForm");
const SubmitForm = document.getElementById("SubmitForm");
const UpdateLogo = document.getElementById("UpdateLogo");
const ImagePreviewLogo = document.getElementById("ImagePreviewLogo");
const UpdateMuestra = document.getElementById("UpdateMuestra");
const ImagePreviewMuestra = document.getElementById("ImagePreviewMuestra");
const UpdateName = document.getElementById("UpdateName");
const UpdateConcepto = document.getElementById("UpdateConcepto");
const UpdateCupos = document.getElementById("UpdateCupos");

let Page = 0;

//Funciones de Service
async function BuscarProyecto(id) {
    try {
        const res = await buscarProyecto(id);
        return res;
    } catch (err) {
        console.error('Hubo problemas consiguiendo la informacion del proyecto', err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡CONEXION FALLIDA!",
            html: "Hubo problemas con la conexion, por lo que no se pudo crear el proyecto.",
        });
    }    
}
async function BuscarLosEstudiantes(id) {
    try {
        const res = await EncontrarPorProyectos(id, Page, 10);
        const data = res.content;
        return data;
    } catch (err) {
        console.error('Hubo problemas cargando los servicios', err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡ERROR EN EL SERVIDOR!",
            html: "Hubo problemas internos, por lo que no se pudieron encontrar los estudiantes."
        });
    }
}
async function ModificarProyecto(id, json) {
    try {
        const response = await actualizarProyecto(id, json);
        const res = await response.json();
        if(res.status == "success"){
            return true;
        }else{
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR EN EL SERVIDOR!",
                html: "Hubo problemas internos, por lo que no se pudo modificar el proyecto.",
                willClose: () => {
                    PostForm.disabled = false;
                }
            });
            return false;
        }
    } catch (err) {
        console.error('Hubo problemas actualizando un nuevo proyecto', err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡CONEXION FALLIDA!",
            html: "Hubo problemas con la conexion, por lo que no se pudo modificar el proyecto.",
            willClose: () => {
                PostForm.disabled = false;
            }
        });
        return false;
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
async function DeshabilitarElProyecto(id) {
    try {
        const res = await DeshabilitarProyecto(id);
        if(res.ok){
            AlertEsquina.fire({
                icon: "success",
                title: "¡EL PROYECTO SE DESHABILITO CON EXITO!",
                html: "No hubo problemas deshabilitando el proyecto.",
                willClose: () => {
                    localStorage.removeItem("IdProyecto");
                    location.replace("Proyectos - Admin.html");
                }
            });
        }else{
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR AL MODIFICAR EL PROYECTO!",
                html: "Hubo problemas intentando modificar el proyecto."
            });
        }
    } catch (err) {
        console.error('Hubo problemas deshabilitando el proyecto', err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡ERROR AL MODIFICAR EL PROYECTO!",
            html: "Hubo problemas intentando modificar el proyecto."
        });
    }
}
async function HabilitarElProyecto(id) {
    try {
        const res = await HabilitarProyecto(id);
        if(res.ok){
            AlertEsquina.fire({
                icon: "success",
                title: "¡EL PROYECTO SE HABILITO CON EXITO!",
                html: "No hubo problemas habilitando el proyecto.",
                willClose: () => {
                    localStorage.removeItem("IdProyecto");
                    location.replace("Proyectos - Admin.html");
                }
            });
        }else{
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR AL MODIFICAR EL PROYECTO!",
                html: "Hubo problemas intentando modificar el proyecto."
            });
        }
    } catch (err) {
        console.error('Hubo problemas habilitando el proyecto', err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡ERROR AL MODIFICAR EL PROYECTO!",
            html: "Hubo problemas intentando modificar el proyecto."
        });
    }
}

//Funciones de los botones
btnBack.addEventListener('click', () => {
    localStorage.removeItem("IdProyecto");
    location.replace("Proyectos - Admin.html");
});
btnDeshabilitar.addEventListener('click', async() => {
    const id = idProyecto.value;
    DeshabilitarElProyecto(id);
});
btnHabilitar.addEventListener('click', async() => {
    const id = idProyecto.value;
    HabilitarElProyecto(id);
});
btnUpdate.addEventListener('click', () => {
    LimpiarFormulario();
    Modal_Update.show();
});

//Metodos del Modal
function LimpiarFormulario(){
    UpdateLogo.value = '';
    UpdateMuestra.value = '';
    UpdateName.value = NombreProyecto.value.trim();
    UpdateConcepto.value = ConceptoProyecto.value.trim();
    UpdateCupos.value = CuposProyectos.value.trim();
    ImagePreviewLogo.src = Icono_Proyecto.src;
    ImagePreviewMuestra.src = Muestra_Proyecto.src;
    SubmitForm.disabled = false;
}
function ValidarCambios(){
    if(UpdateName.value.trim() == NombreProyecto.value.trim() && UpdateConcepto.value.trim() == ConceptoProyecto.value.trim() && UpdateCupos.value.trim() == CuposProyectos.value.trim() && (ImagePreviewLogo.src == Icono_Proyecto.src || ImagePreviewLogo.src == '') && (ImagePreviewMuestra.src == Muestra_Proyecto.src || ImagePreviewMuestra.src == '')){
        return false;
    }else{
        return true;
    }
}
PutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    SubmitForm.disabled = true;

    const validar = ValidarCambios();
    if(validar == false){
        AlertEsquina.fire({
            icon: "info",
            title: "¡SIN CAMBIOS!",
            html: "No se ha realizado ningun cambio en la informacion del proyecto.",
            willClose: () => {
                SubmitForm.disabled = false;
            }
        });
        return;
    }
    
    const UpdateIdValue = idProyecto.value.trim();
    const UpdateNameValue = UpdateName.value.trim();
    const UpdateConceptoValue = UpdateConcepto.value.trim();
    const UpdateCuposValue = UpdateCupos.value.trim();
    let UpdateVigencia;
    let UpdateLogoValue;
    let UpdateMuestraValue;
    
    const fileLogo = UpdateLogo?.files?.[0];
    if(fileLogo){
        const value = await SubirFoto(fileLogo);
        if(value == null){
            return;
        }else{
            UpdateLogoValue = value;
        }
    }else{
        UpdateLogoValue = Icono_Proyecto.src;
    }
    
    const fileMuestra = UpdateMuestra?.files?.[0];
    if(fileMuestra){
        const value = await SubirFoto(fileMuestra);
        if(value == null){
            return;
        }else{
            UpdateMuestraValue = value;
        }
    }else{
        UpdateMuestraValue = Muestra_Proyecto.src;
    }

    if(VigenciaProyecto.value == 'Proyecto Vigente'){
        UpdateVigencia = true;
    }else{
        UpdateVigencia = false;
    }
    
    const json = {
        "nombre": UpdateNameValue,
        "concepto" : UpdateConceptoValue,
        "cupos" : UpdateCuposValue,
        "icono": UpdateLogoValue,
        "img_muestra": UpdateMuestraValue,
        "vigencia": UpdateVigencia
    }
    
    const res = await ModificarProyecto(UpdateIdValue, json);
    if(!res){
        SubmitForm.disabled = false;
        return;
    }else{
        AlertEsquina.fire({
            icon: "success",
            title: "¡PROYECTO ACTUALIZADO!",
            html: "No hubo ningun problema modificando el proyecto.",
            willClose: () => {
                LimpiarFormulario();
                Modal_Update.hide();
                localStorage.removeItem("IdProyecto");
                location.replace("Proyectos - Admin.html");
            }
        });
    }
});
UpdateLogo.addEventListener("change", () => {
    const file = UpdateLogo.files?.[0];
    if(file){
        const reader = new FileReader();
        reader.onload = () => (ImagePreviewLogo.src = reader.result);
        reader.readAsDataURL(file);
    } else {
        UpdateLogo.value = "";
        ImagePreviewLogo.src = '';
    }
});
UpdateMuestra.addEventListener("change", () => {
    const file = UpdateMuestra.files?.[0];
    if(file){
        const reader = new FileReader();
        reader.onload = () => (ImagePreviewMuestra.src = reader.result);
        reader.readAsDataURL(file);
    } else {
        UpdateMuestra.value = "";
        ImagePreviewMuestra.src = '';
    }
});

//Funciones de HTML
async function RellenarInfo() {
    const LocalIdProyecto = localStorage.getItem("IdProyecto");
    const Proyecto = await BuscarProyecto(LocalIdProyecto);

    //Dependiendo de la vigencia hace:
    if(Proyecto.vigencia == true){
        btnHabilitar.hidden = true;
        btnHabilitar.disabled = true;
        VigenciaProyecto.value = 'Proyecto Vigente';
    }else{
        btnDeshabilitar.hidden = true;
        btnDeshabilitar.disabled = true;
        VigenciaProyecto.value = 'Proyecto Deshabilitado';
    }

    //Llenamos los Inputs de la informacion
    NombreProyecto.value = Proyecto.nombre;
    ConceptoProyecto.value = Proyecto.concepto;
    CuposProyectos.value = Proyecto.cupos;
    idProyecto.value = Proyecto.id;
    Icono_Proyecto.src = Proyecto.icono;
    Muestra_Proyecto.src = Proyecto.img_muestra;

    //cargamos los estudiantes del proyecto
    await CargarEstudiantesProyecto(LocalIdProyecto);
}
async function CargarEstudiantesProyecto(id) {
    const Estudiantes = await BuscarLosEstudiantes(id);

    Cards_Estudiantes.innerHTML = '';
    Estudiantes.forEach(Estudiante => {
        Cards_Estudiantes.innerHTML += `
            <div class="card_Estudiante">
                <div class="Cards_body">
                    <div class="proyecto-header">
                        <img src="${Estudiante.foto_perfil}" class="proyecto-image" alt="Imagen de Coordinador">
                    </div>
                    <div class="proyecto-details">
                        <h3 class="proyecto-detail">${Estudiante.nombre_estudiante} ${Estudiante.apellido_estudiante}</h3>
                        <h4 class="proyecto-detail">${Estudiante.especialidad}</h4>
                    </div>
                </div>
            </div>
        `
    });

    if(Estudiantes.lenght == 0 && Page === 0){
        AlertEsquina.fire({
            icon: "info",
            title: "¡SIN RESULTADOS!",
            html: "No hay ningun estudiante asignado a este proyecto."
        });
        Cards_Estudiantes.innerHTML = 'SIN RESULTADOS';
    }else if(Estudiantes.length == 15 && Page == 0){
        PageableCenter.innerHTML = `
            <button class="page-btn" onclick="SiguientePagina()">
                Siguente Pagina...
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right-from-line-icon lucide-arrow-right-from-line"><path d="M3 5v14"/><path d="M21 12H7"/><path d="m15 18 6-6-6-6"/></svg>
            </button>
        `
    }else if(Estudiantes.length < 15 && Page > 0){
        PageableCenter.innerHTML = `
            <button class="page-btn" onclick="PaginaAnterior()">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-from-line-icon lucide-arrow-left-from-line"><path d="m9 6-6 6 6 6"/><path d="M3 12h14"/><path d="M21 19V5"/></svg>
                Pagina Anterior...
            </button>
        `
    }else if(Estudiantes.length == 15 && Page > 0){
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

// window.SiguientePagina = SiguientePagina;
// window.PaginaAnterior = PaginaAnterior;
window.addEventListener('DOMContentLoaded', RellenarInfo);