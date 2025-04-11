import { api } from '../../api/api';
import { AlertNotification } from '../../components/AlertNotification/notification';
import { reminderPageForm } from '../../pages/AddReminder/reminder';
import { frequentPlacesPage } from '../../pages/FrecuentPlaces/frequentPlaces';
import { getCategories } from '../categories/getCategory';

export const addPlace = async (fromReminder = false) => {
  try {
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');

    if (!userId || !authToken) {
      throw new Error('No hay autorización');
    }

    // Obtenemos el formulario y sus campos
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

    // Validamos que los campos requeridos no estén vacíos
    if (!placeNameInput.value.trim() || !locationInput.value.trim()) {
      throw new Error('El nombre y la ubicación son obligatorios');
    }

    // Preparamos los datos del lugar
    const placeData = {
      name: placeNameInput.value.trim(),
      description: descriptionInput.value.trim(),
      location: locationInput.value.trim(),
      userId: userId
    };

    // Verificamos si hay una categoría seleccionada
    let categoryId = null;
    if (categoryInput.value &&
      categoryInput.value.trim() !== '' &&
      categoryInput.value !== 'null' &&
      /^[0-9a-fA-F]{24}$/.test(categoryInput.value.trim())) {
      categoryId = categoryInput.value.trim();
    } else {
      // Intentamos obtener o crear una categoría "Desconocida"
      try {
        // Primero buscamos si ya existe una categoría "Desconocida"
        const categories = await getCategories(userId);
        const unknownCategory = categories.find(cat => cat.label === "Desconocida" || cat.name === "Desconocida");

        if (unknownCategory) {
          categoryId = unknownCategory.value || unknownCategory._id;
        } else {
          // Si no existe, la creamos
          const categoryResponse = await api({
            endpoint: 'categories',
            method: 'POST',
            body: {
              name: "Desconocida",
              description: "Categoría por defecto para lugares sin clasificar",
              userId: userId
            },
            token: authToken
          });

          if (categoryResponse && categoryResponse.category) {
            categoryId = categoryResponse.category._id;
          }
        }
      } catch (categoryError) {
        console.error('Error al obtener/crear categoría por defecto:', categoryError);
        // Continuamos sin categoría si hay error
      }
    }

    // Añadimos la categoría si se encontró o creó
    if (categoryId) {
      placeData.category = categoryId;
    }

    console.log('Enviando datos de lugar:', placeData);

    try {
      const placeResponse = await api({
        endpoint: 'places',
        method: 'POST',
        body: placeData,
        token: authToken
      });

      console.log('Respuesta del servidor:', placeResponse);

      if (placeResponse && placeResponse.lugar) {
        // Guardamos el ID del lugar recién creado para usarlo en el recordatorio
        if (placeResponse.lugar && placeResponse.lugar._id) {
          localStorage.setItem('newCreatedPlace', JSON.stringify({
            id: placeResponse.lugar._id,
            name: placeResponse.lugar.name,
            location: placeResponse.lugar.location
          }));
          localStorage.setItem('lastCreatedPlaceId', placeResponse.lugar._id);
        }

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
              // Importamos dinámicamente el módulo de recordatorio
              const { reminderPageForm } = await import('../../pages/AddReminder/reminder.js');
              await reminderPageForm(containerNode);

              // Restauramos los datos temporales si existen
              const tempData = localStorage.getItem('tempReminderData');
              if (tempData) {
                const data = JSON.parse(tempData);
                const nameInput = document.getElementById('reminder-name');
                const descriptionInput = document.getElementById('reminder-description');
                const dateInput = document.getElementById('reminder-date');
                const timeInput = document.getElementById('reminder-time');
                const locationSelect = document.getElementById('reminder-location');

                if (nameInput && data.name) nameInput.value = data.name;
                if (descriptionInput && data.description) descriptionInput.value = data.description;
                if (dateInput && data.date) dateInput.value = data.date;
                if (timeInput && data.time) timeInput.value = data.time;

                // Seleccionamos el lugar recién creado
                if (locationSelect && placeResponse.lugar) {
                  // Buscamos la opción que corresponde al lugar recién creado
                  const options = Array.from(locationSelect.options);
                  const option = options.find(opt => opt.value === placeResponse.lugar.location);
                  if (option) {
                    locationSelect.value = option.value;
                  }
                }

                // Limpiamos los datos temporales
                localStorage.removeItem('tempReminderData');
              }
            } catch (error) {
              console.error('Error al redirigir:', error);
            }
          });
        } else {
          AlertNotification('Éxito', 'Lugar agregado correctamente', () => {
            clearForm();
            currentForm.style.display = 'none';
            // Redirigir a la página de lugares frecuentes
            const heroContainer = document.querySelector('.hero-container');
            if (heroContainer) {
              frequentPlacesPage(heroContainer);
            }
          });
        }

        return true;
      }

      throw new Error('No se pudo crear el lugar');
    } catch (apiError) {
      console.error('Error en la API:', apiError);
      // Intentar obtener más detalles del error
      if (apiError.response && apiError.response.mensaje) {
        throw new Error(apiError.response.mensaje);
      }
      throw apiError;
    }
  } catch (error) {
    console.error('Error en addPlace:', error);
    AlertNotification('Error', error.message || 'Error al crear el lugar', () => { });
    return false;
  }
};
