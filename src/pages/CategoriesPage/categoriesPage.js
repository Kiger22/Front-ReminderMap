import('./categoriesPage.css');
import { api } from '../../api/api';
import { AlertNotification } from '../../components/AlertNotification/notification';
import { addPlace } from '../../functions/places/addPlace';
import { placePage } from '../AddPlace/place';
import { loadExampleCategories } from '../../functions/categories/loadExampleCategories';
import { deleteExampleCategories } from '../../functions/categories/deleteExampleCategories';
import { createButton } from '../../components/Button/button';

export const categoriesPage = async (node) => {
  node.innerHTML = "";

  const categoriesPageContainer = document.createElement('div');
  categoriesPageContainer.classList.add('categories-page');

  const categoriesHeader = document.createElement('div');
  categoriesHeader.classList.add('categories-header');

  const header = document.createElement('h2');
  header.textContent = "Categorías";

  const content = document.createElement('p');
  content.textContent = "Lista de categorías disponibles.";

  categoriesHeader.appendChild(header);
  categoriesHeader.appendChild(content);

  // Añadir botones de acción en el encabezado
  const headerActions = document.createElement('div');
  headerActions.classList.add('header-actions');

  // Usamos el componente Button para crear nueva categoría
  createButton(headerActions, "Nueva categoría", "create-category-btn", () => {
    import('../AddCategory/category.js').then(module => {
      const { categoryPage } = module;
      categoryPage(node);
    });
  });

  // Botón para cargar/eliminar ejemplos
  const examplesButtonContainer = document.createElement('div');
  examplesButtonContainer.id = 'examples-button-container';
  headerActions.appendChild(examplesButtonContainer);

  // Verificamos si ya hay categorías de ejemplo para mostrar el botón adecuado
  const checkForExamples = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');
      const endpoint = userId ? `categories?userId=${userId}` : 'categories';
      const response = await api({
        endpoint,
        method: 'GET',
        token: authToken
      });

      // Limpiamos el contenedor del botón
      examplesButtonContainer.innerHTML = '';

      // Si hay categorías que parecen ejemplos (podemos verificar por nombre o alguna propiedad)
      const hasExamples = response.categories && response.categories.some(
        cat => cat.name === "Restaurantes" || cat.name === "Parques" || cat.name === "Museos"
      );

      if (hasExamples) {
        // Mostrar botón para eliminar ejemplos
        createButton(examplesButtonContainer, "Eliminar ejemplos", "delete-examples-btn", async () => {
          // Aquí iría la lógica para eliminar los ejemplos
          const success = await deleteExampleCategories();
          if (success) {
            categoriesPage(node);
          }
        });
      } else {
        // Mostrar botón para cargar ejemplos
        createButton(examplesButtonContainer, "Cargar ejemplos", "load-examples-btn", async () => {
          const success = await loadExampleCategories();
          if (success) {
            categoriesPage(node);
          }
        });
      }
    } catch (error) {
      console.error('Error al verificar ejemplos:', error);
      // En caso de error, mostramos el botón de cargar ejemplos por defecto
      createButton(examplesButtonContainer, "Cargar ejemplos", "load-examples-btn", async () => {
        const success = await loadExampleCategories();
        if (success) {
          categoriesPage(node);
        }
      });
    }
  };

  // Ejecutamos la verificación al cargar la página
  checkForExamples();

  categoriesHeader.appendChild(headerActions);

  const categoriesContainer = document.createElement('div');
  categoriesContainer.classList.add('categories-container');

  categoriesPageContainer.appendChild(categoriesHeader);
  categoriesPageContainer.appendChild(categoriesContainer);

  try {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    // Modificamos el endpoint para incluir el userId
    const endpoint = userId ? `categories?userId=${userId}` : 'categories';

    console.log('Solicitando categorías para el usuario:', userId);
    const response = await api({
      endpoint,
      method: 'GET',
      token: authToken
    });

    console.log('Respuesta de categorías:', response);

    if (response.categories && response.categories.length > 0) {
      // Filtramos la categoría "Desconocida" para que no aparezca en el listado
      const filteredCategories = response.categories.filter(
        category => category.name !== "Desconocida"
      );

      if (filteredCategories.length > 0) {
        filteredCategories.forEach(category => {
          const categoryItem = document.createElement('div');
          categoryItem.classList.add('category-item');

          const categoryInfo = document.createElement('div');
          categoryInfo.classList.add('category-info');

          const categoryName = document.createElement('h3');
          categoryName.textContent = category.name;

          const categoryDescription = document.createElement('p');
          categoryDescription.textContent = category.description || "Sin descripción";

          categoryInfo.appendChild(categoryName);
          categoryInfo.appendChild(categoryDescription);

          const categoryActions = document.createElement('div');
          categoryActions.classList.add('category-actions');

          const editButton = document.createElement('img');
          editButton.src = './assets/edit-svgrepo-com.svg';
          editButton.classList.add('action-icon');

          const deleteButton = document.createElement('img');
          deleteButton.src = './assets/delette-svgrepo-com.svg';
          deleteButton.classList.add('action-icon');

          const addPlaceButton = document.createElement('img');
          addPlaceButton.src = './assets/add-svgrepo-com.svg';
          addPlaceButton.classList.add('action-icon', 'add-place-icon');
          addPlaceButton.alt = 'Agregar Lugar';
          addPlaceButton.addEventListener('click', () => {
            placePage(node, { category: category });
          });

          editButton.addEventListener('click', () => {
            showUpdateForm(category);
          });

          deleteButton.addEventListener('click', () => {
            AlertNotification(
              '¿Eliminar categoría?',
              '¿Estás seguro de que deseas eliminar esta categoría?',
              async (confirmed) => {
                if (confirmed) {
                  try {
                    await api({
                      endpoint: `/categories/${category._id}`,
                      method: 'DELETE',
                      token: authToken
                    });

                    categoryItem.remove();

                    // Verificamos si quedan categorías en la lista
                    if (!document.querySelector('.category-item')) {
                      // En lugar de recargar toda la página, solo actualizamos la vista de categorías
                      const categoriesContainer = document.querySelector('.categories-container');
                      if (categoriesContainer) {
                        // Limpiamos el contenedor
                        categoriesContainer.innerHTML = '';

                        // Creamos el mensaje de "no hay categorías"
                        const noCategoriesContainer = document.createElement('div');
                        noCategoriesContainer.classList.add('no-categories-container');

                        const noCategoriesMessage = document.createElement('p');
                        noCategoriesMessage.classList.add('no-categories-message');
                        noCategoriesMessage.textContent = "No hay categorías registradas.";

                        noCategoriesContainer.appendChild(noCategoriesMessage);
                        categoriesContainer.appendChild(noCategoriesContainer);
                      }
                    }

                    AlertNotification('Éxito', 'Categoría eliminada correctamente', null, {
                      showCancelButton: false
                    });
                  } catch (error) {
                    console.error('Error al eliminar categoría:', error);
                    AlertNotification('Error', 'No se pudo eliminar la categoría', null, {
                      showCancelButton: false
                    });
                  }
                }
              }
            );
          });

          const actionIcons = document.createElement('div');
          actionIcons.classList.add('action-icons');
          actionIcons.appendChild(editButton);
          actionIcons.appendChild(deleteButton);
          actionIcons.appendChild(addPlaceButton);

          categoryActions.appendChild(actionIcons);
          categoryItem.appendChild(categoryInfo);
          categoryItem.appendChild(categoryActions);
          categoriesContainer.appendChild(categoryItem);
        });
      } else {
        const noCategoriesContainer = document.createElement('div');
        noCategoriesContainer.classList.add('no-categories-container');

        const noCategoriesMessage = document.createElement('p');
        noCategoriesMessage.classList.add('no-categories-message');
        noCategoriesMessage.textContent = "No hay categorías registradas.";

        noCategoriesContainer.appendChild(noCategoriesMessage);
        categoriesContainer.appendChild(noCategoriesContainer);
      }
    } else {
      // Sección donde se muestra "No hay categorías"
      const noCategoriesContainer = document.createElement('div');
      noCategoriesContainer.classList.add('no-categories-container');

      const noCategoriesMessage = document.createElement('p');
      noCategoriesMessage.classList.add('no-categories-message');
      noCategoriesMessage.textContent = "No hay categorías registradas.";

      noCategoriesContainer.appendChild(noCategoriesMessage);

      categoriesContainer.appendChild(noCategoriesContainer);
    }
  } catch (error) {
    console.error('Error al cargar las categorías:', error);
    const errorMessage = document.createElement('p');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = "Error al cargar las categorías.";
    categoriesContainer.appendChild(errorMessage);
  }

  node.appendChild(categoriesPageContainer);
};

