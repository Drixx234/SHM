import{

}from "../Service/HorasSocialesService"

async function loadHorasSociales() {
    try {
        if (!user.codigo) return;

        const horasData = await horasService.obtenerHorasPorEstudiante(user.codigo);
        const horas = horasData.horas || 0;
        const porcentaje = horasData.porcentaje || 0;
        const horasFaltantes = 150 - horas;

        // Actualizar UI
        document.getElementById('horas-completadas').textContent = horas;
        document.getElementById('horas-faltantes').textContent = horasFaltantes;
        document.getElementById('percentage-text').textContent = `${porcentaje.toFixed(1)}%`;
        
        const progressBar = document.getElementById('progress-bar');
        progressBar.style.width = `${porcentaje}%`;
        progressBar.setAttribute('aria-valuenow', porcentaje);
        progressBar.textContent = `${porcentaje.toFixed(1)}%`;
        
        document.getElementById('progress-pie').style.setProperty('--percentage', `${porcentaje}%`);

    } catch (error) {
        console.error('Error al cargar horas sociales:', error);
        showError('horas-completadas', 'Error al cargar horas');
    }
}