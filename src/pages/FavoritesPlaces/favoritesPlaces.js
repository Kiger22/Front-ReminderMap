import('./favoritesPlaces.css');
import { api } from '../../api/api';
import { AlertNotification } from '../../components/AlertNotification/notification';
import { showCategoryDetails } from '../../functions/showCategoryDetails';
import { toggleFavorite, removeFavorite } from '../../functions/toggleFavorite';
import { getPlaces } from '../../functions/getPlaces';
import { reminderPageForm } from '../AddReminder/reminder';
import { loadReminders } from '../../functions/loadReminders';

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
        const formatUseCount = (count) => {
          count = Number(count) || 0;
          if (count === 0) return 'Sin uso';
          if (count === 1) return '1 vez';
          return `${count} veces`;
        };
        useCount.textContent = formatUseCount(place.useCount);
        useCount.title = `Última actualización: ${place.updatedAt
          ? new Date(place.updatedAt).toLocaleString()
          : 'No disponible'
          }`;

        // Agregar el evento click al contador
        useCount.style.cursor = 'pointer';
        useCount.addEventListener('click', async () => {
          try {
            // Usar loadReminders con render: false para obtener todos los recordatorios
            const reminders = await loadReminders({ render: false });

            if (reminders) {
              // Filtrar los recordatorios que corresponden a este lugar
              const placeReminders = reminders.filter(reminder =>
                reminder.location === place.location ||
                (reminder.location && reminder.location._id === place._id)
              );

              // Ordenar por fecha y hora
              placeReminders.sort((a, b) => {
                const dateA = new Date(`${a.date.split('T')[0]}T${a.time}`);
                const dateB = new Date(`${b.date.split('T')[0]}T${b.time}`);
                return dateA - dateB;
              });

              const content = `
                <div class="reminder-notification-content">
                  <h3>Recordatorios en ${place.name}</h3>
                  <div class="reminder-list">
                    ${placeReminders.length > 0
                  ? placeReminders.map(reminder => `
                          <div class="reminder-notification-item">
                            <div class="reminder-header">
                              <h4>${reminder.name}</h4>
                              <span class="reminder-time">⏰ ${reminder.time}</span>
                            </div>
                            <div class="reminder-details">
                              <p class="reminder-description">📝 ${reminder.description}</p>
                              <p class="reminder-date">📅 ${new Date(reminder.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        `).join('')
                  : '<p class="empty-message">No hay recordatorios registrados para este lugar</p>'
                }
                  </div>
                </div>
              `;

              AlertNotification(
                '',
                content,
                null,
                {
                  showCancelButton: false,
                  confirmButtonText: 'Cerrar'
                }
              );
            }
          } catch (error) {
            console.error('Error al obtener recordatorios:', error);
            AlertNotification(
              'Error',
              'No se pudieron cargar los recordatorios',
              null,
              { showCancelButton: false }
            );
          }
        });

        // Contenedor para los iconos de acción
        const actionIcons = document.createElement('div');
        actionIcons.classList.add('action-icons');

        // Crear todos los botones
        const favoriteButton = document.createElement('img');
        favoriteButton.classList.add('action-icon', 'favorite-icon');
        favoriteButton.src = place.isFavorite
          ? '../assets/heart-svgrepo1-com.svg'  // Corazón lleno
          : '../assets/heart-svgrepo2-com.svg'; // Corazón vacío

        // Agregar botón de recordatorio
        const reminderButton = document.createElement('img');
        reminderButton.classList.add('action-icon', 'reminder-icon');
        reminderButton.src = '../assets/add-svgrepo-com.svg'; // Cambiado al ícono de add
        reminderButton.title = 'Crear recordatorio para este lugar';

        // Event listener para el botón de recordatorio
        reminderButton.addEventListener('click', async () => {
          try {
            // Guardar temporalmente la información del lugar seleccionado
            localStorage.setItem('selectedPlace', JSON.stringify({
              id: place._id,
              name: place.name,
              location: place.location
            }));

            // Obtener el contenedor principal
            const mainContainer = document.querySelector('.hero-container');
            if (mainContainer) {
              // Limpiar el contenedor actual
              mainContainer.innerHTML = '';
              // Cargar el formulario de recordatorio
              await reminderPageForm(mainContainer);

              // Pre-seleccionar el lugar en el formulario
              const locationSelect = document.getElementById('reminder-location');
              if (locationSelect) {
                locationSelect.value = place.location;
              }
            }
          } catch (error) {
            console.error('Error al cargar formulario de recordatorio:', error);
            AlertNotification('Error', 'No se pudo cargar el formulario de recordatorio', null, {
              showCancelButton: false
            });
          }
        });

        const editButton = document.createElement('img');
        editButton.src = './assets/edit-svgrepo-com.svg';
        editButton.classList.add('action-icon');

        const deleteButton = document.createElement('img');
        deleteButton.src = './assets/delette-svgrepo-com.svg';
        deleteButton.classList.add('action-icon');

        // Event listener para el botón de favorito
        favoriteButton.addEventListener('click', async () => {
          try {
            if (place.isFavorite) {
              const success = await removeFavorite(place._id);
              if (success) {
                favoriteButton.src = '../assets/heart-svgrepo2-com.svg';
                place.isFavorite = false;
                // Ya no llamamos a updatePlacesList aquí
              }
            } else {
              const success = await toggleFavorite(place._id);
              if (success) {
                favoriteButton.src = '../assets/heart-svgrepo1-com.svg';
                place.isFavorite = true;
                // Ya no llamamos a updatePlacesList aquí
              }
            }
          } catch (error) {
            console.error('Error al cambiar estado de favorito:', error);
          }
        });

        editButton.addEventListener('click', () => {
          showUpdateForm(place);
        });

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

        // Agregar todos los botones al contenedor de iconos en el orden correcto
        actionIcons.appendChild(favoriteButton);
        actionIcons.appendChild(reminderButton);
        actionIcons.appendChild(editButton);
        actionIcons.appendChild(deleteButton);

        // Agregar elementos al contenedor de acciones
        placeActions.appendChild(actionIcons);
        placeActions.appendChild(useCount);

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

// Función para actualizar la lista de lugares
export const updatePlacesList = async () => {
  const placesContainer = document.querySelector('.places-container');
  if (!placesContainer) return;

  try {
    const places = await getPlaces();
    placesContainer.innerHTML = '';
    places.forEach(place => {
      const placeItem = createPlaceItem(place);
      placesContainer.appendChild(placeItem);
    });
  } catch (error) {
    console.error('Error al actualizar lista de lugares:', error);
  }
};

// Función para crear un elemento de lugar
const createPlaceItem = (place) => {
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
  const formatUseCount = (count) => {
    count = Number(count) || 0;
    if (count === 0) return 'No usado aún';
    if (count === 1) return 'Usado 1 vez';
    return `Usado ${count} veces`;
  };
  useCount.textContent = formatUseCount(place.useCount);
  useCount.title = `Última actualización: ${place.updatedAt
    ? new Date(place.updatedAt).toLocaleString()
    : 'No disponible'
    }`;

  // Contenedor para los iconos de acción
  const actionIcons = document.createElement('div');
  actionIcons.classList.add('action-icons');

  // Crear y configurar los botones
  const favoriteButton = document.createElement('img');
  favoriteButton.classList.add('action-icon', 'favorite-icon');
  favoriteButton.src = place.isFavorite
    ? '../assets/heart-svgrepo1-com.svg'
    : '../assets/heart-svgrepo2-com.svg';

  const editButton = document.createElement('img');
  editButton.src = './assets/edit-svgrepo-com.svg';
  editButton.classList.add('action-icon');

  const deleteButton = document.createElement('img');
  deleteButton.src = './assets/delette-svgrepo-com.svg';
  deleteButton.classList.add('action-icon');

  // Configurar event listeners
  favoriteButton.addEventListener('click', async () => {
    try {
      if (place.isFavorite) {
        const success = await removeFavorite(place._id);
        if (success) {
          favoriteButton.src = '../assets/heart-svgrepo2-com.svg';
          place.isFavorite = false;
          await updatePlacesList();
        }
      } else {
        const success = await toggleFavorite(place._id);
        if (success) {
          favoriteButton.src = '../assets/heart-svgrepo1-com.svg';
          place.isFavorite = true;
          await updatePlacesList();
        }
      }
    } catch (error) {
      console.error('Error al cambiar estado de favorito:', error);
    }
  });

  editButton.addEventListener('click', () => {
    showUpdateForm(place);
  });

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

  // Agregar botones al contenedor de iconos
  actionIcons.appendChild(favoriteButton);
  actionIcons.appendChild(editButton);
  actionIcons.appendChild(deleteButton);

  // Agregar elementos al contenedor de acciones
  placeActions.appendChild(useCount);
  placeActions.appendChild(actionIcons);

  // Agregar todo al item del lugar
  placeItem.appendChild(placeInfo);
  placeItem.appendChild(placeActions);

  return placeItem;
};
