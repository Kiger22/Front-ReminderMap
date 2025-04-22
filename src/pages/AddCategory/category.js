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
    const success = await addCategory();

    if (success) {
      // Volvemos a la página de lugares
      const { placePage } = await import('../AddPlace/place.js');
      await placePage(node);

      // Restauramos los datos temporales si existen
      const tempData = localStorage.getItem('tempPlaceData');
      if (tempData) {
        const data = JSON.parse(tempData);
        const nameInput = document.getElementById('place-name');
        const descriptionInput = document.getElementById('place-description');
        const locationInput = document.getElementById('location');

        if (nameInput && data.name) nameInput.value = data.name;
        if (descriptionInput && data.description) descriptionInput.value = data.description;
        if (locationInput && data.location) locationInput.value = data.location;

        // Limpiamos los datos temporales
        localStorage.removeItem('tempPlaceData');
      }
    }
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
  // No necesitamos añadir un event listener aquí, ya que el formulario ya tiene uno

  const resetButton = createButton('Limpiar', 'reset');
  resetButton.addEventListener('click', () => {
    categoryContainer.reset();
  });

  const cancelButton = createButton('Cancelar', 'button');
  cancelButton.addEventListener('click', async () => {
    // Volvemos a la página de lugares
    const { placePage } = await import('../AddPlace/place.js');
    await placePage(node);

    // Restauramos los datos temporales si existen
    const tempData = localStorage.getItem('tempPlaceData');
    if (tempData) {
      const data = JSON.parse(tempData);
      const nameInput = document.getElementById('place-name');
      const descriptionInput = document.getElementById('place-description');
      const locationInput = document.getElementById('location');
      const categorySelect = document.getElementById('place-category');

      if (nameInput && data.name) nameInput.value = data.name;
      if (descriptionInput && data.description) descriptionInput.value = data.description;
      if (locationInput && data.location) locationInput.value = data.location;
      if (categorySelect && data.category) {
        // Buscamos la opción correspondiente
        const options = categorySelect.options;
        for (let i = 0; i < options.length; i++) {
          if (options[i].value === data.category) {
            categorySelect.selectedIndex = i;
            break;
          }
        }
      }

      // Limpiamos los datos temporales
      localStorage.removeItem('tempPlaceData');
    }
  });

  divButtons.appendChild(addButton);
  divButtons.appendChild(resetButton);
  divButtons.appendChild(cancelButton);

  categoryContainer.appendChild(divButtons);

  categoryForm.appendChild(categoryContainer);
  node.appendChild(categoryForm);
  verifyLabels();
};
