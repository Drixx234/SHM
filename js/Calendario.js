document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let currentDate = new Date();
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || [];
    let currentEventId = null;
 
    // Elementos del DOM
    const calendarDays = document.getElementById('calendar-days');
    const currentMonthYear = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const todayBtn = document.getElementById('today');
    const realTimeClock = document.getElementById('real-time-clock');
    const eventModal = document.getElementById('event-modal');
    const eventForm = document.getElementById('event-form');
    const eventTitle = document.getElementById('event-title');
    const eventDate = document.getElementById('event-date');
    const startTime = document.getElementById('start-time');
    const endTime = document.getElementById('end-time');
    const eventDescription = document.getElementById('event-description');
    const charCount = document.getElementById('char-count');
    const deleteBtn = document.getElementById('delete-btn');
    const closeBtn = document.querySelector('.close-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
 
    // Inicialización
    renderCalendar();
    updateClock();
    setInterval(updateClock, 1000);
 
    // Event Listeners
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
 
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
 
    todayBtn.addEventListener('click', () => {
        currentDate = new Date();
        renderCalendar();
    });
 
    eventDescription.addEventListener('input', () => {
        charCount.textContent = eventDescription.value.length;
    });
 
    eventForm.addEventListener('submit', handleEventSubmit);
    deleteBtn.addEventListener('click', handleDeleteEvent);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
 
    // Funciones
    function renderCalendar() {
        // Limpiar calendario
        calendarDays.innerHTML = '';
 
        // Establecer el mes y año actual
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        currentMonthYear.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
 
        // Obtener primer día del mes y último día del mes
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
 
        // Obtener día de la semana del primer día (0-6, donde 0 es domingo)
        const startDay = firstDay.getDay();
 
        // Obtener día actual para resaltarlo
        const today = new Date();
        const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();
 
        // Añadir días vacíos al principio si el mes no comienza en domingo
        for (let i = 0; i < startDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day empty';
            calendarDays.appendChild(emptyDay);
        }
 
        // Añadir días del mes
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.innerHTML = `<div class="date">${i}</div><div class="events"></div>`;
 
            // Verificar si es el día actual
            if (isCurrentMonth && i === today.getDate()) {
                dayElement.classList.add('today');
            }
 
            // Crear fecha para este día
            const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const dateString = formatDate(dayDate);
 
            // Añadir eventos a este día
const dayEvents = events.filter(event => event.date === dateString);
            const eventsContainer = dayElement.querySelector('.events');
 
            dayEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'event';
                eventElement.textContent = `${event.startTime} - ${event.title}`;
                eventElement.addEventListener('click', () => openEditModal(event));
                eventsContainer.appendChild(eventElement);
            });
 
            // Añadir evento para crear nuevo evento
            dayElement.addEventListener('click', (e) => {
                if (e.target === dayElement || e.target.classList.contains('date') || e.target.classList.contains('events')) {
                    openNewModal(dayDate);
                }
            });
 
            calendarDays.appendChild(dayElement);
        }
    }
 
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        realTimeClock.textContent = `${hours}:${minutes}:${seconds}`;
    }
 
    function openNewModal(date) {
        currentEventId = null;
        document.getElementById('modal-title').textContent = 'Nuevo Evento';
deleteBtn.style.display = 'none';
        
        // Formatear fecha para el input
        const formattedDate = formatDateForInput(date);
        eventDate.value = formattedDate;
        
        // Establecer hora por defecto (próxima hora en punto)
        const now = new Date();
        const nextHour = now.getHours() + 1;
        startTime.value = `${String(nextHour).padStart(2, '0')}:00`;
        endTime.value = `${String(nextHour + 1).padStart(2, '0')}:00`;
        
        // Limpiar otros campos
        eventTitle.value = '';
        eventDescription.value = '';
        charCount.textContent = '0';
        
eventModal.style.display = 'flex';
    }
 
    function openEditModal(event) {
currentEventId = event.id;
        document.getElementById('modal-title').textContent = 'Editar Evento';
deleteBtn.style.display = 'block';
        
        // Llenar formulario con datos del evento
        eventTitle.value = event.title;
eventDate.value = event.date;
        startTime.value = event.startTime;
        endTime.value = event.endTime;
        eventDescription.value = event.description;
        charCount.textContent = event.description.length;
        
eventModal.style.display = 'flex';
    }
 
    function closeModal() {
eventModal.style.display = 'none';
    }
 
    function handleEventSubmit(e) {
        e.preventDefault();
        
        const eventData = {
            id: currentEventId || Date.now().toString(),
            title: eventTitle.value,
            date: eventDate.value,
            startTime: startTime.value,
            endTime: endTime.value,
            description: eventDescription.value
        };
        
        if (currentEventId) {
            // Actualizar evento existente
const index = events.findIndex(e => e.id === currentEventId);
            if (index !== -1) {
                events[index] = eventData;
            }
        } else {
            // Añadir nuevo evento
            events.push(eventData);
        }
        
        // Guardar en localStorage
        localStorage.setItem('calendarEvents', JSON.stringify(events));
        
        // Actualizar calendario y cerrar modal
        renderCalendar();
        closeModal();
    }
 
    function handleDeleteEvent() {
        if (currentEventId) {
events = events.filter(event => event.id !== currentEventId);
            localStorage.setItem('calendarEvents', JSON.stringify(events));
            renderCalendar();
            closeModal();
        }
    }
 
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
 
    function formatDateForInput(date) {
        return formatDate(date);
    }
 
    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === eventModal) {
            closeModal();
        }
    });
});