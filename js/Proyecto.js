const API_URL_Proyectos = "https://retoolapi.dev/B81qu9/tbProyectos";
const API_URL_Coordinadores = "https://retoolapi.dev/EWVZu8/tbAdministradores";
const API_URL_ServiciosVigentes = "https://retoolapi.dev/XqGGae/tbServicios_Vigentes";
const API_URL_IMGBB = "https://api.imgbb.com/1/upload?key=a4006c882382c9abcda6901d193c61fe";

const Alert_Error_Proyects = document.getElementById("Alert_Error_Proyects");
const Alert_Error_Coordinadores = document.getElementById("Alert_Error_Coordinadores");
const Alert_Error_Insert = document.getElementById("Alert_Error_Insert");
const Alert_OK_Proyecto = document.getElementById("Alert_OK_Proyecto");
const Proyectos_Vigentes_Div = document.getElementById("accordionFlushExample");
const Dialog_Insert_Update = document.getElementById("Dialog_Insert_Update");
const Title_Dialog = document.getElementById("Title_Dialog");
const Dialog_Proyecto_Id = document.getElementById("Dialog_Proyecto_Id");
const Dialog_Proyecto_Name = document.getElementById("Dialog_Proyecto_Name");
const Dialog_Proyecto_Concepto = document.getElementById("Dialog_Proyecto_Concepto");
const Dialog_Proyecto_Cupos = document.getElementById("Dialog_Proyecto_Cupos");
const Dialog_Proyecto_Icon = document.getElementById("Dialog_Proyecto_Icon");
const Dialog_Proyecto_Icon_Label = document.getElementById("Dialog_Proyecto_Icon_Label");
const Dialog_Proyecto_Img_Muestra = document.getElementById("Dialog_Proyecto_Img_Muestra");
const Dialog_Proyecto_Img_Muestra_Label = document.getElementById("Dialog_Proyecto_Img_Muestra_Label");
const btn_Guardar_Cambios = document.getElementById("btn_Guardar_Cambios");
const btn_Agregar_Proyecto = document.getElementById("btn_Agregar_Proyecto");
const btn_Cancelar_Dialog = document.getElementById("btn_Cancelar_Dialog");

