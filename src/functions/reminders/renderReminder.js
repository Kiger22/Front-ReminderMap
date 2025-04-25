import { AlertNotification } from "../../components/AlertNotification/notification";
import { deleteReminder } from "../reminders/deleteReminder";
import { loadReminders } from "../reminders/loadReminders";
import { updateReminderForm } from "../../components/UpdateReminderForm/updateReminder";
import { ReminderDetails } from "../../components/ReminderDetails/reminderDetails";
import { updatePlacesList } from '../places/updatePlacesList';
import { createMapModal } from '../../components/MapModal/mapModal';
import { createIconButton } from '../../components/IconButton/iconButton';

//* Función para crear un elemento de recordatorio
export const createReminderElement = (reminder, remindersList, updatePlacesList) => {

  // Verificamos si el recordatorio ya existe en la lista
  if (document.getElementById(`reminder-${reminder._id}`)) return;

  // Creamos el contenedor del recordatorio
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
        // Esperamos a que ReminderDetails se complete antes de continuar
        await new Promise(resolve => {
          ReminderDetails(
            reminder,
            null, null, null,   // day, monthName, year
            [],                 // dayReminders
            [],                 // allReminders
            null,               // formattedDate
            null,               // onCalendarUpdate
            () => {
              resolve();        // Resolvemos la promesa cuando se complete
            }
          );
          resolve();
        });
      } catch (error) {
        console.error('Error al mostrar detalles del recordatorio:', error);
      }
    }
  });

  // Creamos un contenedor para la información del recordatorio
  const reminderInfoContainer = document.createElement('div');
  reminderInfoContainer.classList.add('reminder-info-container');

  // Creamos los elementos para el recordatorio
  const name = document.createElement('h3');
  name.innerHTML = `<em>${reminder.name}</em>`;

  const description = document.createElement('h4');
  description.innerHTML = `<strong>Descripción:</strong> <em>${reminder.description}</em>`;

  const date = document.createElement('p');
  date.innerHTML = `<strong>Fecha:</strong> ${new Date(reminder.date).toLocaleDateString()}`;

  const time = document.createElement('p');
  time.innerHTML = `<strong>Hora:</strong> ${reminder.time}`;

  const location = document.createElement('p');

  // Verificamos si location es un objeto o un string
  if (typeof reminder.location === 'object' && reminder.location !== null) {
    location.textContent = `${reminder.location.name} (${reminder.location.location})`;
  } else {
    // Si es un string, intentamos obtener el nombre del lugar del select y sino usamos el string directamente
    const locationSelect = document.getElementById('reminder-location');
    if (locationSelect) {
      const selectedOption = Array.from(locationSelect.options).find(option => option.value === reminder.location);
      location.textContent = selectedOption ? selectedOption.textContent : reminder.location;
    } else {
      location.textContent = reminder.location;
    }
  }

  // Añadimos los elementos al contenedor de información
  reminderInfoContainer.appendChild(name);
  reminderInfoContainer.appendChild(description);
  reminderInfoContainer.appendChild(date);
  reminderInfoContainer.appendChild(time);
  reminderInfoContainer.appendChild(location);

  // Añadimos el contenedor de información al contenedor principal
  reminderItem.appendChild(reminderInfoContainer);

  // Manejador para el botón de ver en mapa
  const handleMapClick = (e) => {
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
  };

  // Manejador para el botón de editar
  const handleEditClick = (e) => {
    e.stopPropagation(); // Evitar que el clic se propague al elemento padre
    console.log(`Editar recordatorio: ${reminder._id}`);
    updateReminderForm(reminder);
  };

  // Manejador para el botón de eliminar
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Evitar que el clic se propague al elemento padre
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
  };

  // Creamos un contenedor para los botones de acción
  const actionButtonsContainer = document.createElement('div');
  actionButtonsContainer.classList.add('reminder-actions');

  // Creamos los botones de acción

  // Botón para ver en el mapa
  createIconButton(
    actionButtonsContainer,
    '../assets/eye-svgrepo-com.svg',
    handleMapClick,
    'Ver ubicación en mapa'
  );

  // Botón para editar
  createIconButton(
    actionButtonsContainer,
    './assets/edit-svgrepo-com.svg',
    handleEditClick,
    'Editar recordatorio'
  );

  // Botón para eliminar
  createIconButton(
    actionButtonsContainer,
    '../assets/delette-svgrepo-com.svg',
    handleDeleteClick,
    'Eliminar recordatorio'
  );

  // Añadimos el contenedor de botones al elemento del recordatorio
  reminderItem.appendChild(actionButtonsContainer);

  remindersList.appendChild(reminderItem);
};
