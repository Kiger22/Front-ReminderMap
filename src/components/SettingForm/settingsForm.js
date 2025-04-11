import { AlertNotification } from '../AlertNotification/notification';
import { createLoader } from '../Loader/loader';
import { createButton } from '../Button/button';
import { updateUserProfile } from '../../functions/users/updateUserProfile';
import('./settingsForm.css');

const DEFAULT_AVATAR_PATH = './assets/user-circle-svgrepo-com.svg';

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
  currentAvatar.src = userData.avatar || DEFAULT_AVATAR_PATH;
  currentAvatar.classList.add('current-avatar');
  avatarSection.appendChild(currentAvatar);

  const avatarInput = document.createElement('input');
  avatarInput.type = 'file';
  avatarInput.id = 'avatar-update';
  avatarInput.accept = 'image/*';
  avatarInput.style.display = 'none';

  // Botón personalizado para seleccionar imagen
  const selectImageBtn = document.createElement('button');
  selectImageBtn.type = 'button';
  selectImageBtn.textContent = 'Cambiar Avatar';
  selectImageBtn.classList.add('change-avatar-btn');
  selectImageBtn.onclick = () => avatarInput.click();

  // Evento para mostrar vista previa
  avatarInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        currentAvatar.src = e.target.result;

        // También actualizamos el avatar en el header para vista previa
        const headerAvatar = document.querySelector('.avatar-img-header');
        if (headerAvatar) {
          headerAvatar.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    } else {
      // Si no se selecciona archivo, volvemos a la imagen por defecto
      currentAvatar.src = DEFAULT_AVATAR_PATH;
      const headerAvatar = document.querySelector('.avatar-img-header');
      if (headerAvatar) {
        headerAvatar.src = DEFAULT_AVATAR_PATH;
      }
    }
  });

  avatarSection.appendChild(avatarInput);
  avatarSection.appendChild(selectImageBtn);
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

  // Creamos botones usando el componente button
  createButton(buttonContainer, 'Guardar', 'save-button', async (e) => {
    e.preventDefault();

    // Deshabilitamos el botón mientras se procesa
    const saveButton = document.querySelector('#save-button');
    if (saveButton) saveButton.disabled = true;

    // Creamos y mostramos el loader
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

    try {
      const success = await updateUserProfile(formData, openProfileSettings);

      if (!success && !localStorage.getItem('authToken')) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
    } finally {
      // Removemos el loader
      const loader = document.querySelector('.loader');
      if (loader) loader.remove();

      // Rehabilitamos el botón
      if (saveButton) saveButton.disabled = false;
    }
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
