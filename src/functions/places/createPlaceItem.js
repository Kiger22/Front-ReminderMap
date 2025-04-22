import { showCategoryDetails } from '../categories/showCategoryDetails';
import { toggleFavorite, removeFavorite } from '../favorites/toggleFavorite';
import { api } from '../../api/api';
import { AlertNotification } from '../../components/AlertNotification/notification';
import { frequentPlacesPage } from '../../pages/FrecuentPlaces/frequentPlaces';
import { showUpdateForm } from './showUpdateForm';
import { updatePlacesList } from './updatePlacesList';
import { reminderPageForm } from '../../pages/AddReminder/reminder';
import { showPlaceReminders } from '../../components/PlaceReminders/placeReminders';
import { createMapModal } from '../../components/MapModal/mapModal';

// Función para crear un elemento de lugar
export const createPlaceItem = (place) => {
  const placeItem = document.createElement('div');
  placeItem.classList.add('place-item');

  // Contenedor de información principal
  const placeInfo = document.createElement('div');
  placeInfo.classList.add('place-info');

  const placeName = document.createElement('h3');
  placeName.textContent = place.name;

  const placeAddress = document.createElement('p');
  placeAddress.innerHTML = `<strong>Ubicación:</strong> <em>${place.address || place.location}</em>`;

  const placeDescription = document.createElement('p');
  placeDescription.classList.add('place-description');
  placeDescription.innerHTML = `<strong>Descripción:</strong> <em>${place.description}</em>`;

  const placeCategory = document.createElement('span');
  placeCategory.classList.add('place-category');
  placeCategory.innerHTML = place.category ? `<strong>Categoría:</strong> <em>${place.category.name}</em>` : '<strong>Categoría:</strong> <em>Sin categoría</em>';

  if (place.category) {
    placeCategory.style.cursor = 'pointer';
    placeCategory.onclick = (e) => {
      e.stopPropagation(); // Evitar que el clic se propague al elemento padre
      showCategoryDetails(place.category._id);
    };
  }

  // Agregamos elementos al placeInfo
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

  // Agregamos el evento click al contador para mostrar recordatorios
  useCount.style.cursor = 'pointer';
  useCount.addEventListener('click', (e) => {
    e.stopPropagation(); // Evitar que el clic se propague al elemento padre
    showPlaceReminders(place);
  });

  // Contenedor para los iconos de acción
  const actionIcons = document.createElement('div');
  actionIcons.classList.add('action-icons');

  // Creamos y configuramos los botones
  const favoriteButton = document.createElement('img');
  favoriteButton.classList.add('action-icon', 'favorite-icon');
  favoriteButton.src = place.isFavorite
    ? '../assets/heart-svgrepo1-com.svg'
    : '../assets/heart-svgrepo2-com.svg';

  // Botón para agregar recordatorio
  const reminderButton = document.createElement('img');
  reminderButton.classList.add('action-icon', 'reminder-icon');
  reminderButton.src = '../assets/add-svgrepo-com.svg';
  reminderButton.title = 'Crear recordatorio para este lugar';

  const editButton = document.createElement('img');
  editButton.src = './assets/edit-svgrepo-com.svg';
  editButton.classList.add('action-icon');

  const deleteButton = document.createElement('img');
  deleteButton.src = './assets/delette-svgrepo-com.svg';
  deleteButton.classList.add('action-icon');

  // Configuración de event listeners
  favoriteButton.addEventListener('click', async (e) => {
    e.stopPropagation(); // Evitar que el clic se propague al elemento padre
    try {
      if (place.isFavorite) {
        const success = await removeFavorite(place._id);
        if (success) {
          favoriteButton.src = '../assets/heart-svgrepo2-com.svg';
          place.isFavorite = false;
        }
      } else {
        const success = await toggleFavorite(place._id);
        if (success) {
          favoriteButton.src = '../assets/heart-svgrepo1-com.svg';
          place.isFavorite = true;
        }
      }
    } catch (error) {
      console.error('Error al cambiar estado de favorito:', error);
    }
  });

  // Event listener para el botón de agregar recordatorio
  reminderButton.addEventListener('click', async (e) => {
    e.stopPropagation(); // Evitar que el clic se propague al elemento padre
    try {
      // Guardamos temporalmente la información del lugar seleccionado
      localStorage.setItem('selectedPlace', JSON.stringify({
        id: place._id,
        name: place.name,
        location: place.location
      }));

      // Obtenemos el contenedor principal
      const mainContainer = document.querySelector('.hero-container');
      if (mainContainer) {
        // Limpiamos el contenedor actual
        mainContainer.innerHTML = '';
        // Cargamos el formulario de recordatorio
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

  editButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Evitar que el clic se propague al elemento padre
    showUpdateForm(place);
  });

  deleteButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Evitar que el clic se propague al elemento padre
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

            // Eliminamos el elemento de la interfaz
            placeItem.remove();

            // Verificamos si quedan lugares en la lista
            const remainingPlaces = document.querySelectorAll('.place-item');
            if (remainingPlaces.length === 0) {
              // Si no quedan lugares, recargamos solo la página de lugares frecuentes
              const heroContainer = document.querySelector('.hero-container');
              if (heroContainer) {
                frequentPlacesPage(heroContainer);
              }
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
      },
      { showCancelButton: true }
    );
  });

  // Agregamos los botones al contenedor de iconos
  actionIcons.appendChild(favoriteButton);
  actionIcons.appendChild(reminderButton);
  actionIcons.appendChild(editButton);
  actionIcons.appendChild(deleteButton);

  // Agregamos elementos al contenedor de acciones
  placeActions.appendChild(useCount);
  placeActions.appendChild(actionIcons);

  // Agregamos todo al item del lugar
  placeItem.appendChild(placeInfo);
  placeItem.appendChild(placeActions);

  // Añadimos evento click al elemento completo para mostrar el mapa
  placeItem.addEventListener('click', () => {
    createMapModal(place.location, place.name);
  });

  return placeItem;
};



