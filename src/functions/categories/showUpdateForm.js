import { api } from '../../api/api';
import { AlertNotification } from '../../components/AlertNotification/notification';
import { createButton } from '../../components/Button/button';

export const showUpdateForm = (category) => {
  // Creamos el contenedor del formulario de actualización de categoría
  const formContainer = document.createElement('div');
  formContainer.classList.add('update-category-form-container');

  // Creamos el formulario de actualización de categoría
  const form = document.createElement('form');
  form.classList.add('update-category-form');

  // Creamos el contenedor para los campos del formulario de actualización de categoría
  const fieldsContainer = document.createElement('div');
  fieldsContainer.classList.add('fields-container');

  // Creamos los campos del formulario
  const fields = [
    { id: 'name', label: 'Nombre', value: category.name },
    { id: 'description', label: 'Descripción', value: category.description }
  ];
  fields.forEach(field => {
    const inputSpan = document.createElement('span');
    inputSpan.classList.add('input-span');

    const label = document.createElement('label');
    label.textContent = field.label;
    label.htmlFor = `update-category-${field.id}`;

    const input = document.createElement('input');
    input.type = 'text';
    input.id = `update-category-${field.id}`;
    input.value = field.value;
    input.required = true;

    inputSpan.appendChild(label);
    inputSpan.appendChild(input);
    fieldsContainer.appendChild(inputSpan);
  });

  // Creamos el contenedor para los botones del formulario de actualización de categoría
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons-container');

  form.appendChild(fieldsContainer);
  form.appendChild(buttonsContainer);
  formContainer.appendChild(form);

  // Manejador del formulario
  form.onsubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      name: document.getElementById('update-category-name').value,
      description: document.getElementById('update-category-description').value
    };

    try {
      const authToken = localStorage.getItem('authToken');
      await api({
        endpoint: `/categories/${category._id}`,
        method: 'PUT',
        body: updatedData,
        token: authToken
      });

      formContainer.remove();
      AlertNotification('Éxito', 'Categoría actualizada correctamente', () => {
        location.reload();
      });
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      AlertNotification('Error', 'No se pudo actualizar la categoría');
    }
  };

  // creamos botones de actualizar y cancelar
  createButton(buttonsContainer, 'Actualizar', 'update-button', null);
  createButton(buttonsContainer, 'Cancelar', 'cancel-button', () => formContainer.remove());

  document.body.appendChild(formContainer);
};
