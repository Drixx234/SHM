const logData = [
    {
        id: 1,
        timestamp: "2023-05-15T09:30:15",
        profilePic: "JD",
        firstName: "Juan",
        lastName: "Díaz",
        changeType: "aceptacion",
        changeDetails: "Aceptó al alumno Carlos Gómez en la comisión de Matemáticas Avanzadas",
        commission: "Matemáticas Avanzadas"
    },
    {
        id: 2,
        timestamp: "2023-05-15T11:45:22",
        profilePic: "MP",
        firstName: "María",
        lastName: "Pérez",
        changeType: "rechazo",
        changeDetails: "Rechazó al alumno Luis Fernández de la comisión de Literatura",
        commission: "Literatura"
    },
    {
        id: 3,
        timestamp: "2023-05-15T14:20:10",
        profilePic: "RM",
        firstName: "Roberto",
        lastName: "Martínez",
        changeType: "actividad",
        changeDetails: "Agregó la actividad 'Trabajo práctico sobre ecuaciones' para el día 20/05/2023",
        activityDate: "20/05/2023"
    },
    {
        id: 4,
        timestamp: "2023-05-16T08:15:33",
        profilePic: "AG",
        firstName: "Ana",
        lastName: "González",
        changeType: "evento",
        changeDetails: "Agregó el evento 'Reunión de padres' para el día 25/05/2023 a las 18:00",
        eventDate: "25/05/2023"
    },
    {
        id: 5,
        timestamp: "2023-05-16T10:30:45",
        profilePic: "JD",
        firstName: "Juan",
        lastName: "Díaz",
        changeType: "aceptacion",
        changeDetails: "Aceptó al alumno Sofía Ramírez en la comisión de Física",
        commission: "Física"
    },
    {
        id: 6,
        timestamp: "2023-05-16T13:15:28",
        profilePic: "MP",
        firstName: "María",
        lastName: "Pérez",
        changeType: "actividad",
        changeDetails: "Agregó la actividad 'Análisis de poesía' para el día 22/05/2023",
        activityDate: "22/05/2023"
    },
    {
        id: 7,
        timestamp: "2023-05-17T09:40:12",
        profilePic: "RM",
        firstName: "Roberto",
        lastName: "Martínez",
        changeType: "rechazo",
        changeDetails: "Rechazó al alumno Patricia López de la comisión de Matemáticas Avanzadas",
        commission: "Matemáticas Avanzadas"
    },
    {
        id: 8,
        timestamp: "2023-05-17T11:25:37",
        profilePic: "AG",
        firstName: "Ana",
        lastName: "González",
        changeType: "evento",
        changeDetails: "Agregó el evento 'Taller de orientación vocacional' para el día 30/05/2023 a las 16:00",
        eventDate: "30/05/2023"
    }
];
 
// Variables de paginación
let currentPage = 1;
const recordsPerPage = 4;
 
// Elementos del DOM
const logList = document.getElementById('logList');
const searchInput = document.getElementById('searchInput');
const typeFilter = document.getElementById('typeFilter');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');
 
// Formatear fecha y hora
function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    return {
        date: date.toLocaleDateString('es-ES'),
        time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
}
 
// Obtener clase CSS según el tipo de cambio
function getChangeClass(changeType) {
    switch(changeType) {
        case 'aceptacion': return 'change-accepted';
        case 'rechazo': return 'change-rejected';
        case 'actividad': return 'change-activity';
        case 'evento': return 'change-event';
        default: return '';
    }
}
 
// Mostrar registros en la lista
function displayLogs(data, page = 1) {
    logList.innerHTML = '';
    
    const startIndex = (page - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);
    
    if (paginatedData.length === 0) {
        logList.innerHTML = '<div class="log-item" style="justify-content: center;">No se encontraron registros</div>';
    } else {
        paginatedData.forEach(item => {
            const { date, time } = formatDateTime(item.timestamp);
            const changeClass = getChangeClass(item.changeType);
            
            const logItem = document.createElement('div');
            logItem.className = 'log-item';
            logItem.innerHTML = `
                <div class="profile-pic">${item.profilePic}</div>
                <div class="log-details">
                    <div class="user-name">${item.firstName} ${item.lastName}</div>
                    <div class="change-details ${changeClass}">${item.changeDetails}</div>
                    <div class="change-date">${date} a las ${time}</div>
                </div>
            `;
            logList.appendChild(logItem);
        });
    }
    
    // Actualizar controles de paginación
    updatePaginationControls(data.length, page);
}
 
// Actualizar controles de paginación
function updatePaginationControls(totalRecords, page) {
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    
    pageInfo.textContent = `Página ${page} de ${totalPages}`;
    prevBtn.disabled = page === 1;
    nextBtn.disabled = page === totalPages || totalPages === 0;
    
    currentPage = page;
}
 
// Filtrar datos según los criterios de búsqueda
function filterData() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedType = typeFilter.value;
    
    return logData.filter(item => {
        const matchesSearch = item.changeDetails.toLowerCase().includes(searchTerm) || 
                             `${item.firstName} ${item.lastName}`.toLowerCase().includes(searchTerm);
        const matchesType = selectedType ? item.changeType === selectedType : true;
        
        return matchesSearch && matchesType;
    });
}
 
// Event listeners
searchInput.addEventListener('input', () => {
    const filteredData = filterData();
    displayLogs(filteredData, 1);
});
 
typeFilter.addEventListener('change', () => {
    const filteredData = filterData();
    displayLogs(filteredData, 1);
});
 
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        const filteredData = filterData();
        displayLogs(filteredData, currentPage - 1);
    }
});
 
nextBtn.addEventListener('click', () => {
    const filteredData = filterData();
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);
    
    if (currentPage < totalPages) {
        displayLogs(filteredData, currentPage + 1);
    }
});
 
// Inicialización
displayLogs(logData);
 