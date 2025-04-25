import { api } from '../../api/api';
import { AlertNotification } from '../../components/AlertNotification/notification';
import { reminderPageForm } from '../../pages/AddReminder/reminder';
import { frequentPlacesPage } from '../../pages/FrecuentPlaces/frequentPlaces';
import { getCategories } from '../categories/getCategory';

const restorePlaceFormData = () => {
  const tempData = localStorage.getItem('tempPlaceData');
  if (tempData) {
    try {
      const data = JSON.parse(tempData);
      const nameInput = document.getElementById('place-name');
      const descriptionInput = document.getElementById('place-description');
      const locationInput = document.getElementById('location');
      const categorySelect = document.getElementById('place-category');

      if (nameInput && data.name) nameInput.value = data.name;
      if (descriptionInput && data.description) descriptionInput.value = data.description;
      if (locationInput && data.location) locationInput.value = data.location;

      // Seleccionar la categoría recién creada si existe
      if (categorySelect) {
        const lastCreatedCategoryId = localStorage.getItem('lastCreatedCategoryId');
        if (lastCreatedCategoryId) {
          // Buscamos la opción correspondiente
          const options = categorySelect.options;
          for (let i = 0; i < options.length; i++) {
            if (options[i].value === lastCreatedCategoryId) {
              categorySelect.selectedIndex = i;
              break;
            }
          }
          // Limpiamos después de usar
          localStorage.removeItem('lastCreatedCategoryId');
        }
      }

      // Limpiamos los datos temporales después de restaurar
      localStorage.removeItem('tempPlaceData');
    } catch (error) {
      console.error('Error al restaurar datos del formulario de lugar:', error);
    }
  }
};