const showUpdateForm = (category) => {
  const formContainer = document.createElement('div');
  formContainer.classList.add('update-form-container');

  const form = document.createElement('form');
  form.classList.add('update-category-form');

  const fieldsContainer = document.createElement('div');
  fieldsContainer.classList.add('fields-container');

  const fields = [
    { id: 'name', label: 'Nombre', value: category.name },
    { id: 'description', label: 'Descripción', value: category.description }
  ];

  fields.forEach(field => {
    const inputSpan = document.createElement('span');
    inputSpan.classList.add('input-span');

    const label = document.createElement('label');
    label.textContent = field.label;
    label.htmlFor = `update-category-${field.id}`;

    const input = document.createElement('input');
    input.type = 'text';
    input.id = `update-category-${field.id}`;
    input.value = field.value;
    input.required = true;

    inputSpan.appendChild(label);
    inputSpan.appendChild(input);
    fieldsContainer.appendChild(inputSpan);
  });

  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons-container');

  const updateButton = document.createElement('button');
  updateButton.textContent = 'Actualizar';
  updateButton.id = 'update-button';
  updateButton.type = 'submit';

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancelar';
  cancelButton.id = 'cancel-button';
  cancelButton.type = 'button';

  buttonsContainer.appendChild(updateButton);
  buttonsContainer.appendChild(cancelButton);

  form.appendChild(fieldsContainer);
  form.appendChild(buttonsContainer);
  formContainer.appendChild(form);

  form.onsubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      name: document.getElementById('update-category-name').value,
      description: document.getElementById('update-category-description').value
    };

    try {
      const authToken = localStorage.getItem('authToken');
      await api({
        endpoint: `/categories/${category._id}`,
        method: 'PUT',
        body: updatedData,
        token: authToken
      });

      formContainer.remove();
      AlertNotification('Éxito', 'Categoría actualizada correctamente', () => {
        location.reload();
      });
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      AlertNotification('Error', 'No se pudo actualizar la categoría');
    }
  };

  cancelButton.onclick = () => formContainer.remove();

  document.body.appendChild(formContainer);
};

