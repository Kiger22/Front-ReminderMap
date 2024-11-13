import { verifyLabels } from '../../functions/verifyLabels';

import('./reminder.css');

// Crear formulario de recordatorio
export const reminderPage = (node) => {
  // Limpiar el contenido del nodo para evitar duplicados
  node.innerHTML = "";

  // Verificar si ya existe un formulario de recordatorio en el nodo
  if (node.querySelector('.reminder-form')) {
    console.log("El formulario ya está abierto.");
    return;
  }

  // Crear contenedor principal del formulario de recordatorio
  const reminderForm = document.createElement('div');
  reminderForm.classList.add('reminder-form');

  const reminderContainer = document.createElement('form');
  reminderContainer.classList.add('reminder-container');

  // Contenedor para los campos del formulario
  const fieldsContainer = document.createElement('div');
  fieldsContainer.classList.add('fields-container');

  // Función para crear cada campo del formulario
  const createField = (labelText, inputType, inputId, inputName, isRequired = false, isIframe = false) => {
    const span = document.createElement('span');
    span.classList.add('input-span');

    const label = document.createElement('label');
    label.setAttribute('for', inputId);
    label.textContent = labelText;

    // Si es un iframe, se crea como iframe; de lo contrario, como input
    const input = isIframe
      ? document.createElement('iframe')
      : document.createElement('input');

    if (isIframe) {
      input.classList.add('iframe-address');
      input.src = ''; // Asigna la URL si fuera necesario
      input.frameBorder = '0';
      input.allowFullscreen = true;
    } else {
      input.type = inputType;
      input.id = inputId;
      input.name = inputName;
      if (isRequired) input.required = true;
    }

    span.appendChild(label);
    span.appendChild(input);
    return span;
  };

  // Agregar cada campo al contenedor de campos
  fieldsContainer.appendChild(createField('Titulo', 'text', 'title', 'title', true));
  fieldsContainer.appendChild(createField('Descripción', 'text', 'description', 'description', true));
  fieldsContainer.appendChild(createField('Cuando', 'date', 'date', 'date'));
  fieldsContainer.appendChild(createField('Categoria de sitio', 'text', 'category', 'category'));
  fieldsContainer.appendChild(createField('Radio', 'number', 'ratio', 'ratio'));
  fieldsContainer.appendChild(createField('Dirección', '', 'address', 'address', false, true));

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


