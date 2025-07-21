const API_URL_ADMIN = "https://retoolapi.dev/EWVZu8/tbAdministradores";

const Alert_Error_Login_Incorrect = document.getElementById("Alert_Error_Login_Incorrect");
const Alert_Error_Login = document.getElementById("Alert_Error_Login");
const Alert_Correct_Login = document.getElementById("Alert_Correct_Login");

const email_Box = document.getElementById('email');
const password_Box = document.getElementById('password');

async function Buscar_Administrador(usuario, contrasenia) {
    try{
        const res = await fetch(`${API_URL_ADMIN}?Correo_Electronico=${usuario}&Contrasenia=${contrasenia}&Estado_Admin=2`);
        const data = await res.json();
        
        if (!res.ok) {
            console.error('Error al cargar datos' , err);
            Alert_Error_Login.hidden = false;
            setTimeout(() => {
                Alert_Error_Login.hidden = true;
            }, 3000)
            throw new Error(`Error HTTP: ${res.status}`);
        }

        return(data);
    } catch(err){
        console.error('Error al cargar datos' , err);
        Alert_Error_Login.hidden = false;
        setTimeout(() => {
            Alert_Error_Login.hidden = true;
        }, 3000)
        return(null);
    }
}
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = email_Box.value;
    const password = password_Box.value;
        
    let usuario = await Buscar_Administrador(email, password);
        
    if (!usuario || usuario.length === 0) {
        Alert_Error_Login_Incorrect.hidden = false;
        setTimeout(() => {
            Alert_Error_Login_Incorrect.hidden = true;
        }, 3000)
        email_Box.value = '';
        password_Box.value = '';
    }else{
        Alert_Correct_Login.hidden = false;
        let idAdmin = usuario[0].id;
        localStorage.setItem("id_admin", idAdmin);
        setTimeout(() => {
            Alert_Correct_Login.hidden = true;
            window.location.href = "Dashboard - Admin.html";
        }, 3000)
    }
});
function CargaInicialLogin(){
    Alert_Error_Login.hidden = true;
    Alert_Error_Login_Incorrect.hidden = true;
    Alert_Correct_Login.hidden = true;
}

window.addEventListener("DOMContentLoaded", CargaInicialLogin);