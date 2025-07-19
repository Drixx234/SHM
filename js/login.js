document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Datos quemados para prueba
    const validCredentials = {
        email: "admin@ricaldone.edu.sv",
        password: "Ricaldone2024"
    };
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if(email === validCredentials.email && password === validCredentials.password) {
        alert("Acceso concedido. Redirigiendo a SISTEMA DE GESTION DE HORAS SOCIALES..");
        window.location.href = "Dashboard - Admin.html"; 
    } else {
        alert("Credenciales incorrectas. Intente nuevamente.");
    }
});