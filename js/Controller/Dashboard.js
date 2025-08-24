

const noti_Body = document.getElementById("Notifi-Body");
const btn_Noti = document.getElementById("Btn-Noti");

async function CargarNoti() {
    try{
        const res = await fetch(APINOTI_URL);
        const data = await res.json();
        RellenarCuadro(data);
    } catch(err){
        console.error('Error al cargar datos' , err);
            setTimeout(() => {
                Alert.fire({
                icon: "error",
                title: "¡NO SE PUDO CARGAR!",
                html: "Hubieron problemas al cargar las notificaciones.",
            });
        }, 3000)
    }
}

async function CargarEventos() {
    try{
        const res = await fetch();
        const data = await res.json();
        RellenarEventos
    }catch(err){
        console.error('Error al cargar datos', err);
        setTimeout(() => {
                Alert.fire({
                icon: "error",
                title: "¡NO SE PUDO CARGAR!",
                html: "Hubieron problemas al cargar las notificaciones.",
            });
        }, 5000)
    }
}

function RellenarCuadro(Notis){
    noti_Body.innerHTML = ` `;

    const NotisRecent = Notis.reverse().slice(0, 5);
    
    NotisRecent.forEach(Noti => {
        noti_Body.innerHTML += `
        <div class="cards">
            <div class="card-header">   
                <span class="card-name">${Noti.nameNoti}</span>
                <span class="card-date"><li>${Noti.dateNoti}</li></span>
            </div>
            <hr>
            <p class="card-info" id="card-info">${Noti.bodyNoti}</p>
        </div>
        `;
        })
}

function CargaInicialDashboard(){
    CargarNoti();
}

window.addEventListener('DOMContentLoaded', CargaInicialDashboard);