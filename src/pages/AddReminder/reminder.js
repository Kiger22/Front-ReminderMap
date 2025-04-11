
import { addReminder } from '../../functions/reminders/addReminder';
import { verifyLabels } from '../../functions/navigation/verifyLabels';
import { getPlaces } from '../../functions/places/getPlaces';
import { AlertNotification } from '../../components/AlertNotification/notification';
import { goToHomePage } from '../../functions/navigation/goHomePage';
import { Calendar } from '../../components/Calendar/calendar';
import { createField } from "../../utils/formUtils";

import('./reminder.css');

// Función para crear el formulario de recordatorio
export const reminderPageForm = async (node, selectedDate = null, fromCalendar = false) => {
  node.innerHTML = '';

  // Creamos el formulario
  const reminderForm = document.createElement('div');
  reminderForm.classList.add('reminder-form');

  // Agregamos el título similar al de place.js
  const title = document.createElement('h2');
  title.textContent = 'Crea un recordatorio para tus lugares favoritos...';
  reminderForm.appendChild(title);

  const formContainer = document.createElement('form');
  formContainer.classList.add('reminder-container');
  formContainer.style.display = 'flex';

  // Configuramos fecha y hora predeterminadas
  const now = new Date();
  let defaultDate = now;

  // Verificamos si selectedDate es válido y lo convertimos a objeto Date si es necesario
  if (selectedDate) {
    try {
      // Si es string, intentamos convertirlo a Date
      if (typeof selectedDate === 'string') {
        defaultDate = new Date(selectedDate);
      }
      // Si ya es un objeto Date, lo usamos directamente
      else if (selectedDate instanceof Date) {
        defaultDate = selectedDate;
      }

      // Verificamos que sea una fecha válida
      if (isNaN(defaultDate.getTime())) {
        console.warn('Fecha seleccionada inválida, usando fecha actual');
        defaultDate = now;
      }
    } catch (error) {
      console.error('Error al procesar la fecha seleccionada:', error);
      defaultDate = now;
    }
  }

  // Añadimos 10 minutos a la hora actual
  const defaultTime = new Date(now.getTime() + 10 * 60000);

  // Formateamos la fecha para el input date (YYYY-MM-DD)
  const formattedDate = defaultDate.toISOString().split('T')[0];

  // Formateamos la hora para el input time (HH:MM)
  const hours = defaultTime.getHours().toString().padStart(2, '0');
  const minutes = defaultTime.getMinutes().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;

  let placesOptions = [];
  try {
    const placesData = await getPlaces();

    // Convertimos los lugares al formato esperado por createField
    placesOptions = placesData.map(place => ({
      value: place.location,
      label: place.name,
      _id: place._id
    }));

    // Verificamos si hay un lugar seleccionado previamente
    const savedPlace = localStorage.getItem('selectedPlace');
    if (savedPlace) {
      const place = JSON.parse(savedPlace);
      if (!placesOptions.find(p => p._id === place.id)) {
        placesOptions.unshift({
          value: place.location,
          label: place.name,
          _id: place.id
        });
      }
      // Limpiamos el localStorage después de usar el lugar
      localStorage.removeItem('selectedPlace');
    }
  } catch (error) {
    console.error('Error al obtener lugares:', error);
    placesOptions = [];
  }

  // Siempre añadimos la opción para crear un nuevo lugar
  placesOptions.push({
    value: 'new',
    label: '➕ Añadir nuevo lugar',
    _id: 'new'
  });

  const fieldsContainer = document.createElement('div');
  fieldsContainer.classList.add('fields-container');

  // Agregamos los campos al contenedor con valores predeterminados
  fieldsContainer.appendChild(createField('Recordatorio', 'text', 'reminder-name', 'name', true));
  fieldsContainer.appendChild(createField('Descripción', 'text', 'reminder-description', 'description', true));

  // Añadimos la fecha con valor predeterminado
  const dateField = createField('Cuando', 'date', 'reminder-date', 'date');
  const dateInput = dateField.querySelector('input[type="date"]');
  if (dateInput) {
    dateInput.value = formattedDate;
  }
  fieldsContainer.appendChild(dateField);

  // Añadimos la hora con valor predeterminado
  const timeField = createField('A que hora', 'time', 'reminder-time', 'time');
  const timeInput = timeField.querySelector('input[type="time"]');
  if (timeInput) {
    timeInput.value = formattedTime;
  }
  fieldsContainer.appendChild(timeField);

  const locationField = createField('Donde', 'select', 'reminder-location', 'location', false, placesOptions);
  fieldsContainer.appendChild(locationField);

  // Contenedor para los botones
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons-container');

  const addButton = document.createElement('button');
  addButton.type = 'submit';
  addButton.className = 'button';
  addButton.innerHTML = `
      <span class="transition"></span>
      <span class="gradient"></span>
      <span class="label">Añadir</span>
      `;

  const resetButton = document.createElement('button');
  resetButton.type = 'reset';
  resetButton.className = 'button';
  resetButton.innerHTML = `
      <span class="transition"></span>
      <span class="gradient"></span>
      <span class="label">Limpiar</span>
      `
  resetButton.addEventListener('click', (event) => {
    event.preventDefault();
    formContainer.reset();
  });

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'button';
  closeButton.innerHTML = `
      <span class="transition"></span>
      <span class="gradient"></span>
      <span class="label">Cancelar</span>
  `;

  closeButton.addEventListener('click', async () => {
    // Limpiamos los datos temporales
    localStorage.removeItem('tempReminderData');
    localStorage.removeItem('newCreatedPlace');

    if (fromCalendar) {
      // Si venimos del calendario, volvemos a mostrar el calendario
      const heroContainer = document.querySelector('.hero-container');
      if (heroContainer) {
        heroContainer.innerHTML = '';
        await Calendar(heroContainer); // Llamamos directamente al componente Calendar
      }
    } else {
      // Si no, volvemos a la página principal
      goToHomePage();
    }
  });

  // Agregamos los botones al contenedor de botones
  buttonsContainer.appendChild(addButton);
  buttonsContainer.appendChild(resetButton);
  buttonsContainer.appendChild(closeButton);

  // Estructura correcta del formulario
  formContainer.appendChild(fieldsContainer);
  formContainer.appendChild(buttonsContainer);
  reminderForm.appendChild(formContainer);
  node.appendChild(reminderForm);

  // Event listener del formulario
  formContainer.addEventListener('submit', async (event) => {
    event.preventDefault();

    const dateInput = document.getElementById('reminder-date');
    const timeInput = document.getElementById('reminder-time');
    const selectedDate = new Date(`${dateInput.value}T${timeInput.value}`);
    const now = new Date();

    if (selectedDate < now) {
      AlertNotification(
        'Fecha inválida',
        'No puedes crear recordatorios en el pasado',
        null,
        { showCancelButton: false }
      );
      return;
    }

    AlertNotification(
      'Confirmar',
      '¿Deseas crear este recordatorio?',
      async (confirmed) => {
        if (confirmed) {
          try {
            const result = await addReminder();

            // Si venimos del calendario, volvemos a él
            if (fromCalendar) {
              console.log('Volviendo al calendario...');
              const heroContainer = document.querySelector('.hero-container');
              if (heroContainer) {
                heroContainer.innerHTML = '';
                await Calendar(heroContainer);
              }
            } else {
              // Si no, vamos a la página principal
              goToHomePage();
            }
          } catch (error) {
            console.error('Error al crear recordatorio:', error);
          }
        }
      },
      { showCancelButton: true }
    );
  });

  setTimeout(() => {
    localStorage.removeItem('tempReminderData');
    localStorage.removeItem('newCreatedPlace');
    localStorage.removeItem('lastCreatedPlaceId');
  }, 100);

  verifyLabels();

  // Añadimos el event listener para detectar cuando se selecciona "Añadir nuevo lugar"
  setTimeout(() => {
    const locationSelect = document.getElementById('reminder-location');
    if (locationSelect) {
      locationSelect.addEventListener('change', async (event) => {
        if (event.target.value === 'new') {
          // Guardamos temporalmente los datos del formulario actual
          const nameInput = document.getElementById('reminder-name');
          const descriptionInput = document.getElementById('reminder-description');
          const dateInput = document.getElementById('reminder-date');
          const timeInput = document.getElementById('reminder-time');

          if (nameInput && descriptionInput && dateInput && timeInput) {
            localStorage.setItem('tempReminderData', JSON.stringify({
              name: nameInput.value,
              description: descriptionInput.value,
              date: dateInput.value,
              time: timeInput.value
            }));
          }

          // Redirigimos a la página de añadir lugar
          const heroContainer = document.querySelector('.hero-container');
          if (heroContainer) {
            // Importamos dinámicamente el módulo de añadir lugar
            const { placePage } = await import('../../pages/AddPlace/place.js');
            placePage(heroContainer, true); // true indica que venimos de la página de recordatorio
          }
        }
      });
    }
  }, 100);
};


