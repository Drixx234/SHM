const APINOTI_URL = 'https://686223f996f0cc4e34b86e18.mockapi.io/tbNotificaciones';

const noti_Body = document.getElementById("Notifi-Body");
const btn_Noti = document.getElementById("Btn-Noti");

const Alert_Error_Notis = document.getElementById('Alert_Error_Notis');

async function CargarNoti() {
    try{
        const res = await fetch(APINOTI_URL);
        const data = await res.json();
        RellenarCuadro(data);
    } catch(err){
        console.error('Error al cargar datos' , err);
        Alert_Error_Notis.hidden = false;
        setTimeout(() => {
            Alert_Error_Notis.hidden = true;
        }, 3000)
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
    Alert_Error_Notis.hidden = true;
}

window.addEventListener('DOMContentLoaded', CargaInicialDashboard);