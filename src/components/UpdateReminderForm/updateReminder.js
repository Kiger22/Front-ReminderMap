import { AlertNotification } from "../AlertNotification/notification";
import { api } from "../../api/api";
import { loadReminders } from "../../functions/loadReminders";
import { createButton } from "../Button/button";
import('./updateReminder.css');

export const updateReminderForm = (reminder) => {

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

  const createField = (labelText, inputType, inputId, value) => {
    const span = document.createElement('span');
    span.classList.add('input-span');

    const label = document.createElement('label');
    label.setAttribute('for', inputId);
    label.textContent = labelText;

    const input = document.createElement('input');
    input.type = inputType;
    input.id = inputId;
    input.value = value;
    input.required = true;

    span.appendChild(label);
    span.appendChild(input);
    return span;
  };

  // Creamos los campos con los valores actuales del recordatorio
  fieldsContainer.appendChild(createField('Título', 'text', 'update-reminder-name', reminder.name));
  fieldsContainer.appendChild(createField('Descripción', 'text', 'update-reminder-description', reminder.description));
  fieldsContainer.appendChild(createField('Fecha', 'date', 'update-reminder-date', reminder.date.split('T')[0]));
  fieldsContainer.appendChild(createField('Hora', 'time', 'update-reminder-time', reminder.time));
  fieldsContainer.appendChild(createField('Ubicación', 'text', 'update-reminder-location', reminder.location));

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

  // Crear botones usando el componente createButton
  createButton(buttonsContainer, "Actualizar", "update-button", (e) => {
    e.preventDefault();
    handleUpdate(e);
  });

  createButton(buttonsContainer, "Cancelar", "cancel-button", () => {
    formContainer.remove();
  });

  form.appendChild(fieldsContainer);
  form.appendChild(buttonsContainer);
  formContainer.appendChild(form);

  document.body.appendChild(formContainer);
};
