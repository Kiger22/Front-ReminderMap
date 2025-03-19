import { api } from '../api/api';
import { AlertNotification } from '../components/AlertNotification/notification';
import { reminderPageForm } from '../pages/AddReminder/reminder';

export const addPlace = async (fromReminder = false) => {
  console.log('addPlace called with fromReminder:', fromReminder);

  try {
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');

    if (!userId || !authToken) {
      throw new Error('No hay autorización');
    }

    // Obtener el nodo contenedor actual
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
      endpoint: 'places',
      method: 'POST',
      body: placeData,
      token: authToken
    });

    if (placeResponse && placeResponse.lugar) {
      localStorage.setItem('newCreatedPlace', JSON.stringify(placeResponse.lugar));

      if (fromReminder) {
        console.log('Attempting to redirect back to reminder form');
        console.log('Container node found:', !!containerNode);

        if (containerNode) {
          // Primero mostramos la notificación
          AlertNotification('Éxito', 'Lugar agregado correctamente', async () => {
            // Después de que el usuario cierre la notificación, redirigimos
            try {
              await reminderPageForm(containerNode);
            } catch (error) {
              console.error('Error al redirigir:', error);
            }
          });
        } else {
          console.error('No se encontró el contenedor para la redirección');
        }
      } else {
        AlertNotification('Éxito', 'Lugar agregado correctamente', () => { });
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
