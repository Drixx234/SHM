const API_URL_Estudiantes = "https://retoolapi.dev/tVBF8Z/tbEstudiantes";
const API_URL_ServiciosVigentes = "https://retoolapi.dev/XqGGae/tbServicios_Vigentes";
const API_URL_Proyectos = "https://retoolapi.dev/B81qu9/tbProyectos";

const btn_Conta = document.getElementById("btn-Conta");
const btn_Arqui = document.getElementById("btn-Arqui");
const btn_Auto = document.getElementById("btn-Auto");
const btn_Software = document.getElementById("btn-Software");
const btn_Diseño = document.getElementById("btn-Diseño");
const btn_ECA = document.getElementById("btn-ECA");
const btn_EMCA = document.getElementById("btn-EMCA");
const btn_Energias = document.getElementById("btn-Energi");
const btn_Reset = document.getElementById("btn-Reset");

const Btn_close_Profile_Estudiante = document.getElementById("Btn-close-Profile-Estudiante");

const Input_Name = document.getElementById("Students-Square");

const Alert_Error_Tabla = document.getElementById("Alert_Error_Tabla");
const Alert_Error_Dialog = document.getElementById("Alert_Error_Dialog");

const Array_BlockLetters = ["{", "}", "[", "]", "+", "=", "-", "_", "/", "?", ".", ",", "<", ">", ":", ";", "(", ")", "|", "*", "&", "^", "%", "$", "#", "@", "!", "~", "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const tabla_estudiantes = document.getElementById("Tabla_Estudiantes");
const Dialog_Profile_Estudiante = document.getElementById("Dialog_Profile_Estudiante");
const Form_Estudiante = document.getElementById("Form_Estudiante");
let CargarTable = 1;

const Input_Dialog_Codigo = document.getElementById("Codigo_Estudiante");
const Input_NIE_Estudiante = document.getElementById("NIE_Estudiante");
const Input_Dialog_Nombre = document.getElementById("Nombre_Estudiante");
const Input_Dialog_Apellido = document.getElementById("Apellido_Estudiante");
const Input_Dialog_Correo = document.getElementById("Correo_Estudiante");
const Input_Dialog_Especialidad = document.getElementById("Especialidad_Estudiante");
const Input_Dialog_GrupoTecnico = document.getElementById("GrupoTecnico_Estudiante");
const Input_Dialog_Orientador = document.getElementById("Orientador_Estudiante");
const Input_Dialog_AnioAcademico = document.getElementById("AñoAcademico_Estudiante");
const Input_Dialog_Seccion = document.getElementById("Seccion_Estudiante");
const P_Dialog_Proyecto = document.getElementById("P_Dialog_Proyecto");
const Input_Proyecto_Asignado = document.getElementById("btn_Proyecto");
const Proyectos_Menu_Dialog = document.getElementById("dropdown-Proyecto");
const img_Profile_Estudiante = document.getElementById("img_Profile_Estudiante");

async function Cargar_Tabla(n) {
    try{
        const res = await fetch(API_URL_Estudiantes);
        const data = await res.json();
        Rellenar_Tabla(data, n);
    } catch(err) {
        console.error('Error al cargar datos' , err);
        Alert_Error_Tabla.hidden = false;
    } 
}
function Rellenar_Tabla(Estudiantes, n){

    if(n == 1){
        const JS_Estudiantes = Estudiantes.slice(0, 5);

        tabla_estudiantes.innerHTML = ` `;
        
        JS_Estudiantes.forEach(Estudiante => {
            tabla_estudiantes.innerHTML += `
                <div class="Card-Student">
                    <img src="${Estudiante.Foto_Estudiante}" alt="Foto del estudiante ${Estudiante.Nombre_Estudiante} ${Estudiante.Apellido_Estudiante}">
                    <hr>
                    <h2>${Estudiante.Nombre_Estudiante} ${Estudiante.Apellido_Estudiante}</h2>
                    <hr>
                    <h3>${Estudiante.Especialidad_Estudiante}</h3>
                    <hr>
                    <button title="Ver perfil de ${Estudiante.Nombre_Estudiante} ${Estudiante.Apellido_Estudiante}" id="btn_Profile_Student" onClick="Dialog_Estudiante(${Estudiante.id})"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-collapse-icon lucide-list-collapse"><path d="M10 12h11"/><path d="M10 18h11"/><path d="M10 6h11"/><path d="m3 10 3-3-3-3"/><path d="m3 20 3-3-3-3"/></svg></button>
                </div>
                <hr class="hr_divisor">
            `;
        })
        tabla_estudiantes.innerHTML += `
            <button class="btn-More" id="btn-More-Minum"><h4>Cargar más...</h4></button>
        `;

        const btn_Max_Min = document.getElementById('btn-More-Minum');

        btn_Max_Min.addEventListener('click', () => {
            CargarTable = 2;
            Cargar_Tabla(CargarTable);
        });

    }else if(n == 2){
        const JS_Estudiantes = Estudiantes.slice(0, 20);
        
        tabla_estudiantes.innerHTML = ` `;

        JS_Estudiantes.forEach(Estudiante => {
            tabla_estudiantes.innerHTML += `
                <div class="Card-Student">
                    <img src="${Estudiante.Foto_Estudiante}" alt="Foto del estudiante ${Estudiante.Nombre_Estudiante} ${Estudiante.Apellido_Estudiante}">
                    <hr>
                    <h2>${Estudiante.Nombre_Estudiante} ${Estudiante.Apellido_Estudiante}</h2>
                    <hr>
                    <h3>${Estudiante.Especialidad_Estudiante}</h3>
                    <hr>
                    <button title="Ver perfil de ${Estudiante.Nombre_Estudiante} ${Estudiante.Apellido_Estudiante}" id="btn_Profile_Student" onClick="Dialog_Estudiante(${Estudiante.id})"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-collapse-icon lucide-list-collapse"><path d="M10 12h11"/><path d="M10 18h11"/><path d="M10 6h11"/><path d="m3 10 3-3-3-3"/><path d="m3 20 3-3-3-3"/></svg></button>
                </div>
                <hr class="hr_divisor">
            `;
        })
        tabla_estudiantes.innerHTML += `
            <button class="btn-More" id="btn-More-Minum"><h4>Cargar menos...</h4></button>
        `;


        const btn_Max_Min = document.getElementById('btn-More-Minum');

        btn_Max_Min.addEventListener('click', () => {
            CargarTable = 1;
            Cargar_Tabla(CargarTable);
        });
        
    }else{
        console.log('ERROR EN PROGRAMACION');
    }
}
async function Buscar_Servicio_Vigente(Codigo) {
    try{
        const res = await fetch(`${API_URL_ServiciosVigentes}/Codigo_Estudiante=${Codigo}`);
        const data = await res.json();
        return(data)
    } catch(err) {
        console.error('Error al caragar datos', err);
    }
}
async function Cargar_Proyectos(Comision) {
    try{
        const res = await fetch(API_URL_Proyectos);
        const data = await res.json();
        Rellenar_Menu_Proyectos(data, Comision);
    } catch(err) {
        console.error('Error al cargar datos' , err);
    }
}
function Rellenar_Menu_Proyectos(Proyectos, Proyecto_Estudiante){
    Proyectos_Menu_Dialog.innerHTML = '';
    
    Proyectos.forEach(Proyecto => {
        if(Proyecto.Nombre_Proyecto == Proyecto_Estudiante){
            Input_Proyecto_Asignado.textContent = `${Proyecto.Nombre_Proyecto}`
        }
        Proyectos_Menu_Dialog.innerHTML += `
        <li><button class="Item_Especialidades"><p>${Proyecto.id}</p><h4>${Proyecto.Nombre_Proyecto}</h4></button></li>
        `;
    });
}
async function Dialog_Estudiante(id) {
    try{
        const res = await fetch(`${API_URL_Estudiantes}/${id}`)
        const data = await res.json();
        Rellenar_Dialog(data);
    } catch(err) {
        console.error('Error al cargar datos' , err);
        Alert_Error_Dialog.hidden = false;
    }
}
function Rellenar_Dialog(Estudiante){
    Input_Dialog_Codigo.value = `${Estudiante.Codigo_Estudiante}`;
    Input_NIE_Estudiante.value = `${Estudiante.NIE_Estudiante}`;
    Input_Dialog_Nombre.value = `${Estudiante.Nombre_Estudiante}`;
    Input_Dialog_Apellido.value = `${Estudiante.Apellido_Estudiante}`;
    Input_Dialog_Correo.value = `${Estudiante.Correo_Electronico}`;
    Input_Dialog_Especialidad.value = `${Estudiante.Especialidad_Estudiante}`;
    Input_Dialog_GrupoTecnico.value = `${Estudiante.Grupo_Tecnico_Especialidad}`;
    Input_Dialog_Orientador.value = `${Estudiante.Orientador_Especialidad}`;
    Input_Dialog_AnioAcademico.value = `${Estudiante.AnioAcademico_Estudiante}`;
    Input_Dialog_Seccion.value = `${Estudiante.Seccion_Academica_Estudiante}`;
    img_Profile_Estudiante.innerHTML = `<img src="${Estudiante.Foto_Estudiante}" alt="Foto de Perfil de ${Estudiante.Nombre_Estudiante} ${Estudiante.Apellido_Estudiante}">`;

    const Servicio_Vigente = Buscar_Servicio_Vigente(Estudiante.Codigo_Estudiante);
    
    if(!(Servicio_Vigente.Nombre_Proyecto)){
        Input_Proyecto_Asignado.textContent = 'No hay proyecto asignado';
    }else{
        Input_Proyecto_Asignado.textContent = `${Servicio_Vigente.Nombre_Proyecto}`;
    }
    Cargar_Proyectos(Servicio_Vigente.Nombre_Proyecto);

    body.style.filter = "blur(6px)";
    Dialog_Profile_Estudiante.showModal();
}
async function Agregar_Servicio_Vigente(Codigo, Proyecto) {
    
}
async function Eliminar_Servicio_Vigente(id) {
    await fetch(`${API_URL_ServiciosVigentes}/${id}`, )
}
function Cambiar_Proyecto(Codigo, Nombre, Proyecto){
    const confirmacion = confirm(`Seguro de cambiar el Proyecto de ${Nombre}`);

    if(confirmacion){
        const Servicio_Vigente = Buscar_Servicio_Vigente(Codigo);

        if((Servicio_Vigente.Nombre_Proyecto)){
            Eliminar_Servicio_Vigente(Servicio_Vigente.id);
        }

        Agregar_Servicio_Vigente();
    }
}

btn_Arqui.addEventListener('click', () =>{
    CargarTable = 1;
    Cargar_Tabla_Especialidad('Arquitectura', CargarTable);
});
btn_Auto.addEventListener('click', () =>{
    CargarTable = 1;
    Cargar_Tabla_Especialidad('Automotriz', CargarTable);
});
btn_Conta.addEventListener('click', () =>{
    CargarTable = 1;
    Cargar_Tabla_Especialidad('Administrativo Contable', CargarTable);
});
btn_Software.addEventListener('click', () =>{
    CargarTable = 1;
    Cargar_Tabla_Especialidad('Desarrollo de Software', CargarTable);
});
btn_Diseño.addEventListener('click', () =>{
    CargarTable = 1;
    Cargar_Tabla_Especialidad('Diseño Grafico', CargarTable);
});
btn_ECA.addEventListener('click', () =>{
    CargarTable = 1;
    Cargar_Tabla_Especialidad('Electronica', CargarTable);
});
btn_EMCA.addEventListener('click', () =>{
    CargarTable = 1;
    Cargar_Tabla_Especialidad('Electromecanica', CargarTable);
});
btn_Energias.addEventListener('click', () =>{
    CargarTable = 1;
    Cargar_Tabla_Especialidad('Energias Renovables', CargarTable);
});
btn_Reset.addEventListener('click', () => {
    CargarTable = 1;
    Cargar_Tabla(CargarTable);
});
async function Cargar_Tabla_Especialidad(name, n) {
    try{
        const res = await fetch(`${API_URL_Estudiantes}?Especialidad_Estudiante=${name}`);
        const data = await res.json();
        Tabla_Filtrada_Nombre(data, n);
    }catch{
        console.error('Error al cargar datos' , err);
        Alert_Error_Tabla.hidden = false;
    }
}
function Tabla_Filtrada_Especialidad(Estudiantes, n){
    if(n == 1){
        const JS_Estudiantes = Estudiantes.slice(0, 10);

        tabla_estudiantes.innerHTML = ` `;
        
        JS_Estudiantes.forEach(Estudiante => {
            tabla_estudiantes.innerHTML += `
                <div class="Card-Student">
                    <img src="${Estudiante.Foto_Estudiante}" alt="Foto del estudiante ${Estudiante.Nombre_Estudiante} ${Estudiante.Apellido_Estudiante}">
                    <hr>
                    <h2>${Estudiante.Nombre_Estudiante} ${Estudiante.Apellido_Estudiante}</h2>
                    <hr>
                    <h3>${Estudiante.Especialidad_Estudiante}</h3>
                    <hr>
                    <button title="Ver perfil de ${Estudiante.Nombre_Estudiante} ${Estudiante.Apellido_Estudiante}" id="btn_Profile_Student" onClick="Dialog_Estudiante(${Estudiante.id})"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-collapse-icon lucide-list-collapse"><path d="M10 12h11"/><path d="M10 18h11"/><path d="M10 6h11"/><path d="m3 10 3-3-3-3"/><path d="m3 20 3-3-3-3"/></svg></button>
                </div>
                <hr class="hr_divisor">
            `;
        })
        tabla_estudiantes.innerHTML += `
            <button class="btn-More" id="btn-More-Minum"><h4>Cargar más...</h4></button>
        `;

        const btn_Max_Min = document.getElementById('btn-More-Minum');

        btn_Max_Min.addEventListener('click', () => {
            CargarTable = 2;
            Tabla_Filtrada_Especialidad(Estudiantes, CargarTable);
        });

    }else if(n == 2){
        const JS_Estudiantes = Estudiantes.slice(0, 30);
        
        tabla_estudiantes.innerHTML = ` `;

        JS_Estudiantes.forEach(Estudiante => {
            tabla_estudiantes.innerHTML += `
                <div class="Card-Student">
                    <img src="${Estudiante.Foto_Estudiante}" alt="Foto del estudiante ${Estudiante.Nombre_Estudiante} ${Estudiante.Apellido_Estudiante}">
                    <hr>
                    <h2>${Estudiante.Nombre_Estudiante} ${Estudiante.Apellido_Estudiante}</h2>
                    <hr>
                    <h3>${Estudiante.Especialidad_Estudiante}</h3>
                    <hr>
                    <button title="Ver perfil de ${Estudiante.Nombre_Estudiante} ${Estudiante.Apellido_Estudiante}" id="btn_Profile_Student" onClick="Dialog_Estudiante(${Estudiante.id})"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-collapse-icon lucide-list-collapse"><path d="M10 12h11"/><path d="M10 18h11"/><path d="M10 6h11"/><path d="m3 10 3-3-3-3"/><path d="m3 20 3-3-3-3"/></svg></button>
                </div>
                <hr class="hr_divisor">
            `;
        })
        tabla_estudiantes.innerHTML += `
            <button class="btn-More" id="btn-More-Minum"><h4>Cargar menos...</h4></button>
        `;

        const btn_Max_Min = document.getElementById('btn-More-Minum');

        btn_Max_Min.addEventListener('click', () => {
            CargarTable = 1;
            Tabla_Filtrada_Especialidad(Estudiantes, CargarTable);
        });
    }
}

Input_Name.addEventListener('keydown', (e) => {
    if (Array_BlockLetters.includes(e.key)) {
        e.preventDefault();
    }
});
Input_Name.addEventListener('blur', () =>{
    Input_Name.value = '';
    CargarTable = 1;
    Cargar_Tabla(CargarTable);
})
Input_Name.addEventListener('input', () => {
    if(Input_Name.value.length < 3){
        return;
    }else{
        let Input_Value = Input_Name.value;
        Cargar_Tabla_Nombre(Input_Value);
    }
});
async function Cargar_Tabla_Nombre(name){
    try{
        const res = await fetch(`${API_URL_Estudiantes}?Nombre_Estudiante=${name}`);
        const data = await res.json();
        Tabla_Filtrada_Nombre(data);
    } catch {
        console.error('Error al cargar datos' , err);
        Alert_Error_Tabla.hidden = false;
    }
}
function Tabla_Filtrada_Nombre(Estudiantes){
    tabla_estudiantes.innerHTML = ` `;
        
    Estudiantes.forEach(Estudiante => {
        tabla_estudiantes.innerHTML += `
            <div class="Card-Student">
                <img src="${Estudiante.Foto_Estudiante}" alt="Foto del estudiante ${Estudiante.Nombre_Estudiante} ${Estudiante.Apellido_Estudiante}">
                <hr>
                <h2>${Estudiante.Nombre_Estudiante} ${Estudiante.Apellido_Estudiante}</h2>
                <hr>
                <h3>${Estudiante.Especialidad_Estudiante}</h3>
                <hr>
                <button title="Ver perfil de ${Estudiante.Nombre_Estudiante} ${Estudiante.Apellido_Estudiante}" id="btn_Profile_Student" onClick="Dialog_Estudiante(${Estudiante.id})"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-collapse-icon lucide-list-collapse"><path d="M10 12h11"/><path d="M10 18h11"/><path d="M10 6h11"/><path d="m3 10 3-3-3-3"/><path d="m3 20 3-3-3-3"/></svg></button>
                <p id="P_id">${Estudiante.id}</p>
            </div>
            <hr class="hr_divisor">
            `;
        });
}

Btn_close_Profile_Estudiante.addEventListener('click', () => {
    body.style.filter = "blur(0px)";
    Dialog_Profile_Estudiante.close();
});
Dialog_Profile_Estudiante.addEventListener('cancel', (e) => {
    body.style.filter = "blur(0px)";
    dialog_profile.close();
});

function CargaInicialEstudiantes(){
    Cargar_Tabla(CargarTable);
    Alert_Error_Tabla.hidden = true;
    Alert_Error_Dialog.hidden = true;
}
window.addEventListener("DOMContentLoaded", CargaInicialEstudiantes);