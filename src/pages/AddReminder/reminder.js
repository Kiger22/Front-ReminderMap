
import { addReminder } from '../../functions/addReminder';
import { verifyLabels } from '../../functions/verifyLabels';
import { getPlaces } from '../../functions/getPlaces';
import { placePage } from '../AddPlace/place';

import('./reminder.css');

// Crear formulario de recordatorio
export const reminderPageForm = async (node) => {
  // Limpiar el contenido del nodo para evitar duplicados
  node.innerHTML = "";

  // Verificar si ya existe un formulario de recordatorio en el nodo
  if (node.querySelector('.reminder-form')) {
    console.log("El formulario ya está abierto.");
    return;
  }

  // Obtener lugares guardados
  const places = await getPlaces();

  // Crear contenedor principal del formulario de recordatorio
  const reminderForm = document.createElement('div');
  reminderForm.classList.add('reminder-form');

  const reminderContainer = document.createElement('form');
  reminderContainer.classList.add('reminder-container');

  // Contenedor para los campos del formulario
  const fieldsContainer = document.createElement('div');
  fieldsContainer.classList.add('fields-container');

  // Función para crear cada campo del formulario
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

      // Opción por defecto
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = '-- Seleccione un lugar --';
      input.appendChild(defaultOption);

      // Opción para agregar nuevo lugar
      const newPlaceOption = document.createElement('option');
      newPlaceOption.value = 'new';
      newPlaceOption.textContent = '+ Agregar nuevo lugar';
      input.appendChild(newPlaceOption);

      // Agregar lugares existentes
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

      // Evento change para manejar la selección
      input.addEventListener('change', (e) => {
        if (e.target.value === 'new') {
          // Abrir formulario de nuevo lugar
          const hero = document.querySelector('.hero-container');
          placePage(hero);
          // Resetear el select
          setTimeout(() => {
            e.target.value = '';
          }, 100);
        }
      });
    } else {
      input = document.createElement('input');
      input.type = inputType;
      input.id = inputId;
      input.name = inputName;
    }

    if (isRequired) input.required = true;

    span.appendChild(label);
    span.appendChild(input);
    return span;
  };

  // Agregar cada campo al contenedor de campos
  fieldsContainer.appendChild(createField('Titulo', 'text', 'reminder-name', 'title', true));
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
      `
  addButton.addEventListener('click', async (event) => {
    event.preventDefault();
    await addReminder();
  });

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
  closeButton.className = 'button';
  closeButton.innerHTML = `
      <span class="transition"></span>
      <span class="gradient"></span>
      <span class="label">Cancelar</span>
      `
  closeButton.addEventListener('click', () => {
    reminderForm.remove();
  });

  // Añadir los botones al contenedor de botones
  buttonsContainer.appendChild(addButton);
  buttonsContainer.appendChild(resetButton);
  buttonsContainer.appendChild(closeButton);

  // Agregar los contenedores de campos y botones al formulario
  reminderContainer.appendChild(fieldsContainer);
  reminderContainer.appendChild(buttonsContainer);
  reminderForm.appendChild(reminderContainer);
  node.appendChild(reminderForm);
  verifyLabels();
};


