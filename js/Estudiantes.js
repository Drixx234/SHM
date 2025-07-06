const API_URL_Estudiantes = "https://retoolapi.dev/7Gf0pd/tbEstudents";

const btn_Conta = document.getElementById("btn-Conta");
const btn_Arqui = document.getElementById("btn-Arqui");
const btn_Auto = document.getElementById("btn-Auto");
const btn_Software = document.getElementById("btn-Software");
const btn_Diseño = document.getElementById("btn-Diseño");
const btn_ECA = document.getElementById("btn-ECA");
const btn_EMCA = document.getElementById("btn-EMCA");
const btn_Energias = document.getElementById("btn-Energi");
const btn_Reset = document.getElementById("btn-Reset");

const Input_Name = document.getElementById("Students-Square");

const Alert_Error_Tabla = document.getElementById("Alert_Error_Tabla");

const Array_BlockLetters = ["{", "}", "[", "]", "+", "=", "-", "_", "/", "?", ".", ",", "<", ">", ":", ";", "(", ")", "|", "*", "&", "^", "%", "$", "#", "@", "!", "~", "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const tabla_estudiantes = document.getElementById("Tabla_Estudiantes");
let CargarTable = 1;

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
                    <button><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-collapse-icon lucide-list-collapse"><path d="M10 12h11"/><path d="M10 18h11"/><path d="M10 6h11"/><path d="m3 10 3-3-3-3"/><path d="m3 20 3-3-3-3"/></svg></button>
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
                    <button><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-collapse-icon lucide-list-collapse"><path d="M10 12h11"/><path d="M10 18h11"/><path d="M10 6h11"/><path d="m3 10 3-3-3-3"/><path d="m3 20 3-3-3-3"/></svg></button>
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
                    <button><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-collapse-icon lucide-list-collapse"><path d="M10 12h11"/><path d="M10 18h11"/><path d="M10 6h11"/><path d="m3 10 3-3-3-3"/><path d="m3 20 3-3-3-3"/></svg></button>
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
                    <button><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-collapse-icon lucide-list-collapse"><path d="M10 12h11"/><path d="M10 18h11"/><path d="M10 6h11"/><path d="m3 10 3-3-3-3"/><path d="m3 20 3-3-3-3"/></svg></button>
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
                <button><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-collapse-icon lucide-list-collapse"><path d="M10 12h11"/><path d="M10 18h11"/><path d="M10 6h11"/><path d="m3 10 3-3-3-3"/><path d="m3 20 3-3-3-3"/></svg></button>
            </div>
            <hr class="hr_divisor">
            `;
        });
}


function CargaInicialEstudiantes(){
    Cargar_Tabla(CargarTable);
    Alert_Error_Tabla.hidden = true;
}
window.addEventListener("DOMContentLoaded", CargaInicialEstudiantes);