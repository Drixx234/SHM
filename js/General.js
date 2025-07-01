const APIADMIN_URL = 'https://686223f996f0cc4e34b86e18.mockapi.io/tbAdministradores';

const btn_Profile = document.getElementById("btnPerson");
const btn_Menu = document.getElementById("btnMenu");
const dialog_profile = document.getElementById("Profile-content");
const body = document.getElementById("Body");
const btnActive = document.getElementsByClassName("Active-Btn");
const btnUnactive = document.getElementsByClassName("Unactive-Btn");

async function CargarProfile() {
    try{
        const res = await fetch(`${APIADMIN_URL}/1`);
        const data = await res.json();
        RellenarProfile(data);
    } catch(err){
        console.error('Error al cargar datos' , err);
        dialog_profile.innerHTML += `<h1>Error al cargar los datos</h1>`
    }    
}

function RellenarProfile(Profile){
    btn_Profile.title = `Perfil de ${Profile.nameAdmin} ${Profile.lastnameAdmin}`;

    dialog_profile.innerHTML = 
    dialog_profile.innerHTML += `
       <main>
             <article>
                <header class="Div-info">
                    <p>Nombre:</p>
                    <h1>${Profile.nameAdmin} ${Profile.lastnameAdmin}</h1>
                </header>
                <div class="Div-info">
                    <p>Proyecto Asignado:</p>
                    <h3>No hay proyecto Asignado</h3>
                </div>
                <div class="Div-info">
                    <p>Correo Institucional:</p>
                    <h3>${Profile.usersAdmin}</h3>
                </div>
                <div class="Div-info">
                    <p>Contraseña:</p>
                    <h3>${Profile.passwordAdmin}</h3>
                </div>
                </article>
                <article class="Article2">
                    <div>
                        <img src="${Profile.avatarAdmin}" alt="" class="Profile-image">
                        <div class="Div-rol">
                            <p>Rol:</p>
                            <h3>Administrador</h3>
                        </div>
                    </div>
                    <button>Cerrar Sesion</button>
                </article>
                <button class="Btn-Close" id="Btn-close"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x-icon lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg></button>
            </main>
    `;

    const btn_DialogClose = document.getElementById("Btn-close");
    
    btn_DialogClose.addEventListener('click', () => {
    body.style.filter = "blur(0px)";
    dialog_profile.close();
});
}

btn_Profile.addEventListener('click', () => {
    body.style.filter = "blur(6px)";
    dialog_profile.showModal();  
})

dialog_profile.addEventListener('cancel', (e) => {
    body.style.filter = "blur(0px)";
    dialog_profile.close();
});

function ocultarBotones(botones) {
    for (let i = 0; i < botones.length; i++) {
        botones[i].hidden = true;
    }
}

function mostrarBotones(botones) {
    for (let i = 0; i < botones.length; i++) {
        botones[i].hidden = false;
    }
}

function VisibilidadBotones(){
        if(window.innerWidth <= 960){
        ocultarBotones(btnActive);
        ocultarBotones(btnUnactive);
        btn_Menu.hidden = false;
    }else{
        mostrarBotones(btnActive);
        mostrarBotones(btnUnactive);
        btn_Menu.hidden = true;
    }
}

function CargaInicialGeneral(){
    CargarProfile();
    VisibilidadBotones();
}

window.addEventListener("resize", VisibilidadBotones);
window.addEventListener("DOMContentLoaded", CargaInicialGeneral);