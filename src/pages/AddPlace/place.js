import { verifyLabels } from '../../functions/verifyLabels';

import('./place.css')

export const placePage = (node) => {
  node.innerHTML = "";

  if (document.querySelector('.place-form')) return;

  const placeForm = document.createElement('div');
  placeForm.classList.add('place-form');

  const title = document.createElement('h2');
  title.textContent = 'Agrega tus sitios frecuentes para poder utilizarlos mejor...';
  placeForm.appendChild(title);

  const placeContainer = document.createElement('form');
  placeContainer.classList.add('place-container');


  const createField = (labelText, inputType, inputId, inputName, isRequired = false) => {
    const span = document.createElement('span');
    span.classList.add('input-span');

    const label = document.createElement('label');
    label.setAttribute('for', inputId);
    label.textContent = labelText;

    const input = document.createElement('input');
    input.type = inputType;
    input.id = inputId;
    input.name = inputName;
    if (isRequired) input.required = true;

    span.appendChild(label);
    span.appendChild(input);
    return span;
  };

  const fieldsWrapper = document.createElement('div');
  fieldsWrapper.classList.add('fields-wrapper');

  const fields = [
    { label: 'Nombre del lugar', type: 'text', id: 'place-name', name: 'placeName', required: true },
    { label: 'Categoría', type: 'text', id: 'place-category', name: 'placeCategory' },
    { label: 'Descripción', type: 'text', id: 'place-description', name: 'placeDescription' },
    { label: 'Ubicación', type: 'text', id: 'location', name: 'location' }
  ];

  fields.forEach(field => {
    const fieldElement = createField(field.label, field.type, field.id, field.name, field.required);
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

  const addButton = createButton('Añadir', 'submit');

  const resetButton = createButton('Limpiar', 'reset');
  resetButton.addEventListener('click', () => {
    placeContainer.reset();
  });

  const cancelButton = createButton('Cancelar', 'button');
  cancelButton.addEventListener('click', () => {
    placeForm.remove();
  });

  divButtons.appendChild(addButton);
  divButtons.appendChild(resetButton);
  divButtons.appendChild(cancelButton);

  placeContainer.appendChild(divButtons);

  placeForm.appendChild(placeContainer);
  node.appendChild(placeForm);
  verifyLabels();
};


