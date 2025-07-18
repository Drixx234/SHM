const API_URL_NOTI = 'https://686223f996f0cc4e34b86e18.mockapi.io/tbNotificaciones';

const Alert_Error_Notis = document.getElementById("Alert_Error_Notis");

async function Cargar_Notis_Nuevas(Vista){
    try{

    } catch(err) {
        console.error('Error al cargar datos' , err);
        Alert_Error_Notis.hidden = false;
    }
}

