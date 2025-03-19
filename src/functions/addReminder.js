import { api } from "../api/api";
import { AlertNotification } from "../components/AlertNotification/notification";
import { goToHomePage } from "./goHomePage";
import { getPlaces } from "./getPlaces";

export const addReminder = async () => {
  try {
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');

    if (!userId || !authToken) {
      throw new Error('No hay autorización');
    }

    // Obtener los valores del formulario
    const nameInput = document.getElementById('reminder-name');
    const descriptionInput = document.getElementById('reminder-description');
    const dateInput = document.getElementById('reminder-date');
    const timeInput = document.getElementById('reminder-time');
    const locationInput = document.getElementById('reminder-location');

    if (!nameInput || !descriptionInput || !dateInput || !timeInput || !locationInput) {
      throw new Error('Faltan campos en el formulario');
    }

    const locationText = locationInput.value;

    // Si se seleccionó un lugar existente (no 'new')
    if (locationText && locationText !== 'new') {
      try {
        const places = await getPlaces();
        const selectedPlace = places.find(place => place.location === locationText);

        if (selectedPlace) {
          console.log('Incrementando contador para lugar:', selectedPlace._id);
          const response = await api({
            endpoint: `/places/${selectedPlace._id}/increment-use`,
            method: 'PUT'
          });

          if (!response.éxito) {
            console.error('Error al incrementar contador:', response);
          }
        }
      } catch (error) {
        console.error('Error al actualizar el contador de uso:', error);
      }
    }

    // Crear el objeto con los datos del recordatorio
    const reminderData = {
      name: nameInput.value,
      description: descriptionInput.value,
      date: dateInput.value,
      time: timeInput.value,
      location: locationText,
      userId: userId
    };

    // Enviar el recordatorio
    const response = await api({
      endpoint: '/reminders',
      method: 'POST',
      body: reminderData
    });

    if (response.éxito) {
      AlertNotification('Éxito', 'Recordatorio creado correctamente', () => {
        goToHomePage();
      });
    }

    return response;
  } catch (error) {
    console.error('Error en addReminder:', error);
    AlertNotification('Error', 'No se pudo crear el recordatorio', null, {
      showCancelButton: false
    });
    throw error;
  }
};

