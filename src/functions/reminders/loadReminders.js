import { api } from '../../api/api';
import { AlertNotification } from '../../components/AlertNotification/notification';
import { createLoginForm } from '../../components/LoginForm/login';
import { createReminderElement } from './renderReminder';

//* Función para cargar los recordatorios
export const loadReminders = async (options = { render: true }) => {
  try {
    // Obtenemos los datos de usuario y token de autenticación
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');

    // Validamos que se proporcionen los datos necesarios
    if (!userId) {
      throw new Error('No hay ID de usuario');
    }

    // Validamos que haya un token de autenticación
    if (!authToken) {
      AlertNotification('Debes ser usuario', 'Inicia Sesión', () => {
        createLoginForm();
      });
      return null;
    }

    console.log(`Intentando cargar recordatorios para el usuario: ${userId}`);

    // Realizamos la solicitud a la API
    const response = await api({
      endpoint: `reminders/${userId}`,
      method: 'GET',
    });

    // Verificamos que la respuesta sea válida y contenga recordatorios
    if (response && response.recordatorios && Array.isArray(response.recordatorios)) {
      // Si se especifica renderizar, lo hacemos
      if (options.render) {

        // Obtenemos el contenedor de recordatorios y validamos que exista
        const remindersList = document.querySelector('.reminders-list');
        if (!remindersList) {
          console.error('No se encontró el elemento .reminders-list');
          throw new Error('No se encontró el contenedor de recordatorios');
        }

        // Limpiamos el contenedor
        remindersList.innerHTML = '';

        // Si no hay recordatorios, mostramos un mensaje
        if (response.recordatorios.length === 0) {
          const emptyMessage = document.createElement('p');
          emptyMessage.textContent = 'No hay recordatorios disponibles';
          emptyMessage.classList.add('empty-message');
          remindersList.appendChild(emptyMessage);
          return [];
        }

        // Procesamos y ordenamos los recordatorios
        const uniqueReminders = Array.from(
          new Map(response.recordatorios.map(reminder => [reminder._id, reminder])).values()
        );
        uniqueReminders.sort((a, b) => {
          const dateTimeA = new Date(`${a.date.split('T')[0]}T${a.time}:00`).getTime();
          const dateTimeB = new Date(`${b.date.split('T')[0]}T${b.time}:00`).getTime();
          return dateTimeA - dateTimeB;
        });

        // Renderizamos los recordatorios
        uniqueReminders.forEach(reminder => {
          try {
            createReminderElement(reminder, remindersList);
          } catch (renderError) {
            console.error('Error al renderizar recordatorio:', renderError);
          }
        });
        return uniqueReminders;
      }
      return response.recordatorios;
    }
    throw new Error('Formato de respuesta inválido');
  }
  catch (error) {
    console.error('Error al cargar recordatorios:', error);

    // Mostrar una notificación al usuario si el error es de conexión
    if (error.message.includes('No se pudo conectar al servidor')) {
      AlertNotification(
        'Error de conexión',
        'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.',
        null,
        { showCancelButton: false }
      );
    }
    return null;
  }
};
