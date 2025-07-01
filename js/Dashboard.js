const APINOTI_URL = 'https://686223f996f0cc4e34b86e18.mockapi.io/tbNotificaciones';

const noti_Body = document.getElementById("Notifi-Body");
const btn_Noti = document.getElementById("Btn-Noti");

async function CargarNoti() {
    try{
        const res = await fetch(APINOTI_URL);
        const data = await res.json();
        RellenarCuadro(data);
    } catch(err){
        console.error('Error al cargar datos' , err);
        noti_Body.innerHTML = '<h3>Hubieron problemas para cargar las notificaciones</h3>'
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