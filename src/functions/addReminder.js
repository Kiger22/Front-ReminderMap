import { api } from "../api/api";
import { AlertNotification } from "../components/AlertNotification/notification";
import { goToHomePage } from "./goHomePage";

export const addReminder = async () => {
  try {
    // Obtenemos el ID del usuario
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');
    console.log('userID', userId, 'Token de autenticación:', authToken);

    // Validamos que haya un ID de usuario
    if (!userId) {
      throw new Error('No hay ID de usuario');
    }

    // Validamos que el formato de userId sea un ObjectID válido
    const isValidObjectId = /^[a-f\d]{24}$/i.test(userId);
    if (!isValidObjectId) {
      throw new Error('El ID de usuario no tiene un formato válido de ObjectID');
    }

    // Validamos que haya un token de autenticación
    if (!authToken) {
      throw new Error('No hay token de autenticación');
    }

    // Obtenemos los datos del formulario
    const reminderName = document.getElementById('reminder-name').value;
    const reminderDescription = document.getElementById('reminder-description').value;
    const reminderDate = document.getElementById('reminder-date').value;
    const reminderTime = document.getElementById('reminder-time').value;
    const reminderLocation = document.getElementById('reminder-location').value;

    // Validamos que los datos no estén vacíos
    if (!reminderName || !reminderDescription || !reminderDate || !reminderTime || !reminderLocation) {
      throw new Error('Todos los campos son obligatorios');
    }

    // Creamos el objeto con los datos del recordatorio
    const reminderData = {
      userId: userId,
      name: reminderName,
      description: reminderDescription,
      date: reminderDate,
      time: reminderTime,
      location: reminderLocation,
    };
    console.log('Datos del recordatorio:', reminderData);

    // Realizamos la petición al servidor usando la función api
    const response = await api({
      endpoint: '/reminders',
      method: 'POST',
      body: reminderData,
      token: authToken,
    });
    console.log('Respuesta del servidor:', response);

    // Manejamos la respuesta del servidor
    if (response) {
      console.log('Recordatorio creado:', response);
      AlertNotification('Recordatorio creado', 'El recordatorio se ha creado correctamente', () => {
        // Limpiamos los campos del formulario
        document.getElementById('reminder-name').value = '';
        document.getElementById('reminder-description').value = '';
        document.getElementById('reminder-date').value = '';
        document.getElementById('reminder-time').value = '';
        document.getElementById('reminder-location').value = '';
        // Redirigimos a la página de inicio
        goToHomePage();
      });
    } else {
      throw new Error(response.message || 'Respuesta no válida del servidor');
    }
  } catch (error) {
    console.error('Error en el proceso de creación de recordatorio:', error);
    AlertNotification('Error', error.message, () => { });
  }
};

