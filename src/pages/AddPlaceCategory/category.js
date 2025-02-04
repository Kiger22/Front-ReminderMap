import { verifyLabels } from '../../functions/verifyLabels';

import('./category.css');

export const categoryPage = (node) => {
  node.innerHTML = "";

  if (document.querySelector('.category-form')) return;

  const categoryForm = document.createElement('div');
  categoryForm.classList.add('category-form');

  const title = document.createElement('h2');
  title.textContent = 'Crea una nueva Categoria de sitios para englobar tipo de lugares a recordar...';
  categoryForm.appendChild(title);

  const categoryContainer = document.createElement('form');
  categoryContainer.classList.add('category-container');


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
    { label: 'Nombre de la categoría', type: 'text', id: 'category-name', name: 'categoryName', required: true },
    { label: 'Descripción', type: 'textarea', id: 'category-description', name: 'categoryDescription' }
  ];

  fields.forEach(field => {
    const fieldElement = createField(field.label, field.type, field.id, field.name, field.required);
    fieldsWrapper.appendChild(fieldElement);
  });

  categoryContainer.appendChild(fieldsWrapper);

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

  const addButton = createButton('Guardar', 'submit');

  const resetButton = createButton('Limpiar', 'reset');
  resetButton.addEventListener('click', () => {
    categoryContainer.reset();
  });

  const cancelButton = createButton('Cancelar', 'button');
  cancelButton.addEventListener('click', () => {
    categoryForm.remove();
  });

  divButtons.appendChild(addButton);
  divButtons.appendChild(resetButton);
  divButtons.appendChild(cancelButton);

  categoryContainer.appendChild(divButtons);

  categoryForm.appendChild(categoryContainer);
  node.appendChild(categoryForm);
  verifyLabels();
};
