import { addPlace } from '../../functions/addPlace';
import { getCategories } from '../../functions/getCategory';
import { verifyLabels } from '../../functions/verifyLabels';

import('./place.css');

export const placePage = async (node, fromReminder = false) => {
  console.log('placePage called with fromReminder:', fromReminder); // Debug log

  // Limpiamos el contenido existente
  const existingContent = node.querySelector('.place-form, .reminder-form');
  if (existingContent) {
    existingContent.remove();
  }

  node.innerHTML = '';

  const placeForm = document.createElement('div');
  placeForm.classList.add('place-form');

  const title = document.createElement('h2');
  title.textContent = 'Agrega tus sitios frecuentes para poder utilizarlos mejor...';
  placeForm.appendChild(title);

  const placeContainer = document.createElement('form');
  placeContainer.classList.add('place-container');

  // Guardamos fromReminder en un data attribute
  placeContainer.dataset.fromReminder = fromReminder;

  // Evento submit del formulario
  placeContainer.addEventListener('submit', async (e) => {
    e.preventDefault();
    const isFromReminder = e.target.dataset.fromReminder === 'true';
    console.log('Form submitted with fromReminder:', isFromReminder); // Debug log
    await addPlace(isFromReminder);
  });

  const createField = (labelText, inputType, inputId, inputName, isRequired = false, options = []) => {
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

      // Agregar opción placeholder
      const placeholderOption = document.createElement('option');
      placeholderOption.textContent = 'Selecciona Categoría';
      placeholderOption.value = '';
      placeholderOption.disabled = true;
      placeholderOption.selected = true;
      input.appendChild(placeholderOption);
      if (isRequired) input.required = true;

      options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        input.appendChild(optionElement);
      });
    } else {
      input = document.createElement('input');
      input.type = inputType;
      input.id = inputId;
      input.name = inputName;
      if (isRequired) input.required = true;
    }
    span.appendChild(label);
    span.appendChild(input);
    return span;
  };

  const fieldsWrapper = document.createElement('div');
  fieldsWrapper.classList.add('fields-wrapper');

  const fields = [
    {
      label: 'Nombre del lugar',
      type: 'text',
      id: 'place-name',           // ID coincide con addPlace.js
      name: 'name',
      required: true
    },
    {
      label: 'Categoría',
      type: 'select',
      id: 'place-category',       // ID coincide con addPlace.js
      name: 'category',
      required: true
    },
    {
      label: 'Descripción',
      type: 'text',
      id: 'place-description',    // ID coincide con addPlace.js
      name: 'description',
      required: false
    },
    {
      label: 'Ubicación',
      type: 'text',
      id: 'location',             // ID coincide con addPlace.js
      name: 'location',
      required: true
    }
  ];

  const categories = await getCategories();

  fields.forEach(field => {
    const fieldElement = createField(field.label, field.type, field.id, field.name, field.required, field.type === 'select' ? categories : []);
    fieldsWrapper.appendChild(fieldElement);
  });

  placeContainer.appendChild(fieldsWrapper);

  const divButtons = document.createElement('div');
  divButtons.classList.add('buttons');

  const createButton = (buttonText, buttonType) => {
    const button = document.createElement('button');
    button.type = buttonType;
    button.className = 'button';
    button.innerHTML = `
      <span class="transition"></span>
      <span class="gradient"></span>
      <span class="label">${buttonText}</span>
    `;
    return button;
  };

  // Crear botón de submit
  const submitButton = createButton('Guardar Lugar', 'submit');

  // Crear botón de reset
  const resetButton = createButton('Limpiar', 'reset');
  resetButton.addEventListener('click', () => {
    placeContainer.reset();
  });

  // Crear botón de cancelar
  const cancelButton = createButton('Cancelar', 'button');
  cancelButton.addEventListener('click', () => {
    placeForm.remove();
    if (fromReminder && existingReminderForm) {
      existingReminderForm.style.display = 'flex';
    }
  });

  // Añadir los botones en el orden correcto
  divButtons.appendChild(submitButton);
  divButtons.appendChild(resetButton);
  divButtons.appendChild(cancelButton);

  placeContainer.appendChild(divButtons);
  placeForm.appendChild(placeContainer);
  node.appendChild(placeForm);
  verifyLabels();
};


