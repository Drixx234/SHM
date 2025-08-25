import{
    AlertEsquina,
    alert_password_change
}from "../Service/Alerts.js"

import{
    uploadImageToFolder
}from "../Service/CloudinaryService.js"

import{
    actualizarUsuarios
}from "../Service/UsuariosService.js"

import{
    buscarAdministrador,
    actualizarAdministrador
}from "../Service/AdministradoresService.js"

const btnPassword = document.getElementById("btnPassword");
const div_password = document.getElementById("div_password");
const idAdministrador = document.getElementById("idAdministrador");
const idUsuario = document.getElementById("idUsuario");
const idProyecto = document.getElementById("idProyecto");
const NombreAdmin = document.getElementById("NombreAdmin");
const ApellidoAdmin = document.getElementById("ApellidoAdmin");
const CorreoAdmin = document.getElementById("CorreoAdmin");
const ConstraseniaAdmin = document.getElementById("ConstraseniaAdmin");
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

let btnPasswordActive = 1;

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

    btnLogOut.addEventListener('click', () => {
        localStorage.removeItem("id_admin");
        window.location.href = "Index.html";
    });

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
        ConstraseniaAdmin.value = admin.contrasenia;
        Foto_Perfil.src = admin.foto_perfil;
    }

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

btnPassword.addEventListener('click', () => {
    if(btnPasswordActive == 1){
        alert_password_change.fire({
                title: "¿Deseas ver tu contraseña de usuario?",
                input: "password",
                inputLabel: "Escribe tu contraseña",
                inputPlaceholder: "",
                inputValue: "",
                preConfirm: (valor) => {
                    if (!valor) {
                        Swal.showValidationMessage("Ingresa tu contraseña");
                        return false;
                    }
                    if (valor !== ConstraseniaAdmin.value) {
                        Swal.showValidationMessage("Contraseña es incorrecta");
                        return false;
                    }
                    return true;
                }
            }).then((result) => {
            if (result.isConfirmed) {
                    btnPassword.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                    `;                  
                    div_password.hidden = false;
                    btnPasswordActive = 3;
                    AlertEsquina.fire({
                        icon: "success",
                        title: "Contraseña Correcta",
                    });
                }else{
                    btnPassword.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-closed-icon lucide-eye-closed"><path d="m15 18-.722-3.25"/><path d="M2 8a10.645 10.645 0 0 0 20 0"/><path d="m20 15-1.726-2.05"/><path d="m4 15 1.726-2.05"/><path d="m9 18 .722-3.25"/></svg>
                    `;
                    div_password.hidden = true;
                    btnPasswordActive = 1;
                }
            });
    }else if(btnPasswordActive == 2){
        btnPassword.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
        `;
        div_password.hidden = false;
        btnPasswordActive = 3;
    }else if(btnPasswordActive = 3){
        btnPassword.innerHTML = `
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-closed-icon lucide-eye-closed"><path d="m15 18-.722-3.25"/><path d="M2 8a10.645 10.645 0 0 0 20 0"/><path d="m20 15-1.726-2.05"/><path d="m4 15 1.726-2.05"/><path d="m9 18 .722-3.25"/></svg>
        `;
        div_password.hidden = true;
        btnPasswordActive = 2;
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

ModalUpdate.addEventListener("hidden.bs.modal", () => {
  btnUpdate.focus();
});

window.addEventListener('DOMContentLoaded', () => {
    RellenarInfo();
});