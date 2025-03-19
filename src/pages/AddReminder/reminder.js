
import { addReminder } from '../../functions/addReminder';
import { verifyLabels } from '../../functions/verifyLabels';
import { getPlaces } from '../../functions/getPlaces';
import { placePage } from '../AddPlace/place';
import { AlertNotification } from '../../components/AlertNotification/notification';
import { goToHomePage } from '../../functions/goHomePage';
import { Calendar } from '../../components/Calendar/calendar';

import('./reminder.css');

// Función para crear el formulario de recordatorio
export const reminderPageForm = async (node, selectedDate = null, fromCalendar = false) => {
  node.innerHTML = '';

  const reminderForm = document.createElement('form');
  reminderForm.classList.add('reminder-form');
  reminderForm.style.display = 'flex';

  let places = [];
  try {
    places = await getPlaces();
    const savedPlace = localStorage.getItem('newCreatedPlace');
    if (savedPlace) {
      const place = JSON.parse(savedPlace);
      if (!places.find(p => p._id === place._id)) {
        places.unshift(place);
      }
    }
  } catch (error) {
    console.error('Error al obtener lugares:', error);
    places = [];
  }

  const reminderContainer = document.createElement('div');
  reminderContainer.classList.add('reminder-container');

  const fieldsContainer = document.createElement('div');
  fieldsContainer.classList.add('fields-container');

  const createField = (labelText, inputType, inputId, inputName, isRequired = false, options = null) => {
    const span = document.createElement('span');
    span.classList.add('input-span');

    const label = document.createElement('label');
    label.setAttribute('for', inputId);
    label.textContent = labelText;

    let input;

    if (inputType === 'select') {
      input = document.createElement('select');
      input.id = inputId;
      input.name = inputName;

      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = '-- Seleccione un lugar --';
      input.appendChild(defaultOption);

      const newPlaceOption = document.createElement('option');
      newPlaceOption.value = 'new';
      newPlaceOption.textContent = '+ Agregar nuevo lugar';
      input.appendChild(newPlaceOption);

      if (options && options.length > 0) {
        const separator = document.createElement('option');
        separator.disabled = true;
        separator.textContent = '──────────────';
        input.appendChild(separator);

        options.forEach(place => {
          const option = document.createElement('option');
          option.value = place.location;
          option.textContent = `${place.name} (${place.location})`;
          input.appendChild(option);
        });
      }

      // Restaurar datos temporales
      const tempData = JSON.parse(localStorage.getItem('tempReminderData') || '{}');
      if (tempData[inputName]) {
        input.value = tempData[inputName];
      }

      // Verificar y seleccionar lugar recién creado
      const savedPlace = localStorage.getItem('newCreatedPlace');
      if (savedPlace) {
        const place = JSON.parse(savedPlace);
        input.value = place.location;
      }

      input.addEventListener('change', async (e) => {
        if (e.target.value === 'new') {
          // Guardar todos los datos del formulario actual
          const tempData = {
            name: document.getElementById('reminder-name').value,
            description: document.getElementById('reminder-description').value,
            date: document.getElementById('reminder-date').value,
            time: document.getElementById('reminder-time').value,
            location: document.getElementById('reminder-location').value
          };
          localStorage.setItem('tempReminderData', JSON.stringify(tempData));
          await placePage(node, true); // Aseguramos que fromReminder sea true
        }
      });
    } else {
      input = document.createElement('input');
      input.type = inputType;
      input.id = inputId;
      input.name = inputName;

      // Establecer valores por defecto para fecha y hora
      if (inputType === 'date') {
        const today = new Date();
        input.min = today.toISOString().split('T')[0];
        // Usar la fecha seleccionada si existe, si no usar la fecha actual
        input.value = selectedDate || today.toISOString().split('T')[0];
      }

      if (inputType === 'time') {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        input.value = `${hours}:${minutes}`;
      }

      // Modificar la restauración de datos temporales
      const tempData = JSON.parse(localStorage.getItem('tempReminderData') || '{}');
      if (tempData[inputName]) {
        if (inputType === 'date' && !selectedDate) { // Solo restaurar si no hay fecha seleccionada
          const tempDate = new Date(tempData[inputName]);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (tempDate >= today) {
            input.value = tempData[inputName];
          }
        } else if (inputType !== 'date') {
          input.value = tempData[inputName];
        }
      }
    }

    if (isRequired) input.required = true;

    span.appendChild(label);
    span.appendChild(input);
    return span;
  };

  // Agregar campos al contenedor
  fieldsContainer.appendChild(createField('Titulo', 'text', 'reminder-name', 'name', true));
  fieldsContainer.appendChild(createField('Descripción', 'text', 'reminder-description', 'description', true));
  fieldsContainer.appendChild(createField('Cuando', 'date', 'reminder-date', 'date'));
  fieldsContainer.appendChild(createField('Hora', 'time', 'reminder-time', 'time'));
  fieldsContainer.appendChild(createField('Lugar', 'select', 'reminder-location', 'location', false, places));

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
    reminderContainer.reset();
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
    // Limpiar datos temporales
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

  // Agregar los botones al contenedor de botones
  buttonsContainer.appendChild(addButton);
  buttonsContainer.appendChild(resetButton);
  buttonsContainer.appendChild(closeButton);

  // Estructura correcta del formulario
  reminderContainer.appendChild(fieldsContainer);
  reminderContainer.appendChild(buttonsContainer);
  reminderForm.appendChild(reminderContainer);
  node.appendChild(reminderForm);

  // Event listener del formulario
  reminderForm.addEventListener('submit', async (event) => {
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
          await addReminder();
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
};


