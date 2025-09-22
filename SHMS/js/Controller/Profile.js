import{
    AlertEsquina
}from "../Service/Alerts.js"

import{
    uploadImageToFolder
}from "../Service/CloudinaryService.js"

import{
    cargarEspecialidades,
    createEspecidalidad
}from "../Service/EspecialidadService.js"

import{
    actualizarUsuarios
}from "../Service/UsuariosService.js"

import{
    buscarAdministrador,
    actualizarAdministrador
}from "../Service/AdministradoresService.js"

import{
    CargarGeneralidades,
    ActualizarValores
}from "../Service/GeneralidadesService.js"

import{
    LogOut
}from "../Service/AuthService.js"

window.addEventListener('DOMContentLoaded', () => {
    const idAdministrador = document.getElementById("idAdministrador");
    const idUsuario = document.getElementById("idUsuario");
    const idProyecto = document.getElementById("idProyecto");
    const NombreAdmin = document.getElementById("NombreAdmin");
    const ApellidoAdmin = document.getElementById("ApellidoAdmin");
    const CorreoAdmin = document.getElementById("CorreoAdmin");
    const ProyectoAdmin = document.getElementById("ProyectoAdmin");
    const Foto_Perfil = document.getElementById("Foto_Perfil");
    const btnLogOut = document.getElementById("btnLogOut");
    const btnUpdate = document.getElementById("btnUpdate");

    const ModalUpdate = document.getElementById("ModalUpdate");
    const Modal_Updated = new bootstrap.Modal(ModalUpdate);
    const UpdateForm = document.getElementById("UpdateForm");
    const UpdatedPerfilFoto = document.getElementById("UpdatedPerfilFoto");
    const ImagePreview = document.getElementById("ImagePreview");
    const UpdatedName = document.getElementById("UpdatedName");
    const UpdatedApellido = document.getElementById("UpdatedApellido");
    const UpdatedCorreo = document.getElementById("UpdatedCorreo");
    const chk_password = document.getElementById("chk_password");
    const UpdatedPassword = document.getElementById("UpdatedPassword");

    const article_especialidades = document.getElementById("article_especialidades");
    const article_generalidades = document.getElementById("article_generalidades");
    const Especialidades_Div = document.getElementById("Especialidades_Div");
    const Generalidades_Div = document.getElementById("Generalidades_Div");
    const btn_especialidades = document.getElementById("btn_especialidades");
    const btn_generalidades = document.getElementById("btn_generalidades");
    const btnAddEspe = document.getElementById("btnAddEspe");

    const ModalNewEspecialidad = document.getElementById("ModalNewEspecialidad");
    const Modal_NewEspecialidad = new bootstrap.Modal(ModalNewEspecialidad);
    const NewEspeForm = document.getElementById("NewEspeForm");
    const NewNombreEspecialidad =document.getElementById("NewNombreEspecialidad");
    const NewOrientadorEspecialidad = document.getElementById("NewOrientadorEspecialidad");
    const btn_NewEspecialidad = document.getElementById("btn_NewEspecialidad");

    async function BuscarAdmin(adminId){
        try{
            const data = buscarAdministrador(adminId);
            return data;
        }catch(err){
            console.error('Error al cargar datos' , err);
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR AL CARGAR DATOS!",
                html: "Hubieron problemas al cargar la informacion del perfil.",
            });
        }
    }

    btnLogOut.addEventListener('click', async () => {
        const res = await LogOut();
        if(res.ok){
            location.replace("Index.html");
        }else{
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR CON LA COOKIE!",
                html: "Hubieron problemas al intentar eliminar el token de autenticacion."
            });
        }
    });

    async function CargarEspecialidades() {
        try{
            const res = await cargarEspecialidades();
            return res;
        }catch(err){
            console.error("Problemas cargando las especialidades", err);
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR EN LA CONEXION!",
                html: "Hubieron problemas con la conexion, por lo que no se pudieron cargar las especialidades."
            });
        }
    }

    async function AllGeneralidades() {
        try{
            const res = await CargarGeneralidades();
            console.log(res);
            return res;
        }catch(err){
            console.error("Problemas cargando las generalidades", err);
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR EN LA CONEXION!",
                html: "Hubieron problemas con la conexion, por lo que no se pudieron cargar las generalidades."
            });
        }
    }

    async function RellenarInfo(){
        const adminId = localStorage.getItem("id_admin");
        const admin = await BuscarAdmin(adminId);

        idAdministrador.value = admin.id;
        idUsuario.value = admin.idUsuario;
        if(admin.id_proyecto == null){
            idProyecto.value = "";
            ProyectoAdmin.value = 'No hay ningun proyecto asignado';
        }else{
            idProyecto.value = admin.id_proyecto;
            ProyectoAdmin.value = admin.nombre_Proyecto;
        }
        NombreAdmin.value = admin.nombre;
        ApellidoAdmin.value = admin.apellido;
        CorreoAdmin.value = admin.correo_electronico;
        Foto_Perfil.src = admin.foto_perfil;

        await LlenarEspecialidades();
        await LlenarGeneralidades();
    }

    async function LlenarEspecialidades(){
        const Especialidades = await CargarEspecialidades();
        Especialidades_Div.innerHTML == '';
        Especialidades.forEach(Especialidad => {
            Especialidades_Div.innerHTML += `
                <div class="divs_inputs2">
                    <input type="text" readonly placeholder="${Especialidad.nombre}">
                    <input type="text" readonly placeholder="${Especialidad.orientador}">
                    <button class="btn_Config">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bolt-icon lucide-bolt"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><circle cx="12" cy="12" r="4"/></svg>
                    </button>
                </div>
            `;
        });
    }

    async function LlenarGeneralidades() {
        const Generalidades = await AllGeneralidades();
        Generalidades_Div.innerHTML == '';
        Generalidades.forEach(Generalidad => {
            Generalidades_Div.innerHTML += `

            `;
        });
    }

    async function CrearEspecialidades(json) {
        try {
            const res = await createEspecidalidad(json);
            return res.json();
        } catch(err) {
            console.error("Problemas creando una especialidad", err);
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR EN LA CONEXION!",
                html: "Hubieron problemas con la conexion, por lo que no se pudo crear la especialidad."
            });
            return;            
        }
    }

    btn_especialidades.addEventListener('click', () => {
        if(article_especialidades.hidden == true){
            article_generalidades.hidden = true;
            article_especialidades.hidden = false;
        }else{
            article_generalidades.hidden = true;
            article_especialidades.hidden = true;
        }
    });

    btn_generalidades.addEventListener('click', () => {
        if(article_generalidades.hidden == true){
            article_generalidades.hidden = false;
            article_especialidades.hidden = true;
        }else{
            article_generalidades.hidden = true;
            article_especialidades.hidden = true;
        }
    });

    btnUpdate.addEventListener('click', () => {
        ImagePreview.src = Foto_Perfil.src;
        UpdatedName.value = NombreAdmin.value;
        UpdatedApellido.value = ApellidoAdmin.value;
        UpdatedCorreo.value = CorreoAdmin.value;
        UpdatedPassword.value = ConstraseniaAdmin.value;
        Modal_Updated.show();
    });

    UpdatedPerfilFoto.addEventListener("change", () => {
        const file = UpdatedPerfilFoto.files?.[0];
        if(file){
            const reader = new FileReader();
            reader.onload = () => (ImagePreview.src = reader.result);
            reader.readAsDataURL(file);
        } else {
            UpdatedPerfilFoto.value = "";
        }
    });
        
    chk_password.addEventListener('change', () => {
        if(chk_password.checked){
            UpdatedPassword.readOnly = false;
            UpdatedPassword.type = "text";
            UpdatedPassword.value = '';
            UpdatedPassword.focus();
        }else{
            UpdatedPassword.readOnly = true;
            UpdatedPassword.value = ConstraseniaAdmin.value;
            UpdatedPassword.type = "password";
        }
    });

    function validar_NoCambios(){
        if(UpdatedPerfilFoto.files.length == 0 && UpdatedName.value == NombreAdmin.value && UpdatedApellido.value == ApellidoAdmin.value && UpdatedCorreo.value == CorreoAdmin.value && UpdatedPassword.value == ConstraseniaAdmin.value){
            AlertEsquina.fire({
                icon: "error",
                title: "¡SIN CAMBIOS!",
                html: "No has hecho ningun cambio en la informacion de perfil",
            });
            return;
        }
    }

    UpdateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        validar_NoCambios();

        const put_id_usuario = idUsuario.value;
        const put_id_admin = idAdministrador.value;
        const put_id_proyecto = idProyecto?.value || null;
        const nombre = UpdatedName.value;
        const apellido = UpdatedApellido.value;
        const correo = UpdatedCorreo.value;
        const contra = UpdatedPassword.value;

        let UpdatedFoto;
        const file = UpdatedPerfilFoto?.files?.[0];
        if(file){
            try{
                const response = await uploadImageToFolder(file, "Foto_Perfil_Admin");
                console.log("Respuesta del backend:", response);
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
        }else{
            UpdatedFoto = Foto_Perfil.src;
        }

        //Si hubieron cambios en el usuario se actualiza
        if(correo != CorreoAdmin.value || contra != ConstraseniaAdmin.value){
            try{
                const jsonU = {
                    "correo": `${correo}`,
                    "contrasenia": `${contra}`,
                    "id_rol": 1
                }
                await actualizarUsuarios(put_id_usuario, jsonU);
            }catch(err){
                console.error("Hubieron problemas actualizando usuario", err);
                AlertEsquina.fire({
                    icon: "error",
                    title: "¡ERROR AL ACTUALIZAR EL USUARIO!",
                    html: "Hubieron problemas intentando actualizar la informacion del usuario.", 
                });
                return;
            }
        }

        const json = {
            "nombre": `${nombre}`,
            "apellido": `${apellido}`,
            "foto_perfil": `${UpdatedFoto}`,
            "idUsuario": put_id_usuario,
            "id_proyecto": put_id_proyecto,
            "estado_admin": true
        }

        try{
            const res = await actualizarAdministrador(put_id_admin, json);
            if(res.ok){
                AlertEsquina.fire({
                    icon: "success",
                    title: "¡CAMBIOS REALIZADOS!",
                    html: "La informacion de perfil se actualizo correctamente", 
                });
                Modal_Updated.hide();
                RellenarInfo();
            }else{
                AlertEsquina.fire({
                    icon: "error",
                    title: "¡ERROR ACTUALIZANDO!",
                    html: "Hubo algun error actualizando el usuario", 
                });   
            }
        }catch(err){
            console.error("Hubieron problemas actualizando admin", err);
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR AL ACTUALIZAR EL ADMINISTRADOR!",
                html: "Hubieron problemas intentando actualizar la informacion de perfil del administrador.", 
            });
            return;
        }
    });

    btnAddEspe.addEventListener('click', async () => {
        Modal_NewEspecialidad.show();
    });

    NewEspeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const NombreEspe = NewNombreEspecialidad.value.trim();
        const Orientador = NewOrientadorEspecialidad.value.trim();

        const json = {
            "nombre": NombreEspe,
            "orientador": Orientador
        }

        const respuesta = await CrearEspecialidades(json);
        if(respuesta.status == "success"){
            AlertEsquina.fire({
                icon: "success",
                title: "¡CREACION EXITOSA!",
                html: "La especialidad fue creada sin problemas.",
                willClose: async () => {
                    Modal_NewEspecialidad.hide();
                    NewNombreEspecialidad.value = '';
                    NewOrientadorEspecialidad.value = '';
                    await LlenarEspecialidades();
                }
            });

        }else if(respuesta.status == "failed"){
            AlertEsquina.fire({
                icon: "error",
                title: "¡NO SE PUDO CREAR!",
                html: "Hubieron problemas creando la nueva especialidad, .",
                willClose: async () => {
                    Modal_NewEspecialidad.hide();
                    NewNombreEspecialidad.value = '';
                    NewOrientadorEspecialidad.value = '';
                }
            });
        }else{
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR INTERNO!",
                html: "Hubieron problemas internos en el servidor, por lo que no se pudo crear la especialidad."
            });
            return;
        }
    });
    
RellenarInfo();
});