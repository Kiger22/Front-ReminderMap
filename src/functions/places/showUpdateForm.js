import { api } from '../../api/api';
import { AlertNotification } from '../../components/AlertNotification/notification';

// Función para mostrar el formulario de actualización
export const showUpdateForm = (place) => {
  const formContainer = document.createElement('div');
  formContainer.classList.add('update-form-container');

  const form = document.createElement('form');
  form.classList.add('update-place-form');

  const fieldsContainer = document.createElement('div');
  fieldsContainer.classList.add('fields-container');

  // Creamos los campos del formulario
  const fields = [
    { id: 'name', label: 'Nombre', value: place.name },
    { id: 'description', label: 'Descripción', value: place.description },
    { id: 'location', label: 'Ubicación', value: place.location }
  ];

  fields.forEach(field => {
    const inputSpan = document.createElement('span');
    inputSpan.classList.add('input-span');

    const label = document.createElement('label');
    label.textContent = field.label;
    label.htmlFor = `update-place-${field.id}`;

    const input = document.createElement('input');
    input.type = 'text';
    input.id = `update-place-${field.id}`;
    input.value = field.value;
    input.required = true;

    inputSpan.appendChild(label);
    inputSpan.appendChild(input);
    fieldsContainer.appendChild(inputSpan);
  });

  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons-container');

  // Botón de actualizar
  const updateButton = document.createElement('button');
  updateButton.textContent = 'Actualizar';
  updateButton.id = 'update-button';
  updateButton.type = 'submit';

  // Botón de cancelar
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancelar';
  cancelButton.id = 'cancel-button';
  cancelButton.type = 'button';

  buttonsContainer.appendChild(updateButton);
  buttonsContainer.appendChild(cancelButton);

  form.appendChild(fieldsContainer);
  form.appendChild(buttonsContainer);
  formContainer.appendChild(form);

  // Manejador del formulario
  form.onsubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      name: document.getElementById('update-place-name').value,
      description: document.getElementById('update-place-description').value,
      location: document.getElementById('update-place-location').value
    };

    try {
      await api({
        endpoint: `/places/${place._id}`,
        method: 'PUT',
        body: updatedData
      });

      formContainer.remove();
      AlertNotification('Éxito', 'Lugar actualizado correctamente', () => {
        location.reload();
      });
    } catch (error) {
      console.error('Error al actualizar lugar:', error);
      AlertNotification('Error', 'No se pudo actualizar el lugar');
    }
  };

  cancelButton.onclick = () => formContainer.remove();

  document.body.appendChild(formContainer);
};