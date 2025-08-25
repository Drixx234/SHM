import{
    traerEstudiantes,
    getByNombre,
    getByEspecialidad
}from "../Service/EstudiantesService.js"

import{
    cargarEspecialidades
}from "../Service/EspecialidadService.js"

import{
    AlertEsquina
}from "../Service/Alerts.js"

localStorage.removeItem("IdEstudiante");
const dropdown_Especialidades = document.getElementById("dropdown-Especialidades");
const Input_Name = document.getElementById("Students-Square");
const btn_Reset = document.getElementById("btn-Reset");

const Array_BlockLetters = ["{", "}", "[", "]", "+", "=", "-", "_", "/", "?", ".", ",", "<", ">", ":", ";", "(", ")", "|", "*", "&", "^", "%", "$", "#", "@", "!", "~", "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const tabla_estudiantes = document.getElementById("Tabla_Estudiantes");
let CargarTable = 0;

async function Cargar_Tabla(n) {
    try{
        const data = await traerEstudiantes(n, 30);
        Rellenar_Tabla(data, true);
    } catch(err) {
        console.error('Error al cargar datos' , err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡ERROR AL CARGAR DATOS!",
            html: `Hubieron problemas al cargar los estudiantes de la pagina ${n + 1}.`,
        });
    } 
}
function Rellenar_Tabla(Estudiantes, Paginacion){
    tabla_estudiantes.innerHTML = ` `;
    
    const EstudiantesJson = Estudiantes.content;

    EstudiantesJson.forEach(Estudiante => {
        tabla_estudiantes.innerHTML += `
        <div class="Card-Student">
            <img src="${Estudiante.foto}" alt="Foto del estudiante ${Estudiante.nombre} ${Estudiante.apellido}">
            <hr>
            <h2>${Estudiante.nombre} ${Estudiante.apellido}</h2>
            <hr>
            <h3>${Estudiante.nombre_Especialidad}</h3>
            <hr>
            <button title="Ver perfil de ${Estudiante.nombre} ${Estudiante.apellido}" id="btn_Profile_Student" onClick="VerPerfilEstudiante(${Estudiante.codigo})"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-collapse-icon lucide-list-collapse"><path d="M10 12h11"/><path d="M10 18h11"/><path d="M10 6h11"/><path d="m3 10 3-3-3-3"/><path d="m3 20 3-3-3-3"/></svg></button>
        </div>
        <hr class="hr_divisor">
        `;
    });
    if(Paginacion){
        if(CargarTable > 0 && EstudiantesJson.length > 0){
            tabla_estudiantes.innerHTML += `
            <button class="btn-More" onClick="SiguientePagina()"><h4>Siguiente Pagina</h4></button>
            <button class="btn-More" onClick="PaginaAnterior()"><h4>Pagina Anterior</h4></button>
        `;
        }else if(EstudiantesJson.length == 0 && CargarTable > 0){
            tabla_estudiantes.innerHTML += `
            <button class="btn-More" onClick="PaginaAnterior()"><h4>Pagina Anterior</h4></button>
        `;
        }
        else{
            tabla_estudiantes.innerHTML += `
            <button class="btn-More" onclick="SiguientePagina()"><h4>Siguiente Pagina</h4></button>
        `;
        }
    }
}
function SiguientePagina(){
    CargarTable = CargarTable + 1;
    Cargar_Tabla(CargarTable);
}
function PaginaAnterior(){
    CargarTable = CargarTable - 1;
    Cargar_Tabla(CargarTable);
}
async function LlenarEspecialidades(){
    const especialidades = await Cargar_Especialidades();
    dropdown_Especialidades.innerHTML = '';
    especialidades.forEach(especialidad => {
        dropdown_Especialidades.innerHTML += `
            <li><button class="Item_Especialidades" onclick="Cargar_Tabla_Especialidad(${especialidad.id})">${especialidad.nombre}</button></li>
        `;
    });
}
async function Cargar_Especialidades(){
    try{
        const data = await cargarEspecialidades();
        return(data);
    }catch(err){
        console.error("Hubieron problemas cargando", err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡ERROR AL CARGAR DATOS!",
            html: "Hubieron problemas intentando cargar las especialidades.",
        });
    }
}
async function Cargar_Tabla_Especialidad(id) {
    try{
        const data = await getByEspecialidad(id, 0, 50);
        Rellenar_Tabla(data, false);
    }catch{
        console.error('Error al cargar datos' , err);
        Alert_Error_Tabla.hidden = false;
    }
}
Input_Name.addEventListener('keydown', (e) => {
    if (Array_BlockLetters.includes(e.key)) {
        e.preventDefault();
    }
});
Input_Name.addEventListener('blur', () =>{
    Input_Name.value = '';
    CargarTable = 0;
    Cargar_Tabla(CargarTable);
})
Input_Name.addEventListener('input', async () => {
    if(Input_Name.value.length < 3){
        return;
    }else{
        let Input_Value = Input_Name.value;
        await Buscar_By_Nombre(Input_Value);
    }
});
async function Buscar_By_Nombre(name){
    try{
        const data = await getByNombre(name, 0, 50);
        Rellenar_Tabla(data, false);
    } catch {
        console.error('Error al cargar datos' , err);
        Alert_Error_Tabla.hidden = false;
    }
}
btn_Reset.addEventListener('click', async () => {
    CargarTable = 0;
    await Cargar_Tabla(CargarTable);
});
function CargaInicialEstudiantes(){
    Cargar_Tabla(CargarTable);
    LlenarEspecialidades();
}
function VerPerfilEstudiante(id){
    localStorage.setItem("IdEstudiante", id);
    window.location.href = "Student Profile - Admin.html"
}

window.VerPerfilEstudiante = VerPerfilEstudiante;
window.SiguientePagina = SiguientePagina;
window.PaginaAnterior = PaginaAnterior;
window.Cargar_Tabla_Especialidad = Cargar_Tabla_Especialidad;
window.addEventListener("DOMContentLoaded", CargaInicialEstudiantes);