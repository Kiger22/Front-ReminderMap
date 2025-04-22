import { AlertNotification } from "../AlertNotification/notification";
import { api } from "../../api/api";
import { loadReminders } from "../../functions/reminders/loadReminders";
import { createButton } from "../Button/button";
import('./updateReminder.css');
import { createField } from "../../utils/formUtils";

export const updateReminderForm = (reminder, onCancel = null) => {

  // Verificamos si ya existe un formulario abierto
  if (document.querySelector('.update-reminder-form')) {
    console.log("El formulario ya está abierto.");
    return;
  }

  const formContainer = document.createElement('div');
  formContainer.classList.add('update-reminder-form');

  const form = document.createElement('form');
  form.classList.add('update-reminder-container');

  // Contenedor para los campos
  const fieldsContainer = document.createElement('div');
  fieldsContainer.classList.add('fields-container');

  // Creamos los campos con los valores actuales del recordatorio
  fieldsContainer.appendChild(createField('Título', 'text', 'update-reminder-name', 'name', true, null, reminder.name));
  fieldsContainer.appendChild(createField('Descripción', 'text', 'update-reminder-description', 'description', true, null, reminder.description));
  fieldsContainer.appendChild(createField('Fecha', 'date', 'update-reminder-date', 'date', true, null, reminder.date.split('T')[0]));
  fieldsContainer.appendChild(createField('Hora', 'time', 'update-reminder-time', 'time', true, null, reminder.time));
  fieldsContainer.appendChild(createField('Ubicación', 'text', 'update-reminder-location', 'location', true, null, reminder.location));

  // Contenedor para botones
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons-container');

  // Manejador de actualización
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        name: document.getElementById('update-reminder-name').value,
        description: document.getElementById('update-reminder-description').value,
        date: document.getElementById('update-reminder-date').value,
        time: document.getElementById('update-reminder-time').value,
        location: document.getElementById('update-reminder-location').value
      };

      const response = await api({
        endpoint: `/reminders/${reminder._id}`,
        method: 'PUT',
        body: updatedData,
        token: localStorage.getItem('authToken')
      });

      if (response) {
        formContainer.remove();
        AlertNotification('Éxito', 'Recordatorio actualizado correctamente', () => {
          loadReminders();
        });
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      AlertNotification('Error', 'No se pudo actualizar el recordatorio', () => { });
    }
  };

  // Creamos botones usando el componente createButton
  createButton(buttonsContainer, "Actualizar", "update-button", (e) => {
    handleUpdate(e);
  });

  createButton(buttonsContainer, "Cancelar", "cancel-button", () => {
    formContainer.remove();
    // Si hay una función de callback para cancelar, la ejecutamos
    if (onCancel && typeof onCancel === 'function') {
      onCancel();
    }
  });

  form.appendChild(fieldsContainer);
  form.appendChild(buttonsContainer);
  formContainer.appendChild(form);

  document.body.appendChild(formContainer);
};
