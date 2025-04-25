import { addCategory } from '../../functions/categories/addCategory';
import { verifyLabels } from '../../functions/navigation/verifyLabels';
import { createField } from "../../utils/formUtils";
import { categoriesPage } from '../CategoriesPage/categoriesPage';
import { createButton } from '../../components/Button/button';
import('./category.css');

//* Función para crear el formulario de categoría
export const categoryPage = (node) => {
  node.innerHTML = '';

  // Verificamos si ya existe un formulario de categoría
  if (document.querySelector('.category-form')) return;

  // Verificamos si venimos desde la página de añadir lugar
  const comesFromPlace = localStorage.getItem('tempPlaceData') !== null;

  // Creamos el formulario de categoría
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

    // Si la categoría se creó correctamente, redirigimos a la página de categorías
    if (success) {
      // Esperamos un poco para dar tiempo a que se muestre la notificación
      setTimeout(async () => {
        // Si venimos desde la página de añadir lugar, volvemos a ella
        if (comesFromPlace) {
          const { placePage } = await import('../AddPlace/place.js');
          await placePage(node);
        } else {
          // Si no venimos desde añadir lugar, volvemos a la página de categorías
          await categoriesPage(node);
        }
      }, 1500);
    }
  });

  const fieldsWrapper = document.createElement('div');
  fieldsWrapper.classList.add('fields-wrapper');

  // Creamos los campos del formulario
  const fields = [
    { label: 'Nombre de la categoría', type: 'text', id: 'category-name', name: 'categoryName', required: true },
    { label: 'Descripción', type: 'textarea', id: 'category-description', name: 'categoryDescription' }
  ];
  fields.forEach(field => {
    const fieldElement = createField(field.label, field.type, field.id, field.name, field.required);
    fieldsWrapper.appendChild(fieldElement);
  });
  categoryContainer.appendChild(fieldsWrapper);

  // Creamos el contenedor de botones
  const divButtons = document.createElement('div');
  divButtons.classList.add('buttons');

  // Creamos botones
  createButton(divButtons, 'Guardar', 'add-category-button', null);
  createButton(divButtons, 'Limpiar', 'reset-category-button', () => {
    categoryContainer.reset();
  });
  createButton(divButtons, 'Cancelar', 'cancel-category-button', async () => {
    // Si venimos desde la página de añadir lugar, volvemos a ella
    if (comesFromPlace) {
      const { placePage } = await import('../AddPlace/place.js');
      await placePage(node);
    } else {
      // Si no venimos desde añadir lugar, volvemos a la página de categorías
      await categoriesPage(node);
    }
  });

  categoryContainer.appendChild(divButtons);

  categoryForm.appendChild(categoryContainer);
  node.appendChild(categoryForm);
  verifyLabels();
};
