import { AlertNotification } from "../../components/AlertNotification/notification";
import { deleteReminder } from "../reminders/deleteReminder";
import { loadReminders } from "../reminders/loadReminders";
import { updateReminderForm } from "../../components/UpdateReminderForm/updateReminder";
import { ReminderDetails } from "../../components/ReminderDetails/reminderDetails";
import { updatePlacesList } from '../places/updatePlacesList';
import { createMapModal } from '../../components/MapModal/mapModal';

export const createReminderElement = (reminder, remindersList, updatePlacesList) => {

  // Verificamos si el recordatorio ya existe en la lista
  if (document.getElementById(`reminder-${reminder._id}`)) return;

  const reminderItem = document.createElement('div');
  reminderItem.classList.add('reminder-item');
  reminderItem.id = `reminder-${reminder._id}`;
  reminderItem.style.cursor = 'pointer';

  // Añadimos evento click para mostrar detalles
  reminderItem.addEventListener('click', async (event) => {
    // Evitamos que el click se propague a los botones
    if (event.target === reminderItem ||
      event.target.tagName !== 'IMG') {
      try {
        // Usamos await para asegurarnos de que la promesa se resuelva
        await new Promise(resolve => {
          ReminderDetails(
            reminder,
            null, null, null, // day, monthName, year
            [], // dayReminders
            [], // allReminders
            null, // formattedDate
            null, // onCalendarUpdate
            () => {
              resolve(); // Resolvemos la promesa cuando se complete
            }
          );
          // Si ReminderDetails no espera una función de callback, resolvemos inmediatamente
          resolve();
        });
      } catch (error) {
        console.error('Error al mostrar detalles del recordatorio:', error);
      }
    }
  });

  const name = document.createElement('h3');
  name.innerHTML = `<em>${reminder.name}</em>`;

  const description = document.createElement('h4');
  description.innerHTML = `<strong>Descripción:</strong> <em>${reminder.description}</em>`;

  const date = document.createElement('p');
  date.innerHTML = `<strong>Fecha:</strong> ${new Date(reminder.date).toLocaleDateString()}`;

  const time = document.createElement('p');
  time.innerHTML = `<strong>Hora:</strong> ${reminder.time}`;

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

  // Botón para ver en el mapa
  const mapButton = document.createElement('img');
  mapButton.src = '../assets/eye-svgrepo-com.svg';
  mapButton.title = 'Ver ubicación en mapa';
  mapButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Evitar que el clic se propague al elemento padre

    // Obtenemos la ubicación del recordatorio
    const location = typeof reminder.location === 'object' && reminder.location !== null
      ? reminder.location.location
      : reminder.location;

    // Obtenemos el nombre del lugar
    const placeName = typeof reminder.location === 'object' && reminder.location !== null
      ? reminder.location.name
      : 'Ubicación del recordatorio';

    // Mostramos el mapa en un modal
    createMapModal(location, placeName);
  });

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

            // Actualizamos la lista de lugares para reflejar el cambio en el contador
            if (typeof updatePlacesList === 'function') {
              await updatePlacesList();
            }

            if (!document.querySelector('.reminder-item')) {
              await loadReminders();
            }

            AlertNotification('Éxito', 'Recordatorio eliminado correctamente', null, {
              showCancelButton: false
            });
          }
          catch (error) {
            console.error('Error al eliminar el recordatorio:', error);
            AlertNotification('Error', 'No se pudo eliminar el recordatorio', null, {
              showCancelButton: false
            });
          }
        }
      },
      { showCancelButton: true }
    );
  });

  // Añadimos los elementos al contenedor
  reminderItem.appendChild(name);
  reminderItem.appendChild(description);
  reminderItem.appendChild(date);
  reminderItem.appendChild(time);
  reminderItem.appendChild(location);
  reminderItem.appendChild(mapButton);
  reminderItem.appendChild(editButton);
  reminderItem.appendChild(deleteButton);

  remindersList.appendChild(reminderItem);
};