async function Cargar_Proyectos() {
    try{
        const res = await fetch(`${API_URL_Proyectos}?Vigencia_Proyecto=1`);
        const data = await res.json();
        Rellenar_Proyectos(data);
    } catch(err) {
        console.error('Error al cargar datos' , err);
        Alert_Error_Proyects.hidden = false;
        setTimeout(() => {
            Alert_Error_Proyects.hidden = true;       
        }, 3000)
    }
}
async function Buscar_Coordinadores(Proyecto) {
    try{
        const res = await fetch(`${API_URL_Coordinadores}?Proyecto_Asignado=${Proyecto}&Estado_Admin=2`);
        if(!(res.ok)){
            console.error(`Error HTTP: ${res.status}`);
            return(null);
        }
        const data = await res.json();
        return(data);
    } catch(err){
        console.error('Error al cargar datos' , err);
        Alert_Error_Coordinadores.hidden = false;
        return(null);
        setTimeout(() => {
            Alert_Error_Coordinadores.hidden = true;
        }, 3000)
    }
}
async function Buscar_Servicios(Proyecto) {
    try{
        const res = await fetch(`${API_URL_ServiciosVigentes}?Nombre_Proyecto=${Proyecto}`)
        const data = await res.json();
        return(data);
    }catch(err){
        console.error('Error al cargar datos' , err);
    }
}
async function Rellenar_Proyectos(Proyectos){
    Proyectos_Vigentes_Div.innerHTML = '';

    Proyectos.forEach(async (Proyecto, index) => {
        const Index_ID = `flush-collapse${index}`;
        const Encabezado_ID = `flush-heading-${index}`;

        let DIV_Proyecto = `
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed Proyectos_Center" type="button" data-bs-toggle="collapse" data-bs-target="#${Index_ID}" aria-expanded="false" aria-controls="${Index_ID}">${Proyecto.Nombre_Proyecto}</button>
            </h2>
            <div id="${Index_ID}" class="accordion-collapse collapse" aria-labelledby="${Encabezado_ID}" data-bs-parent="#accordionFlushExample">
                    <div class="accordion-body">
                        <div class="Div_Info2">
                            <div class="Proyectos_Info_div">
                                <label class="Label_IMG">Icono de Proyecto:
                                    <img src="${Proyecto.Icono_Proyecto}" alt="Icono del Proyecto" class="IMG_Icon_Proyecto">
                                </label>
                                <label class="Label_IMG">Imagen de muestra:
                                    <img src="${Proyecto.Img_Muestra}" alt="Imagen de muestra de ${Proyecto.Nombre_Proyecto}" class="IMG_Muestra_Proyecto">
                                </label>
                            </div>
                            <div class="Proyectos_Info_div Info_Proyectos" style="width: 50%;">
                                <label>Descripcion Proyecto:
                                    <textarea readonly>${Proyecto.Concepto_Proyecto}</textarea>
                                </label>
                                <div class="Div_secondary">
                                    <label>Cupos Proyectos
                                        <input type="number" readonly value="${Proyecto.Cupos_Proyectos}">
                                    </label>
        `;

        let Servicios = await Buscar_Servicios(Proyecto.Nombre_Proyecto);
        let Cupos_Usados = Servicios.length;
        Cupos_disponibles = Proyecto.Cupos_Proyectos - Cupos_Usados;
        DIV_Proyecto += `
                                    <label>Cupos Disponibles
                                        <input type="number" readonly value="${Cupos_disponibles}">
                                    </label>
                                </div>
                                <div class="Div_secondary">
                                    <button type="button" style="background-color: rgb(185, 129, 24);" onClick="Editar_Proyecto(${Proyecto.id}, '${Proyecto.Nombre_Proyecto}', '${Proyecto.Concepto_Proyecto}', ${Proyecto.Cupos_Proyectos}, '${Proyecto.Icono_Proyecto}', '${Proyecto.Img_Muestra}')">Actualizar</button>
                                    <button type="button" style="background-color: brown;">Deshabilitar Proyecto</button>
                                </div>
                            </div>
                        </div>
                    <hr>
                    <h2 class="Coordinadores_Asignados">COORDINADORES ASIGNADOS:</h2>
        `;
        
        const Coordinadores = await Buscar_Coordinadores(Proyecto.Nombre_Proyecto);
        if(Array.isArray(Coordinadores) && Coordinadores.length > 0){
            Coordinadores.forEach(Coordinador => {
                DIV_Proyecto += `
                    <div class="Card-Coordinador">
                        <img src="${Coordinador.Foto_Perfil}" alt="Foto del Coordinador ${Coordinador.Nombre_Administrador} ${Coordinador.Apellido_Administrador}">
                        <hr>
                        <h2>${Coordinador.Nombre_Administrador} ${Coordinador.Apellido_Administrador}</h2>
                        <hr>
                        <h3>${Coordinador.Correo_Electronico}</h3>
                    </div>
                `
            });
        }else{
            DIV_Proyecto += `
            <h2>No hay coordinadores aun</h2>
            `;
        }
        DIV_Proyecto += `
                        </div>
                    </div>
                </div>
            `;

        Proyectos_Vigentes_Div.innerHTML += DIV_Proyecto
    });
}
Dialog_Proyecto_Icon.addEventListener('change', (e) => {
    if(e.target.files[0]){
        Dialog_Proyecto_Icon_Label.textContent = e.target.files[0].name;
    }else{
        Dialog_Proyecto_Icon_Label.textContent = 'Seleccionar Imagen de Icono:';
    }
});
Dialog_Proyecto_Img_Muestra.addEventListener('change', (e) => {
    if(e.target.files[0]){
        Dialog_Proyecto_Img_Muestra_Label.textContent = e.target.files[0].name;
    }else{
        Dialog_Proyecto_Img_Muestra_Label.textContent = 'Seleccionar Imagen de Muestra:';
    }
});
btn_Agregar_Proyecto.addEventListener('click', () => {
    body.style.filter = "blur(6px)";
    Title_Dialog.textContent = 'Agregar Proyecto';
    Dialog_Insert_Update.showModal();
});
function LimpiarDialog(){
    Dialog_Proyecto_Id.value = '';
    Dialog_Proyecto_Name.value = '';
    Dialog_Proyecto_Concepto.value = '';
    Dialog_Proyecto_Cupos.value = '';
    Dialog_Proyecto_Icon.value = '';
    Dialog_Proyecto_Icon_Label.textContent = 'Seleccionar Imagen de Icono:';
    Dialog_Proyecto_Img_Muestra.value = '';
    Dialog_Proyecto_Img_Muestra_Label.textContent = 'Seleccionar Imagen de Muestra:';
}
Dialog_Insert_Update.addEventListener('cancel', (e) => {
    LimpiarDialog();
    body.style.filter = "blur(0px)";
    Dialog_Insert_Update.close();
});
btn_Cancelar_Dialog.addEventListener('click', () => {
    LimpiarDialog();
    body.style.filter = "blur(0px)";
    Dialog_Insert_Update.close();
});
async function subirImagen(file) {
  const fd = new FormData();
  fd.append('image', file);
  try{
    const res = await fetch(API_URL_IMGBB, { method: 'POST', body: fd });
    const obj = await res.json();
    return obj.data.url;
  }catch(err){
        console.error('Error al subir datos' , err);
        Alert_Error_Insert.hidden = false;
        setTimeout(() => {
            Alert_Error_Insert.hidden = true;       
        }, 3000)
  }
}
async function Agregar_Nuevo_Proyecto(Proyecto_New) {
    try{
        const respuesta = await fetch(API_URL_Proyectos, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Proyecto_New)
            });
            if(respuesta.ok){
                Alert_OK_Proyecto.hidden = false;
                setTimeout(() => {
                    Alert_OK_Proyecto.hidden = true;
                }, 3000);
            }
            else{
                const error = await respuesta.text();
                Alert_Error_Insert.hidden = false;
                setTimeout(() => {
                    Alert_Error_Insert.hidden = true;
                }, 3000);
            }
    }catch(err){
        console.error('Error al cargar datos' , err);
        Alert_Error_Insert.hidden = false;
        setTimeout(() => {
            Alert_Error_Insert.hidden = true;
        }, 3000);
    }
}
async function Actualizar_Proyecto(Proyecto, ID) {
    try{
        const respuesta = await fetch(`${API_URL_Proyectos}/${ID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Proyecto)
            });
            if(respuesta.ok){
                Alert_OK_Proyecto.hidden = false;
                setTimeout(() => {
                    Alert_OK_Proyecto.hidden = true;
                }, 3000);
            }
            else{
                const error = await respuesta.text();
                Alert_Error_Insert.hidden = false;
                setTimeout(() => {
                    Alert_Error_Insert.hidden = true;
                }, 3000);
            }
    } catch(err) {
        console.error('Error al cargar datos' , err);
        Alert_Error_Insert.hidden = false;
        setTimeout(() => {
            Alert_Error_Insert.hidden = true;
        }, 3000);
    }
}
function Editar_Proyecto(id, name, concepto, cupos, icon_url, img_url) {
    Dialog_Proyecto_Id.value = id;
    Dialog_Proyecto_Name.value = name;
    Dialog_Proyecto_Concepto.value = concepto;
    Dialog_Proyecto_Cupos.value = cupos;
    Dialog_Proyecto_Icon_Label.textContent = icon_url;
    Dialog_Proyecto_Img_Muestra_Label.textContent = img_url;

    body.style.filter = "blur(6px)";
    Title_Dialog.textContent = 'Actualizar Proyecto';
    Dialog_Insert_Update.showModal();
}
btn_Guardar_Cambios.addEventListener('click', async () => {
    let Nombre = Dialog_Proyecto_Name.value.trim();
    let Concepto= Dialog_Proyecto_Concepto.value.trim();
    let Cupos = Dialog_Proyecto_Cupos.value.trim();
    let id = Dialog_Proyecto_Id.value.trim();

    if(id == ''){
        if(!Nombre || !Concepto || !Cupos || !Dialog_Proyecto_Img_Muestra.value || !Dialog_Proyecto_Icon.value){
        alert("Primero completa todos los campos");
        return;
        }  

        let Icon_URL = await subirImagen(Dialog_Proyecto_Icon.files[0]);
        let Img_Muestra_URL = await subirImagen(Dialog_Proyecto_Img_Muestra.files[0]);

        const Proyecto_New = {
            "Img_Muestra": Img_Muestra_URL,
            "Icono_Proyecto": Icon_URL,
            "Cupos_Proyectos": Cupos,
            "Nombre_Proyecto": Nombre,
            "Concepto_Proyecto": Concepto,
            "Vigencia_Proyecto": 1
            }
        Agregar_Nuevo_Proyecto(Proyecto_New);
        LimpiarDialog();
        body.style.filter = "blur(0px)";    
        Dialog_Insert_Update.close();
        Cargar_Proyectos();

    }else{

        if(!Nombre || !Concepto || !Cupos){
            alert("Primero completa todos los campos");
            return;
        }else if((!(Dialog_Proyecto_Icon.value) && (Dialog_Proyecto_Icon_Label.textContent == 'Seleccionar Imagen de Icono:')) || (!(Dialog_Proyecto_Img_Muestra.value) && (Dialog_Proyecto_Img_Muestra_Label.textContent == 'Seleccionar Imagen de Muestra:'))){
            alert("Primero completa todos los campos | Selecciona imagenes del proyecto");
            return;
        }

        let Icon_URL;
        let Img_Muestra_URL;

        if((!(Dialog_Proyecto_Icon.value) && (Dialog_Proyecto_Icon_Label.textContent != 'Seleccionar Imagen de Icono:')) || (!(Dialog_Proyecto_Img_Muestra.value) && (Dialog_Proyecto_Img_Muestra_Label != 'Seleccionar Imagen de Muestra:'))){
            Img_Muestra_URL = Dialog_Proyecto_Img_Muestra_Label.textContent;
            Icon_URL = Dialog_Proyecto_Icon_Label.textContent;
        }else{
            Icon_URL = await subirImagen(Dialog_Proyecto_Icon.files[0]);
            Img_Muestra_URL = await subirImagen(Dialog_Proyecto_Img_Muestra.files[0]);
        }

        const Proyecto_Update = {
            "Img_Muestra": Img_Muestra_URL,
            "Icono_Proyecto": Icon_URL,
            "Cupos_Proyectos": Cupos,
            "Nombre_Proyecto": Nombre,
            "Concepto_Proyecto": Concepto,
            "Vigencia_Proyecto": 1
        }
        Actualizar_Proyecto(Proyecto_Update, id)
        LimpiarDialog();
        body.style.filter = "blur(0px)";    
        Dialog_Insert_Update.close();
        Cargar_Proyectos();   
    }
});
function CargaInicialProyectos(){
    Cargar_Proyectos();
    Alert_Error_Proyects.hidden = true;
    Alert_Error_Coordinadores.hidden = true;
    Alert_Error_Insert.hidden = true;
    Alert_OK_Proyecto.hidden = true;
}

window.addEventListener('DOMContentLoaded', CargaInicialProyectos);