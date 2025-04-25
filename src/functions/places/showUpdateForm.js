import { api } from '../../api/api';
import { AlertNotification } from '../../components/AlertNotification/notification';
import { updatePlacesList } from './updatePlacesList';
import { createButton } from '../../components/Button/button';

//* Función para mostrar el formulario de actualización
export const showUpdateForm = (place) => {
  // Creamos el contenedor del formulario de actualización
  const formContainer = document.createElement('div');
  formContainer.classList.add('update-form');

  // Creamos el formulario de actualización
  const form = document.createElement('form');
  form.classList.add('update-place-form');

  // Creamos el contenedor para los campos del formulario
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

  // Creamos el contenedor para los botones del formulario
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons-container');

  // Manejador para actualizar el lugar
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Obtenemos los datos actualizados del formulario
    const updatedData = {
      name: document.getElementById('update-place-name').value,
      description: document.getElementById('update-place-description').value,
      location: document.getElementById('update-place-location').value
    };

    try {
      // Enviamos la solicitud de actualización al API
      await api({
        endpoint: `/places/${place._id}`,
        method: 'PUT',
        body: updatedData
      });

      // Eliminamos el formulario de actualización y mostramos una notificación de éxito
      formContainer.remove();
      AlertNotification('Éxito', 'Lugar actualizado correctamente', async () => {
        // Actualizamos la lista de lugares en lugar de recargar la página
        await updatePlacesList();
      });
    } catch (error) {
      console.error('Error al actualizar lugar:', error);
      AlertNotification('Error', 'No se pudo actualizar el lugar');
    }
  };

  // Creamos botones
  createButton(buttonsContainer, "Actualizar", "update-button", (e) => {
    handleUpdate(e);
  });

  createButton(buttonsContainer, "Cancelar", "cancel-button", () => {
    formContainer.remove();
  });

  // Agregamos los campos y botones al formulario
  form.appendChild(fieldsContainer);
  form.appendChild(buttonsContainer);
  formContainer.appendChild(form);

  document.body.appendChild(formContainer);
};

