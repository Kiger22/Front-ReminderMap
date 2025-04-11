import { addCategory } from '../../functions/categories/addCategory';
import { verifyLabels } from '../../functions/navigation/verifyLabels';
import { createField } from "../../utils/formUtils";

import('./category.css');

export const categoryPage = (node) => {
  node.innerHTML = "";

  if (document.querySelector('.category-form')) return;

  const categoryForm = document.createElement('div');
  categoryForm.classList.add('category-form');

  const title = document.createElement('h2');
  title.textContent = 'Crea una nueva Categoria de sitios para englobar lugares a recordar...';
  categoryForm.appendChild(title);

  const categoryContainer = document.createElement('form');
  categoryContainer.classList.add('category-container');

  // Agregamos el event listener al formulario
  categoryContainer.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Formulario de categoría enviado');
    await addCategory();
  });

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
  // addButton.addEventListener('click', () => {
  //   addCategory();
  // });

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
