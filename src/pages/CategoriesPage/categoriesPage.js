import('./categoriesPage.css');
import { api } from '../../api/api';
import { AlertNotification } from '../../components/AlertNotification/notification';
import { addPlace } from '../../functions/places/addPlace';
import { placePage } from '../AddPlace/place';
import { loadExampleCategories } from '../../functions/categories/loadExampleCategories';
import { deleteExampleCategories } from '../../functions/categories/deleteExampleCategories';
import { createButton } from '../../components/Button/button';
import { createForm } from '../../components/Form/form';
import { showUpdateForm } from '../../functions/categories/showUpdateForm.js'; // Importamos la función separada

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

  // Añadimos botones de acción en el encabezado
  const headerActions = document.createElement('div');
  headerActions.classList.add('header-actions');

  // Creamos un botón para crear nueva categoría
  createButton(headerActions, "Nueva categoría", "create-category-btn", () => {
    import('../AddCategory/category.js').then(module => {
      const { categoryPage } = module;
      categoryPage(node);
    });
  });

  // Creamos un botón para cargar/eliminar ejemplos
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

  // Agregamos el encabezado al contenedor principal
  categoriesHeader.appendChild(headerActions);

  // Contenedor para las categorías
  const categoriesContainer = document.createElement('div');
  categoriesContainer.classList.add('categories-container');

  // Agregamos los elementos al contenedor principal
  categoriesPageContainer.appendChild(categoriesHeader);
  categoriesPageContainer.appendChild(categoriesContainer);

  // Intentamos obtener las categorías del usuario y las agregamos al contenedor
  try {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    // Modificamos el endpoint para incluir el userId
    const endpoint = userId ? `categories?userId=${userId}` : 'categories';

    // Realizamos la solicitud a la API
    console.log('Solicitando categorías para el usuario:', userId);
    const response = await api({
      endpoint,
      method: 'GET',
      token: authToken
    });

    console.log('Respuesta de categorías:', response);

    // Verificamos si hay categorías
    if (response.categories && response.categories.length > 0) {
      // Filtramos la categoría "Desconocida" para que no aparezca en el listado
      const filteredCategories = response.categories.filter(
        category => category.name !== "Desconocida"
      );

      // Si hay categorías, las agregamos al contenedor
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

          // Botón para agregar lugar
          const addPlaceButton = document.createElement('img');
          addPlaceButton.src = './assets/add-svgrepo-com.svg';
          addPlaceButton.classList.add('action-icon', 'add-place-icon');
          addPlaceButton.alt = 'Agregar Lugar';
          addPlaceButton.addEventListener('click', () => {
            placePage(node, { category: category });
          });

          // Botón para editar categoría
          editButton.addEventListener('click', () => {
            showUpdateForm(category);
          });

          // Botón para eliminar categoría
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

      categoriesContainer.appendChild(noCategoriesMessage);
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

