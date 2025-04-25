import('./form.css');
import { createButton } from '../Button/button';

export const createForm = (fields, buttons, formClass = '') => {
  const formContainer = document.createElement('div');
  formContainer.classList.add('update-form');

  const form = document.createElement('form');
  form.classList.add('update-form-container');

  const fieldsContainer = document.createElement('div');
  fieldsContainer.classList.add('fields-container');

  // Creamos campos dinámicamente
  fields.forEach(field => {
    const inputSpan = document.createElement('span');
    inputSpan.classList.add('input-span');

    const label = document.createElement('label');
    label.textContent = field.label;
    label.htmlFor = field.id;

    const input = document.createElement('input');
    input.type = field.type || 'text';
    input.id = field.id;
    input.name = field.name || field.id;
    input.value = field.value || '';
    if (field.required) input.required = true;

    inputSpan.appendChild(label);
    inputSpan.appendChild(input);
    fieldsContainer.appendChild(inputSpan);
  });

  // Creamos botones dinámicamente
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons-container');
  buttons.forEach(button => {
    const buttonElement = createButton(button.text, button.type, button.id, button.onClick);
    buttonsContainer.appendChild(buttonElement);
  });

  form.appendChild(fieldsContainer);
  form.appendChild(buttonsContainer);
  formContainer.appendChild(form);

  return formContainer;
};
