import { AlertNotification } from "../components/AlertNotification/notification";
import { deleteReminder } from "./deleteReminder";
import { loadReminders } from "./loadReminders";
import { updateReminderForm } from "../components/UpdateReminderForm/updateReminder";

export const createReminderElement = (reminder, remindersList) => {
  // Verificamos si el recordatorio ya existe en la lista
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
  // Verificamos si location es un objeto (lugar completo) o un string (ID)
  if (typeof reminder.location === 'object' && reminder.location !== null) {
    location.textContent = `${reminder.location.name} (${reminder.location.location})`;
  } else {
    // Si es un string (ID), intentamos obtener el nombre del lugar del select
    const locationSelect = document.getElementById('reminder-location');
    if (locationSelect) {
      const selectedOption = Array.from(locationSelect.options).find(option => option.value === reminder.location);
      location.textContent = selectedOption ? selectedOption.textContent : reminder.location;
    } else {
      location.textContent = reminder.location;
    }
  }

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
    // Mostramos una notificación de confirmación antes de eliminar
    AlertNotification(
      '¿Eliminar recordatorio?',
      '¿Estás seguro de que deseas eliminar este recordatorio?',
      async (confirmed) => {
        if (confirmed) {
          try {
            await deleteReminder(reminder._id);
            reminderItem.remove();

            if (!document.querySelector('.reminder-item')) {
              await loadReminders();
            }

            AlertNotification('Éxito', 'Recordatorio eliminado correctamente', null, {
              showCancelButton: false // Solo mostrar botón de aceptar
            });
          } catch (error) {
            console.error('Error al eliminar el recordatorio:', error);
            AlertNotification('Error', 'No se pudo eliminar el recordatorio', null, {
              showCancelButton: false
            });
          }
        }
      }
    );
  });

  // Añadimos los elementos al contenedor
  reminderItem.appendChild(name);
  reminderItem.appendChild(description);
  reminderItem.appendChild(date);
  reminderItem.appendChild(time);
  reminderItem.appendChild(location);
  reminderItem.appendChild(editButton);
  reminderItem.appendChild(deleteButton);

  remindersList.appendChild(reminderItem);
};
