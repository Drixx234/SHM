import{
    buscarHoras,
    modificarHorasSociales
}from "../Service/HorasSocialesService.js"

import{
    AlertEsquina
}from "../Service/Alerts.js"

import{
    buscarEstudiante
}from "../Service/EstudiantesService.js"

import{
    obtenerLimiteHoras
}from "../Service/GeneralidadesService.js"

import{
    EncontrarPorEstudiante
}from "../Service/ServiciosVigentesService.js"

window.addEventListener('DOMContentLoaded', async () => {
    
    const idEstudiante = document.getElementById("idEstudiante");
    const idUsuario = document.getElementById("idUsuario");
    const idHoras = document.getElementById("idHoras");
    const NombreEstudiante = document.getElementById("NombreEstudiante");
    const ApellidoEstudiante = document.getElementById("ApellidoEstudiante");
    const anioEstudiante = document.getElementById("anioEstudiante");
    const SeccionEstudiante = document.getElementById("SeccionEstudiante");
    const EspecialidadEstudiante = document.getElementById("EspecialidadEstudiante");
    const CoordinadorEspecialidad = document.getElementById("CoordinadorEspecialidad");
    const CorreoEstudiante = document.getElementById("CorreoEstudiante");
    const ProyectoEstudiante = document.getElementById("ProyectoEstudiante");
    const btnHoras = document.getElementById("btnHoras");
    const btnView = document.getElementById("btnView");
    const btnBack = document.getElementById("btnBack");
    const Foto_Perfil = document.getElementById("Foto_Perfil");
    const Horas_Card = document.getElementById("Horas_Card");

    const ModalHoras = document.getElementById("ModalHoras");
    const Modal_Horas = new bootstrap.Modal(ModalHoras);
    const HorasNumber = document.getElementById("HorasNumber");
    const AgregarHorasForm = document.getElementById("AgregarHorasForm");
    const Horasrequeridas = document.getElementById("Horasrequeridas");

    const CodigoEstudiante = localStorage.getItem("IdEstudiante");
    let HorasSociales;


    async function ObtenerLimitHoras() {
        try{
            const Limite = await obtenerLimiteHoras();
            return Limite.limiteHoras;
        }catch(err){
            console.error("Hubieron problemas cargando el limite de Horas Sociales");
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR AL CARGAR DATOS!",
                html: "Hubieron problemas al cargar el valor del limite de horas sociales.",
            });
        }
    }
    btnView.addEventListener('click', () => {
        if(Horas_Card.hidden == true){
            btnView.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
            Ver Horas Sociales
            `;
            Horas_Card.hidden = false;
        }else{
            btnView.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-closed-icon lucide-eye-closed"><path d="m15 18-.722-3.25"/><path d="M2 8a10.645 10.645 0 0 0 20 0"/><path d="m20 15-1.726-2.05"/><path d="m4 15 1.726-2.05"/><path d="m9 18 .722-3.25"/></svg>
            Ver Horas Sociales
            `;
            Horas_Card.hidden = true;
        }
    });
    async function AgregarHorasSociales(id, json) {
        try{
            return await modificarHorasSociales(id, json);
        }catch(err){
            console.log("Hubieron problemas Modificando", err);
            AlertEsquina.fire({
                icon: "error",
                title: "¡NO SE PUDO MODIFICAR!",
                html: "Hubo un problema con la conexion, no se pudieron agregar las horas sociales.",
            });
        }
    }
    async function BuscarServicioVigente() {
        try{
            const data = EncontrarPorEstudiante(CodigoEstudiante);
            return data;
        }catch(err){
            console.error("Hubieron problemas buscando", err);
            AlertEsquina.fire({
                icon: "error",
                title: "¡NO SE PUDO CARGAR!",
                html: "Hubo un problema con la conexion, no se pudieron obtener el servicio vigente del estudiante.",
            });
        }
    }
    async function Buscar_Estudiante() {
        try{
            const data = await buscarEstudiante(CodigoEstudiante);
            return data;
        }catch(err){
            console.error("No se pudo cargar datos", err);
            AlertEsquina.fire({
                icon: "error",
                title: "¡NO SE PUDO CARGAR!",
                html: "Hubo un problema con la conexion, no se pudieron obtener los datos del estudiante.",
            });
        }
    }
    async function ObtenerHoras() {
        try{
            const data = await buscarHoras(CodigoEstudiante);
            return data;
        }catch(err){
            console.error("No se pudo cargar datos", err);
            AlertEsquina.fire({
                icon: "error",
                title: "¡NO SE PUDO CARGAR!",
                html: "Hubo un problema con la conexion, no se pudieron obtener las horas sociales del estudiante.",
            });
        }
    }
    async function CargarEstudianteInfo() {
        if(!CodigoEstudiante){
            AlertEsquina.fire({
                icon: "error",
                title: "¡NO SE PUDO OBTENER!",
                html: "Hubo un problema y no se pudo obtener el codigo del estudiante para buscar la informacion.",
            });
        }

        const Estudiante = await Buscar_Estudiante();
        const limiteHoras = await ObtenerLimitHoras();
        const Horas = await ObtenerHoras();
        const Servicio = await BuscarServicioVigente();

        idEstudiante.value = Estudiante.codigo;
        idUsuario.value = Estudiante.usuario;
        idHoras.value = Horas.id;
        NombreEstudiante.value = Estudiante.nombre;
        ApellidoEstudiante.value = Estudiante.apellido;
        anioEstudiante.value = Estudiante.año_academico;
        SeccionEstudiante.value = Estudiante.seccion_academica;
        EspecialidadEstudiante.value = Estudiante.nombre_Especialidad;
        CoordinadorEspecialidad.value = Estudiante.coordinador;
        CorreoEstudiante.value = Estudiante.correo_electronico;
        Foto_Perfil.src = Estudiante.foto;
        if(!Servicio.proyecto_nombre){
            ProyectoEstudiante.value = "No hay ningun Servicio Vigente"
        }else{
            ProyectoEstudiante.value = Servicio.proyecto_nombre;
        }

        Horasrequeridas.textContent = limiteHoras;
        const horas = Horas.horas || 0;
        const porcentaje = Horas.porcentaje || 0;
        const horasFaltantes = limiteHoras - horas;
        HorasSociales = Horas.horas;

        document.getElementById('horas-completadas').textContent = horas;
        document.getElementById('horas-faltantes').textContent = horasFaltantes;
        document.getElementById('percentage-text').textContent = `${porcentaje.toFixed(1)}%`;

        const progressBar = document.getElementById('progress-bar');
        progressBar.style.width = `${porcentaje}%`;
        progressBar.setAttribute('aria-valuenow', porcentaje);
        progressBar.textContent = `${porcentaje.toFixed(1)}%`;

        document.getElementById('progress-pie').style.setProperty('--percentage', `${porcentaje}%`);
    }
    btnHoras.addEventListener('click', async () => {
        Modal_Horas.show();
    });
    AgregarHorasForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const HorasAgregadas = parseFloat(HorasNumber.value);
        const HorasTotales = HorasAgregadas + HorasSociales;
        const id_horas = idHoras.value;

        console.log(HorasAgregadas);
        console.log(HorasTotales);
        console.log(HorasSociales);

        if(HorasTotales > 150.0){
            AlertEsquina.fire({
                icon: "error",
                title: "¡NO SE PUDO AGREGAR!",
                html: "Las horas en total exceden el limite de horas sociales obtenibles por un estudiante.",
            });
            return;
        }

        const data = {
            "horas": HorasTotales,
            "codigoEstudiante": CodigoEstudiante
        }

        const res = await AgregarHorasSociales(id_horas, data);
        if(res.ok){
            AlertEsquina.fire({
                icon: "success",
                title: "¡HORAS AGREGADAS!",
                html: "Las horas fueron agregadas exitosamente.",
            });
            Modal_Horas.hide();
            CargarEstudianteInfo();
            HorasNumber.value = '';
        }else{
            AlertEsquina.fire({
                icon: "error",
                title: "¡NO SE PUDO MODIFICAR!",
                html: "Hubieron problemas intentando modificar el registro de horas, no se pudieron agregar las horas sociales.",
            });
            return;
        }
    });
    btnBack.addEventListener('click', () => {
        localStorage.removeItem("IdEstudiante");
        location.replace("Estudiantes - Admin.html");
    });

    CargarEstudianteInfo();
});