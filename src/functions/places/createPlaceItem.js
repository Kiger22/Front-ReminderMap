import { showCategoryDetails } from '../categories/showCategoryDetails';
import { toggleFavorite, removeFavorite } from '../favorites/toggleFavorite';
import { api } from '../../api/api';
import { AlertNotification } from '../../components/AlertNotification/notification';
import { frequentPlacesPage } from '../../pages/FrecuentPlaces/frequentPlaces';
import { showUpdateForm } from './showUpdateForm';
import { reminderPageForm } from '../../pages/AddReminder/reminder';
import { showPlaceReminders } from '../../pages/FrecuentPlaces/PlaceReminders/placeReminders';
import { createMapModal } from '../../components/MapModal/mapModal';
import { createIconButton } from '../../components/IconButton/iconButton';

//* Función para crear un elemento de lugar
export const createPlaceItem = (place) => {
  const placeItem = document.createElement('div');
  placeItem.classList.add('place-item');

  // Contenedor de información principal
  const placeInfo = document.createElement('div');
  placeInfo.classList.add('place-info');

  // Elementos de información principal

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

  // Agregamos un evento click al nombre de la categoría para mostrar detalles
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

  // Contador de uso
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

  // Manejador para el botón de favorito
  const handleFavoriteClick = async (e) => {
    e.stopPropagation(); // Evitar que el clic se propague al elemento padre
    try {
      if (place.isFavorite) {
        const success = await removeFavorite(place._id);
        if (success) {
          // Actualizamos el icono
          const favoriteIcon = actionIcons.querySelector('.favorite-icon');
          if (favoriteIcon) {
            favoriteIcon.src = '../assets/heart-svgrepo2-com.svg';
          }
          place.isFavorite = false;
        }
      } else {
        const success = await toggleFavorite(place._id);
        if (success) {
          // Actualizamos el icono
          const favoriteIcon = actionIcons.querySelector('.favorite-icon');
          if (favoriteIcon) {
            favoriteIcon.src = '../assets/heart-svgrepo1-com.svg';
          }
          place.isFavorite = true;
        }
      }
    } catch (error) {
      console.error('Error al cambiar estado de favorito:', error);
    }
  };

  // Manejador para el botón de recordatorio
  const handleReminderClick = async (e) => {
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
  };

  // Manejador para el botón de editar
  const handleEditClick = (e) => {
    e.stopPropagation(); // Evitar que el clic se propague al elemento padre
    showUpdateForm(place);
  };

  // Manejador para el botón de eliminar
  const handleDeleteClick = (e) => {
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
  };

  // Creamos el botón de favorito manualmente
  const imgFavorite = document.createElement('img');
  imgFavorite.src = place.isFavorite ? '../assets/heart-svgrepo1-com.svg' : '../assets/heart-svgrepo2-com.svg';
  imgFavorite.alt = 'Favorito';
  imgFavorite.title = 'Marcar/Desmarcar como favorito';
  imgFavorite.classList.add('action-icon', 'favorite-icon');
  imgFavorite.addEventListener('click', handleFavoriteClick);
  actionIcons.appendChild(imgFavorite);

  // Botón de recordatorio
  createIconButton(
    actionIcons,
    '../assets/add-svgrepo-com.svg',
    handleReminderClick,
    'Crear recordatorio para este lugar'
  );

  // Botón de editar
  createIconButton(
    actionIcons,
    './assets/edit-svgrepo-com.svg',
    handleEditClick,
    'Editar lugar'
  );

  // Botón de eliminar
  createIconButton(
    actionIcons,
    './assets/delette-svgrepo-com.svg',
    handleDeleteClick,
    'Eliminar lugar'
  );

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








