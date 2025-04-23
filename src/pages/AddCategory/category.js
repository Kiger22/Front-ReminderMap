import { addCategory } from '../../functions/categories/addCategory';
import { verifyLabels } from '../../functions/navigation/verifyLabels';
import { createField } from "../../utils/formUtils";
import { categoriesPage } from '../CategoriesPage/categoriesPage';

import('./category.css');

export const categoryPage = (node) => {
  node.innerHTML = "";

  if (document.querySelector('.category-form')) return;

  // Verificar si venimos desde la página de añadir lugar
  const vieneDesdeLugar = localStorage.getItem('datosTemporalesLugar') !== null;

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
      // La redirección se manejará después de que el usuario cierre la notificación
      // No hacemos nada aquí, ya que la notificación ya se muestra en addCategory()

      // Esperamos un poco para dar tiempo a que se muestre la notificación
      setTimeout(async () => {
        // Si venimos desde la página de añadir lugar, volvemos a ella
        if (vieneDesdeLugar) {
          const { placePage } = await import('../AddPlace/place.js');
          await placePage(node);
        } else {
          // Si no venimos desde añadir lugar, volvemos a la página de categorías
          await categoriesPage(node);
        }
      }, 1500); // Esperamos 1.5 segundos para dar tiempo a que se muestre la notificación
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

  const createButton = (text, type) => {
    const button = document.createElement('button');
    button.type = type;
    button.textContent = text;
    button.classList.add(type === 'submit' ? 'primary-button' : 'secondary-button');
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
    // Si venimos desde la página de añadir lugar, volvemos a ella
    if (vieneDesdeLugar) {
      const { placePage } = await import('../AddPlace/place.js');
      await placePage(node);
    } else {
      // Si no venimos desde añadir lugar, volvemos a la página de categorías
      await categoriesPage(node);
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
