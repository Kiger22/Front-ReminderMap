import { AlertNotification } from "../components/AlertNotification/notification";
import { deleteReminder } from "./deleteReminder";
import { loadReminders } from "./loadReminders";
import { updateReminderForm } from "../components/UpdateReminderForm/updateReminder";

export const createReminderElement = (reminder, remindersList) => {
  // Verificar si el recordatorio ya existe en la lista
  if (document.getElementById(`reminder-${reminder._id}`)) return;

  const reminderItem = document.createElement('div');
  reminderItem.classList.add('reminder-item');
  reminderItem.id = `reminder-${reminder._id}`; // Asignar ID único

  const name = document.createElement('h3');
  name.textContent = reminder.name;

  const description = document.createElement('h4');
  description.textContent = reminder.description;

  const date = document.createElement('p');
  date.textContent = `Fecha: ${new Date(reminder.date).toLocaleDateString()}`;

  const time = document.createElement('p');
  time.textContent = `Hora: ${reminder.time}`;

  const location = document.createElement('p');
  location.textContent = `${reminder.location}`;

  // Botón de editar
  const editButton = document.createElement('img');
  editButton.src = './assets/edit-svgrepo-com.svg';
  editButton.addEventListener('click', () => {
    console.log(`Editar recordatorio: ${reminder._id}`);
    updateReminderForm(reminder);
  });

  // Botón de eliminar
  const deleteButton = document.createElement('img');
  deleteButton.src = '../assets/delette-svgrepo-com.svg';
  deleteButton.addEventListener('click', () => {
    // Mostrar confirmación antes de eliminar
    AlertNotification(
      '¿Eliminar recordatorio?',
      '¿Estás seguro de que deseas eliminar este recordatorio?',
      async () => {
        try {
          console.log(`Eliminar recordatorio: ${reminder._id}`);
          await deleteReminder(reminder._id);
          reminderItem.remove();

          // Si ya no hay recordatorios en la lista, recargar
          if (!document.querySelector('.reminder-item')) {
            await loadReminders();
          }

          // Mostrar mensaje de éxito
          AlertNotification('Éxito', 'Recordatorio eliminado correctamente', () => { });
        } catch (error) {
          console.error('Error al eliminar el recordatorio:', error);
          AlertNotification('Error', 'No se pudo eliminar el recordatorio.', () => { });
        }
      },
      false // Para que no se cierre automáticamente
    );
  });

  // Añadir los elementos al contenedor
  reminderItem.appendChild(name);
  reminderItem.appendChild(description);
  reminderItem.appendChild(date);
  reminderItem.appendChild(time);
  reminderItem.appendChild(location);
  reminderItem.appendChild(editButton);
  reminderItem.appendChild(deleteButton);

  remindersList.appendChild(reminderItem);
};
