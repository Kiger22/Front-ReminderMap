import('./favoritesPlaces.css');
import { api } from '../../api/api';
import { AlertNotification } from '../../components/AlertNotification/notification';
import { showCategoryDetails } from '../../functions/showCategoryDetails';

export const favoritesPlacesPage = async (node) => {
  node.innerHTML = "";

  // Contenedor principal
  const placesPage = document.createElement('div');
  placesPage.classList.add('places-page');

  // Header fijo
  const placesHeader = document.createElement('div');
  placesHeader.classList.add('places-header');

  const header = document.createElement('h2');
  header.textContent = "Lugares Frecuentes";

  const content = document.createElement('p');
  content.textContent = "Lugares ordenados por frecuencia de uso.";

  placesHeader.appendChild(header);
  placesHeader.appendChild(content);

  // Contenedor scrolleable para los lugares
  const placesContainer = document.createElement('div');
  placesContainer.classList.add('places-container');

  // Agregar header y contenedor al contenedor principal
  placesPage.appendChild(placesHeader);
  placesPage.appendChild(placesContainer);

  try {
    const response = await api({
      endpoint: '/places',
      method: 'GET'
    });

    const places = response.lugares;

    if (places && places.length > 0) {
      places.forEach(place => {
        const placeItem = document.createElement('div');
        placeItem.classList.add('place-item');

        // Contenedor de información principal
        const placeInfo = document.createElement('div');
        placeInfo.classList.add('place-info');

        const placeName = document.createElement('h3');
        placeName.textContent = place.name;

        const placeAddress = document.createElement('p');
        placeAddress.textContent = place.address || place.location;

        const placeDescription = document.createElement('p');
        placeDescription.classList.add('place-description');
        placeDescription.textContent = place.description;

        const placeCategory = document.createElement('span');
        placeCategory.classList.add('place-category');
        placeCategory.textContent = place.category ? place.category.name : 'Sin categoría';

        if (place.category) {
          placeCategory.style.cursor = 'pointer';
          placeCategory.onclick = () => showCategoryDetails(place.category._id);
        }

        // Agregar elementos al placeInfo
        placeInfo.appendChild(placeName);
        placeInfo.appendChild(placeAddress);
        placeInfo.appendChild(placeDescription);
        placeInfo.appendChild(placeCategory);

        // Contenedor de acciones (contador y botones)
        const placeActions = document.createElement('div');
        placeActions.classList.add('place-actions');

        const useCount = document.createElement('span');
        useCount.classList.add('use-count');
        useCount.textContent = `Usado ${place.useCount || 0} ${place.useCount === 1 ? 'vez' : 'veces'}`;

        // Contenedor para los iconos de acción
        const actionIcons = document.createElement('div');
        actionIcons.classList.add('action-icons');

        // Botón de editar
        const editButton = document.createElement('img');
        editButton.src = './assets/edit-svgrepo-com.svg';
        editButton.classList.add('action-icon');
        editButton.addEventListener('click', () => {
          showUpdateForm(place);
        });

        // Botón de eliminar
        const deleteButton = document.createElement('img');
        deleteButton.src = './assets/delette-svgrepo-com.svg';
        deleteButton.classList.add('action-icon');
        deleteButton.addEventListener('click', () => {
          AlertNotification(
            '¿Eliminar lugar?',
            '¿Estás seguro de que deseas eliminar este lugar?',
            async (confirmed) => {
              if (confirmed) {
                try {
                  await api({
                    endpoint: `/places/${place._id}`,
                    method: 'DELETE'
                  });

                  placeItem.remove();

                  if (!document.querySelector('.place-item')) {
                    location.reload();
                  }

                  AlertNotification('Éxito', 'Lugar eliminado correctamente', null, {
                    showCancelButton: false
                  });
                } catch (error) {
                  console.error('Error al eliminar lugar:', error);
                  AlertNotification('Error', 'No se pudo eliminar el lugar', null, {
                    showCancelButton: false
                  });
                }
              }
            }
          );
        });

        // Agregar los botones al contenedor de iconos
        actionIcons.appendChild(editButton);
        actionIcons.appendChild(deleteButton);

        // Agregar elementos al contenedor de acciones
        placeActions.appendChild(useCount);
        placeActions.appendChild(actionIcons);

        // Agregar todo al item del lugar
        placeItem.appendChild(placeInfo);
        placeItem.appendChild(placeActions);
        placesContainer.appendChild(placeItem);
      });
    } else {
      const noPlacesMessage = document.createElement('p');
      noPlacesMessage.classList.add('no-places-message');
      noPlacesMessage.textContent = "No hay lugares registrados.";
      placesContainer.appendChild(noPlacesMessage);
    }
  } catch (error) {
    console.error('Error al obtener los lugares:', error);
    const errorMessage = document.createElement('p');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = "Error al cargar los lugares.";
    placesContainer.appendChild(errorMessage);
  }

  node.appendChild(placesPage);
};

// Función para mostrar el formulario de actualización
const showUpdateForm = (place) => {
  const formContainer = document.createElement('div');
  formContainer.classList.add('update-form-container');

  const form = document.createElement('form');
  form.classList.add('update-place-form');

  const fieldsContainer = document.createElement('div');
  fieldsContainer.classList.add('fields-container');

  // Crear campos del formulario
  const fields = [
    { id: 'name', label: 'Nombre', value: place.name },
    { id: 'description', label: 'Descripción', value: place.description },
    { id: 'location', label: 'Ubicación', value: place.location }
  ];

  fields.forEach(field => {
    const inputSpan = document.createElement('span');
    inputSpan.classList.add('input-span');

    const label = document.createElement('label');
    label.textContent = field.label;
    label.htmlFor = `update-place-${field.id}`;

    const input = document.createElement('input');
    input.type = 'text';
    input.id = `update-place-${field.id}`;
    input.value = field.value;
    input.required = true;

    inputSpan.appendChild(label);
    inputSpan.appendChild(input);
    fieldsContainer.appendChild(inputSpan);
  });

  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons-container');

  // Botón de actualizar
  const updateButton = document.createElement('button');
  updateButton.textContent = 'Actualizar';
  updateButton.id = 'update-button';
  updateButton.type = 'submit';

  // Botón de cancelar
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancelar';
  cancelButton.id = 'cancel-button';
  cancelButton.type = 'button';

  buttonsContainer.appendChild(updateButton);
  buttonsContainer.appendChild(cancelButton);

  form.appendChild(fieldsContainer);
  form.appendChild(buttonsContainer);
  formContainer.appendChild(form);

  // Manejador del formulario
  form.onsubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      name: document.getElementById('update-place-name').value,
      description: document.getElementById('update-place-description').value,
      location: document.getElementById('update-place-location').value
    };

    try {
      await api({
        endpoint: `/places/${place._id}`,
        method: 'PUT',
        body: updatedData
      });

      formContainer.remove();
      AlertNotification('Éxito', 'Lugar actualizado correctamente', () => {
        location.reload();
      });
    } catch (error) {
      console.error('Error al actualizar lugar:', error);
      AlertNotification('Error', 'No se pudo actualizar el lugar');
    }
  };

  cancelButton.onclick = () => formContainer.remove();

  document.body.appendChild(formContainer);
};
