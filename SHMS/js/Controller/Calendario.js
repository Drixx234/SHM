//Espera que todo el contenido del HTML esté cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', function() {

    //VARIABLES GLOBALES
    let currentDate = new Date(); //Fecha actual para mostrar el mes
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || []; //Carga eventos desde localStorage
    let currentEventId = null; //ID del evento actualmente en edición

    //ELEMENTOS DEL DOM
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

    //INICIALIZACIÓN
    Guardar_Admin();
    renderCalendar(); //Renderiza el calendario al cargar
    updateClock();    //Muestra la hora actual
    setInterval(updateClock, 1000); //Actualiza el reloj cada segundo

    // EVENTOS DEL CALENDARIO
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1); //Ir al mes en el que estabamos
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1); //Ir al mes en el que estaremos
        renderCalendar();
    });

    todayBtn.addEventListener('click', () => {
        currentDate = new Date(); //Volver al mes en el que estamos
        renderCalendar();
    });

    eventDescription.addEventListener('input', () => {
        charCount.textContent = eventDescription.value.length; //Cuenta los caracteres ya escritos y los que se van escribiendo
    });

    eventForm.addEventListener('submit', handleEventSubmit); //Guardar evento
    deleteBtn.addEventListener('click', handleDeleteEvent);  //Eliminar evento
    closeBtn.addEventListener('click', closeModal);          //Cerrar modal (X)
    cancelBtn.addEventListener('click', closeModal);         //Cerrar modal (cancelar)

    //FUNCIONES
        function renderCalendar() {
        calendarDays.innerHTML = ''; //Limpiar los días anteriores

        const monthNames = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        currentMonthYear.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startDay = firstDay.getDay();

        const today = new Date();
        const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();

        //Días vacíos antes del primer día del mes (si no es domingo)
        for (let i = 0; i < startDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day empty';
            calendarDays.appendChild(emptyDay);
        }

        //Renderizar días del mes
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.innerHTML = `<div class="date">${i}</div><div class="events"></div>`;

            if (isCurrentMonth && i === today.getDate()) {
                dayElement.classList.add('today'); //Resaltar día actual
            }

            const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const dateString = formatDate(dayDate);

            //Mostrar eventos para este día
            const dayEvents = events.filter(event => event.date === dateString);
            const eventsContainer = dayElement.querySelector('.events');

            dayEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'event';
                eventElement.textContent = `${event.startTime} - ${event.title}`;
                eventElement.addEventListener('click', () => openEditModal(event));
                eventsContainer.appendChild(eventElement);
            });

            //Hacer clic en un día para abrir modal de nuevo evento
            dayElement.addEventListener('click', (e) => {
                if (e.target === dayElement || e.target.classList.contains('date') || e.target.classList.contains('events')) {
                    openNewModal(dayDate);
                }
            });

            calendarDays.appendChild(dayElement);
        }
    }

    function updateClock() {
        const now = new Date();  //Obtiene la fecha y hora actual
         //Extrae horas, minutos y segundos con formato de dos dígitos (ej: 09, 14)
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        // Muestra la hora actual en el elemento con ID 'real-time-clock'
        realTimeClock.textContent = `${hours}:${minutes}:${seconds}`;
    }
    // Función para abrir el modal con un nuevo evento
    function openNewModal(date) {
        currentEventId = null;  //Asegura que no se esté editando un evento existente
        document.getElementById('modal-title').textContent = 'Nuevo Evento'; //Cambia el título del modal
        deleteBtn.style.display = 'none';//Oculta el botón "Eliminar" en nuevos eventos

         //Formatea la fecha seleccionada para el campo de fecha
        const formattedDate = formatDateForInput(date);
        eventDate.value = formattedDate;

        // Establece hora de inicio y fin
        const now = new Date();
        const nextHour = now.getHours() + 1;
        startTime.value = `${String(nextHour).padStart(2, '0')}:00`;
        endTime.value = `${String(nextHour + 1).padStart(2, '0')}:00`;
        
        //Limpia los campos del formulo
        eventTitle.value = '';
        eventDescription.value = '';
        charCount.textContent = '0';//Reinicia el contador de caracteres

        eventModal.style.display = 'flex'; //Mostrar el modal
    }

    //Función para abrir el modal con un evento existente (modo edition)
    function openEditModal(event) {
        currentEventId = event.id;  //Guarda el ID del evento que se está editando
        document.getElementById('modal-title').textContent = 'Editar Evento'; //Cambia el título del modal
        deleteBtn.style.display = 'block'; //Muestra el botón "Eliminar"

        //Llena los campos del formulario con los datos del evento
        eventTitle.value = event.title;
        eventDate.value = event.date;
        startTime.value = event.startTime;
        endTime.value = event.endTime;
        eventDescription.value = event.description;
        charCount.textContent = event.description.length; //Muestra la cantidad de caracteres usados

        eventModal.style.display = 'flex'; //Mostrar modal con datos cargados
    }

    function closeModal() {
        eventModal.style.display = 'none'; //Ocultar modal
    }

    function handleEventSubmit(e) {
        e.preventDefault(); //Evitar que recargue la página

        const eventData = {
            id: currentEventId || Date.now().toString(),
            title: eventTitle.value,
            date: eventDate.value,
            startTime: startTime.value,
            endTime: endTime.value,
            description: eventDescription.value
        };

        if (currentEventId) {
            //Editar evento existente
            const index = events.findIndex(e => e.id === currentEventId);
            if (index !== -1) {
                events[index] = eventData;
            }
        } else {
            //Crear nuevo evento
            events.push(eventData);
        }

        localStorage.setItem('calendarEvents', JSON.stringify(events)); //Guardar en localStorage
        renderCalendar(); //Actualizar vista
        closeModal();     //Cerrar modal
    }

    function handleDeleteEvent() {
        if (currentEventId) {
            events = events.filter(event => event.id !== currentEventId);
            localStorage.setItem('calendarEvents', JSON.stringify(events));
            renderCalendar();
            closeModal();
        }
    }

    //Formatea fecha en formato YYYY-MM-DD
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function formatDateForInput(date) {
        return formatDate(date);
    }

    //Cerrar modal si se hace clic fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === eventModal) {
            closeModal();
        }
    });

});
