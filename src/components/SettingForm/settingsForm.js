import { AlertNotification } from '../AlertNotification/notification';
import { createLoader } from '../Loader/loader';
import { createButton } from '../Button/button';
import { updateUserProfile } from '../../functions/updateUserProfile';
import('./settingsForm.css');

export const createSettingsForm = (userData) => {
  const modal = document.createElement('div');
  modal.classList.add('settings-modal');

  const form = document.createElement('form');
  form.classList.add('settings-form');

  const title = document.createElement('h2');
  title.textContent = 'Configuración de Usuario';
  form.appendChild(title);

  // Sección de Avatar
  const avatarSection = document.createElement('div');
  avatarSection.classList.add('avatar-section');

  const currentAvatar = document.createElement('img');
  currentAvatar.src = userData.avatar || '../assets/default-avatar.png';
  currentAvatar.classList.add('current-avatar');
  avatarSection.appendChild(currentAvatar);

  const avatarInput = document.createElement('input');
  avatarInput.type = 'file';
  avatarInput.id = 'avatar-update';
  avatarInput.accept = 'image/*';
  avatarSection.appendChild(avatarInput);

  form.appendChild(avatarSection);

  // Campos de entrada
  const fields = [
    { label: 'Nombre', id: 'name', type: 'text', value: userData.name },
    { label: 'Email', id: 'email', type: 'email', value: userData.email },
    { label: 'Ubicación de Casa', id: 'myHouseLocation', type: 'text', value: userData.myHouseLocation },
    { label: 'Ubicación de Trabajo', id: 'myWorkLocation', type: 'text', value: userData.myWorkLocation }
  ];

  fields.forEach(field => {
    const fieldContainer = document.createElement('div');
    fieldContainer.classList.add('field-container');

    const label = document.createElement('label');
    label.setAttribute('for', field.id);
    label.textContent = field.label;

    const input = document.createElement('input');
    input.type = field.type;
    input.id = field.id;
    input.value = field.value || '';

    fieldContainer.appendChild(label);
    fieldContainer.appendChild(input);
    form.appendChild(fieldContainer);
  });

  // Contenedor de botones
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button-container');

  // Crear botones usando el componente button
  createButton(buttonContainer, 'Guardar', 'save-button', async (e) => {
    e.preventDefault();
    createLoader(document.body);

    const formData = new FormData();
    const avatarFile = avatarInput.files[0];

    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    fields.forEach(field => {
      const value = document.getElementById(field.id).value;
      if (value) formData.append(field.id, value);
    });

    await updateUserProfile(formData);

    const loader = document.querySelector('.loader');
    if (loader) loader.remove();
  });

  createButton(buttonContainer, 'Cancelar', 'cancel-button', () => {
    closeSettingsForm();
  });

  form.appendChild(buttonContainer);
  modal.appendChild(form);
  document.body.appendChild(modal);
};

export const closeSettingsForm = () => {
  const modal = document.querySelector('.settings-modal');
  if (modal) {
    modal.remove();
  }
};

export const openProfileSettings = () => {
  const userData = {
    name: localStorage.getItem('name'),
    email: localStorage.getItem('email'),
    avatar: localStorage.getItem('avatar'),
    myHouseLocation: localStorage.getItem('myHouseLocation'),
    myWorkLocation: localStorage.getItem('myWorkLocation')
  };

  createSettingsForm(userData);
};
