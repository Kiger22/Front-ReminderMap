import { loadReminders } from '../../functions/reminders/loadReminders';
import { createReminderElement } from '../../functions/reminders/renderReminder';

import('./remindersList.css');

export const remindersPage = (node) => {

  // Limpiamos el contenido del nodo
  node.innerHTML = "";

  // Creamos el contenedor de recordatorios
  const remindersContainer = document.createElement('div');
  remindersContainer.classList.add('reminders-container');

  // Creamos el encabezado de la lista de recordatorios
  const header = document.createElement('h2');
  header.textContent = "Lista de Recordatorios";

  // Creamos la lista de recordatorios
  const remindersList = document.createElement('div');
  remindersList.classList.add('reminders-list');

  // Cargamos y Renderizamos recordatorios
  loadReminders()
    .then((reminders) => {
      if (reminders) {
        reminders.forEach((reminder) =>
          createReminderElement(reminder, remindersList));
      } else {
        console.log('No se obtuvieron recordatorios');
      }
    })
    // Mostramos un mensaje de error en caso de falla al cargar los recordatorios
    .catch((error) => {
      console.error('Error al cargar los recordatorios:', error);
      AlertNotification('Error', 'No se pudo cargar la lista de recordatorios.', () => { });
    });

  // Añadimos los elementos al contenedor
  remindersContainer.appendChild(header);
  remindersContainer.appendChild(remindersList);

  // Añadimos el contenedor al nodo
  node.appendChild(remindersContainer);
};
