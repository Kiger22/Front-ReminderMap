import { api } from "../../api/api";
import { AlertNotification } from "../../components/AlertNotification/notification";
import { remindersPage } from "../../pages/RemindersList/remindersList";
import { getPlaces } from "../places/getPlaces";

//* Función para agregar un recordatorio
export const addReminder = async () => {
  try {
    // Obtenemos los datos del usuario y la autorización
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');

    // Validamos que se hayan proporcionado los datos del usuario y la autorización
    if (!userId || !authToken) {
      throw new Error('No hay autorización');
    }

    // Obtenemos los valores del formulario
    const nameInput = document.getElementById('reminder-name');
    const descriptionInput = document.getElementById('reminder-description');
    const dateInput = document.getElementById('reminder-date');
    const timeInput = document.getElementById('reminder-time');
    const locationInput = document.getElementById('reminder-location');

    // Validamos que se hayan proporcionado los datos obligatorios del formulario
    if (!nameInput || !descriptionInput || !dateInput || !timeInput || !locationInput) {
      throw new Error('Faltan campos en el formulario');
    }

    // Obtenemos el valor del lugar seleccionado
    const locationText = locationInput.value;

    // Si se seleccionó un lugar existente (no 'new')
    if (locationText && locationText !== 'new') {
      // Actualizamos el contador de uso del lugar
      try {
        // Obtenemos la lista de lugares
        const places = await getPlaces();
        // Buscamos el lugar seleccionado
        const selectedPlace = places.find(place => place.location === locationText);

        // Incrementamos el contador de uso del lugar
        if (selectedPlace) {
          console.log('Incrementando contador para lugar:', selectedPlace._id);
          const response = await api({
            endpoint: `/places/${selectedPlace._id}/increment-use`,
            method: 'PUT'
          });

          // Verificamos si la actualización fue exitosa
          if (!response.éxito) {
            console.error('Error al incrementar contador:', response);
          }
        }
      } catch (error) {
        console.error('Error al actualizar el contador de uso:', error);
      }
    }

    // Creamos el objeto con los datos del recordatorio
    const reminderData = {
      name: nameInput.value,
      description: descriptionInput.value,
      date: dateInput.value,
      time: timeInput.value,
      location: locationText,
      userId: userId
    };

    // Enviamos el recordatorio
    const response = await api({
      endpoint: '/reminders',
      method: 'POST',
      body: reminderData
    });

    // Verificamos si el recordatorio se creó correctamente
    if (response.éxito) {
      AlertNotification('Éxito', 'Recordatorio creado correctamente', () => {
        // Redirigir a la página de recordatorios
        const heroContainer = document.querySelector('.hero-container');
        if (heroContainer) {
          remindersPage(heroContainer);
        }
      });
    }
    return response;
  }
  catch (error) {
    console.error('Error en addReminder:', error);
    AlertNotification('Error', 'No se pudo crear el recordatorio', null, {
      showCancelButton: false
    });
    throw error;
  }
};