const showAddPlaceForm = (category) => {
  const formContainer = document.createElement('div');
  formContainer.classList.add('update-form-container');

  const form = document.createElement('form');
  form.classList.add('update-place-form');

  const fieldsContainer = document.createElement('div');
  fieldsContainer.classList.add('fields-container');

  const fields = [
    { id: 'name', label: 'Nombre del lugar', value: '' },
    { id: 'description', label: 'Descripción', value: '' },
    { id: 'location', label: 'Ubicación', value: '' }
  ];

  fields.forEach(field => {
    const inputSpan = document.createElement('span');
    inputSpan.classList.add('input-span');

    const label = document.createElement('label');
    label.textContent = field.label;
    label.htmlFor = `add-place-${field.id}`;

    const input = document.createElement('input');
    input.type = 'text';
    input.id = `add-place-${field.id}`;
    input.value = field.value;
    input.required = true;

    inputSpan.appendChild(label);
    inputSpan.appendChild(input);
    fieldsContainer.appendChild(inputSpan);
  });

  // Campo para la categoría
  const categorySpan = document.createElement('span');
  categorySpan.classList.add('input-span');

  const categoryLabel = document.createElement('label');
  categoryLabel.textContent = 'Categoría';
  categoryLabel.htmlFor = 'add-place-category';

  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.id = 'add-place-category';
  categoryInput.value = category.name;
  categoryInput.readOnly = true;

  categorySpan.appendChild(categoryLabel);
  categorySpan.appendChild(categoryInput);
  fieldsContainer.appendChild(categorySpan);

  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons-container');

  const addButton = document.createElement('button');
  addButton.textContent = 'Agregar Lugar';
  addButton.id = 'add-place-button';
  addButton.type = 'submit';

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancelar';
  cancelButton.id = 'cancel-place-button';
  cancelButton.type = 'button';

  buttonsContainer.appendChild(addButton);
  buttonsContainer.appendChild(cancelButton);

  form.appendChild(fieldsContainer);
  form.appendChild(buttonsContainer);
  formContainer.appendChild(form);

  form.onsubmit = async (e) => {
    e.preventDefault();
    const newPlace = {
      name: document.getElementById('add-place-name').value,
      description: document.getElementById('add-place-description').value,
      location: document.getElementById('add-place-location').value,
      category: category._id
    };

    try {
      await addPlace(newPlace);
      formContainer.remove();
      AlertNotification('Éxito', 'Lugar agregado correctamente', () => {
        location.reload();
      });
    } catch (error) {
      console.error('Error al agregar lugar:', error);
      AlertNotification('Error', 'No se pudo agregar el lugar');
    }
  };

  cancelButton.onclick = () => formContainer.remove();

  document.body.appendChild(formContainer);
};
