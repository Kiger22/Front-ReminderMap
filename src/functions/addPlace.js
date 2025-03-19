import { api } from '../api/api';
import { AlertNotification } from '../components/AlertNotification/notification';
import { reminderPageForm } from '../pages/AddReminder/reminder';
import { favoritesPlacesPage } from '../pages/FavoritesPlaces/favoritesPlaces';

export const addPlace = async (fromReminder = false) => {
  try {
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');

    if (!userId || !authToken) {
      throw new Error('No hay autorización');
    }

    // Obtener el formulario y sus campos
    const currentForm = document.querySelector('.place-form');
    if (!currentForm || !currentForm.parentNode) {
      throw new Error('No se encontró el contenedor del formulario');
    }
    const containerNode = currentForm.parentNode;

    const placeNameInput = document.getElementById('place-name');
    const descriptionInput = document.getElementById('place-description');
    const locationInput = document.getElementById('location');
    const categoryInput = document.getElementById('place-category');

    if (!placeNameInput || !descriptionInput || !locationInput || !categoryInput) {
      throw new Error('No se encontraron todos los campos del formulario');
    }

    const placeData = {
      name: placeNameInput.value.trim(),
      description: descriptionInput.value.trim(),
      location: locationInput.value.trim(),
      category: categoryInput.value.trim(),
      userId: userId
    };

    if (!placeData.name || !placeData.location) {
      throw new Error('El nombre y la ubicación son obligatorios');
    }

    const placeResponse = await api({
      endpoint: '/places',
      method: 'POST',
      body: placeData
    });

    if (placeResponse && placeResponse.lugar) {
      localStorage.setItem('newCreatedPlace', JSON.stringify(placeResponse.lugar));

      // Función para limpiar el formulario
      const clearForm = () => {
        placeNameInput.value = '';
        descriptionInput.value = '';
        locationInput.value = '';
        categoryInput.value = '';
      };

      if (fromReminder) {
        AlertNotification('Éxito', 'Lugar agregado correctamente', async () => {
          clearForm();
          try {
            await reminderPageForm(containerNode);
          } catch (error) {
            console.error('Error al redirigir:', error);
          }
        });
      } else {
        AlertNotification('Éxito', 'Lugar agregado correctamente', () => {
          clearForm();
          currentForm.style.display = 'none';
          // Redirigir a la página de lugares favoritos
          const heroContainer = document.querySelector('.hero-container');
          if (heroContainer) {
            favoritesPlacesPage(heroContainer);
          }
        });
      }

      return true;
    }

    throw new Error('No se pudo crear el lugar');
  } catch (error) {
    console.error('Error en addPlace:', error);
    AlertNotification('Error', error.message || 'Error al crear el lugar', () => { });
    return false;
  }
};