//* Función para agregar un lugar
export const addPlace = async (fromReminder = false) => {
  try {

    // Obtenemos los datos de usuario y token
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');

    // Verificamos si el usuario está autenticado
    if (!userId || !authToken) {
      throw new Error('No hay autorización');
    }

    // Obtenemos el formulario y sus campos
    const currentForm = document.querySelector('.place-form');

    // Verificamos si el formulario y su contenedor existen
    if (!currentForm || !currentForm.parentNode) {
      throw new Error('No se encontró el contenedor del formulario');
    }
    const containerNode = currentForm.parentNode;

    // Obtenemos los campos del formulario
    const placeNameInput = document.getElementById('place-name');
    const descriptionInput = document.getElementById('place-description');
    const locationInput = document.getElementById('location');
    const categoryInput = document.getElementById('place-category');

    // Verificamos si todos los campos existen
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

    // Si hay una categoría seleccionada, usamos su ID
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

        // Si existe, usamos su ID
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

          // Si la categoría se creó correctamente, usamos su ID
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

    // Enviamos los datos del lugar al servidor
    try {
      const placeResponse = await api({
        endpoint: 'places',
        method: 'POST',
        body: placeData,
        token: authToken
      });
      console.log('Respuesta del servidor:', placeResponse);

      // Verificamos si la respuesta es válida
      if (placeResponse && placeResponse.lugar) {
        // Guardamos el ID y datos del lugar recién creado de manera más completa
        if (placeResponse.lugar && placeResponse.lugar._id) {
          const placeToStore = {
            id: placeResponse.lugar._id,
            _id: placeResponse.lugar._id, // Añadimos también con formato _id para compatibilidad
            name: placeResponse.lugar.name,
            location: placeResponse.lugar.location,
            value: placeResponse.lugar._id // Añadimos value para compatibilidad con el select
          };

          // Guardamos el lugar recién creado en localStorage
          localStorage.setItem('newCreatedPlace', JSON.stringify(placeToStore));
          localStorage.setItem('lastCreatedPlaceId', placeResponse.lugar._id);
          console.log('Lugar guardado en localStorage:', placeToStore);
        }

        // Función para limpiar el formulario
        const clearForm = () => {
          placeNameInput.value = '';
          descriptionInput.value = '';
          locationInput.value = '';
          categoryInput.value = '';
        };

        // Si venimos del formulario de recordatorio, restauramos los datos temporales
        if (fromReminder) {
          // Capturamos los datos temporales al inicio de la función
          const tempReminderData = localStorage.getItem('tempReminderData');
          console.log('Verificando datos temporales antes de procesar:', tempReminderData);

          // Guardamos inmediatamente una copia con otra clave para mayor seguridad
          if (tempReminderData) {
            localStorage.setItem('tempReminderDataBackup', tempReminderData);
            // También guardamos en sessionStorage como medida adicional
            sessionStorage.setItem('tempReminderData', tempReminderData);
            console.log('Copias de seguridad de datos creadas en localStorage y sessionStorage');
          }

          // Mostramos una notificación de éxito
          AlertNotification('Éxito', 'Lugar agregado correctamente', async () => {
            clearForm();

            // Intentamos restaurar los datos del formulario de recordatorio
            try {
              // Importamos dinámicamente el módulo de recordatorio
              const { reminderPageForm } = await import('../../pages/AddReminder/reminder.js');

              // Cargamos el formulario de recordatorio
              await reminderPageForm(containerNode);
              const maxAttempts = 15; // Aumentamos aún más el número de intentos
              let attempts = 0;

              // Función para restaurar los datos del formulario de recordatorio
              const restoreFormData = () => {
                attempts++;
                console.log(`Intento ${attempts} de restaurar datos del formulario`);

                // Intentamos obtener los datos de todas las fuentes posibles
                let tempData = localStorage.getItem('tempReminderData');
                if (!tempData) {
                  tempData = localStorage.getItem('tempReminderDataBackup');
                }
                if (!tempData) {
                  tempData = sessionStorage.getItem('tempReminderData');
                }
                if (!tempData) {
                  if (attempts < maxAttempts) {
                    setTimeout(restoreFormData, 700);
                    return;
                  }
                  return;
                }

                // Intentamos restaurar los datos
                try {

                  // Parseamos los datos
                  const data = JSON.parse(tempData);
                  console.log('Datos a restaurar:', data);

                  // Obtenemos los elementos del formulario
                  const nameInput = document.getElementById('reminder-name');
                  const descriptionInput = document.getElementById('reminder-description');
                  const dateInput = document.getElementById('reminder-date');
                  const timeInput = document.getElementById('reminder-time');
                  const locationSelect = document.getElementById('reminder-location');

                  // Verificamos que todos los elementos existan
                  if (!nameInput || !descriptionInput || !dateInput || !timeInput || !locationSelect) {
                    console.log('Algunos elementos del formulario no están disponibles aún');
                    if (attempts < maxAttempts) {
                      setTimeout(restoreFormData, 700);
                    }
                    return;
                  }

                  // Restauramos los valores
                  if (data.name) {
                    nameInput.value = data.name;
                    console.log('Nombre restaurado:', data.name);
                  }
                  if (data.description) {
                    descriptionInput.value = data.description;
                    console.log('Descripción restaurada:', data.description);
                  }
                  if (data.date) {
                    dateInput.value = data.date;
                    console.log('Fecha restaurada:', data.date);
                  }
                  if (data.time) {
                    timeInput.value = data.time;
                    console.log('Hora restaurada:', data.time);
                  }

                  // Ahora intentamos seleccionar el lugar recién creado
                  if (locationSelect) {
                    console.log('Intentando seleccionar lugar recién creado...');
                    // Esperamos a que las opciones estén cargadas
                    if (locationSelect.options.length <= 1) {
                      console.log('Opciones de ubicación no cargadas aún, esperando...');
                      if (attempts < maxAttempts) {
                        setTimeout(restoreFormData, 700);
                      }
                      return;
                    }

                    // Obtenemos los datos del lugar recién creado
                    let placeData = null;
                    try {
                      const newCreatedPlace = localStorage.getItem('newCreatedPlace');
                      if (newCreatedPlace) {
                        placeData = JSON.parse(newCreatedPlace);
                        console.log('Datos del lugar recién creado:', placeData);
                      }
                    } catch (e) {
                      console.error('Error al procesar datos del lugar:', e);
                    }

                    // Intentamos encontrar y seleccionar el lugar
                    let found = false;

                    // Estrategia simplificada: después de 5 intentos, seleccionamos la primera opción válida
                    if (attempts > 5) {
                      console.log('Después de varios intentos, seleccionando primera opción válida');
                      for (let i = 0; i < locationSelect.options.length; i++) {
                        const optionText = locationSelect.options[i].text;
                        if (!optionText.includes('Seleccione') && !optionText.includes('Añadir nuevo')) {
                          locationSelect.selectedIndex = i;
                          console.log(`Seleccionada primera opción válida: ${optionText}`);

                          // Disparamos evento change
                          const event = new Event('change', { bubbles: true });
                          locationSelect.dispatchEvent(event);

                          found = true;
                          break;
                        }
                      }
                    }
                    // En los primeros intentos, buscamos coincidencia exacta
                    else if (placeData) {
                      // Recorremos todas las opciones
                      for (let i = 0; i < locationSelect.options.length; i++) {
                        const option = locationSelect.options[i];
                        const optionText = option.text;
                        const optionValue = option.value;

                        // Ignoramos opciones especiales
                        if (optionText.includes('Seleccione') || optionText.includes('Añadir nuevo')) {
                          continue;
                        }

                        // Verificamos coincidencias
                        if (optionText === placeData.name ||
                          optionValue === placeData._id ||
                          optionValue === placeData.id) {

                          locationSelect.selectedIndex = i;
                          console.log(`Lugar encontrado en el dropdown (opción ${i}: ${optionText})`);

                          // Disparamos evento change
                          const event = new Event('change', { bubbles: true });
                          locationSelect.dispatchEvent(event);

                          found = true;
                          break;
                        }
                      }
                    }

                    // Si no encontramos coincidencias y aún no llegamos al máximo de intentos
                    if (!found && attempts < maxAttempts) {
                      console.log(`Lugar no encontrado, reintentando... (intento ${attempts} de ${maxAttempts})`);
                      setTimeout(restoreFormData, 700);
                      return;
                    }

                    // En cualquier caso, consideramos la restauración completa
                    setTimeout(() => {
                      localStorage.removeItem('tempReminderData');
                      localStorage.removeItem('tempReminderDataBackup');
                      sessionStorage.removeItem('tempReminderData');
                      console.log('Datos temporales eliminados');
                    }, 2000);
                  }

                  // Solo eliminamos los datos temporales si todo fue exitoso
                  if (attempts >= maxAttempts || (locationSelect && locationSelect.selectedIndex > 0)) {
                    console.log('Restauración completa, eliminando datos temporales en 2 segundos');
                    setTimeout(() => {
                      localStorage.removeItem('tempReminderData');
                      localStorage.removeItem('tempReminderDataBackup');
                      sessionStorage.removeItem('tempReminderData');
                      console.log('Datos temporales eliminados');
                    }, 2000);
                  }
                } catch (error) {
                  console.error('Error al restaurar datos:', error);
                  if (attempts < maxAttempts) {
                    setTimeout(restoreFormData, 700);
                  }
                }
              };

              // Iniciamos el proceso de restauración con un retraso mayor
              setTimeout(restoreFormData, 1000);

            } catch (error) {
              console.error('Error al redirigir:', error);
            }
          });
        } else {
          // Si no venimos del formulario de recordatorio, limpiamos el formulario
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
