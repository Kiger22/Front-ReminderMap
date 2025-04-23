import { divApp } from "../../../main";
import { api } from "../../api/api";
import { AlertNotification } from "../../components/AlertNotification/notification";
import { createLoader } from "../../components/Loader/loader";
import { createLoginForm } from "../../components/LoginForm/login";
import { closeRegistrationForm } from "../../components/RegisterForm/register";
import { createUserHeader } from "../../components/UserHeader/userHeader";
import { openProfileSettings } from "../../components/SettingForm/settingsForm";
import { toggleAuthDisplay } from '../../components/Header/header';

const DEFAULT_AVATAR_PATH = '../assets/user-circle-svgrepo-com.svg';

export const registering = async () => {
  createLoader(divApp);

  try {
    const nameInput = document.getElementById('name');
    const nicknameInput = document.getElementById('username'); // Cambiado de 'nickname' a 'username'
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const avatarInput = document.getElementById('avatar');

    // Validación de campos requeridos
    if (!nameInput?.value || !nicknameInput?.value || !emailInput?.value || !passwordInput?.value) {
      throw new Error('Todos los campos son requeridos');
    }

    const formData = new FormData();

    // Añadimos datos básicos del usuario
    formData.append('name', nameInput.value.trim());
    formData.append('username', nicknameInput.value.trim());
    formData.append('email', emailInput.value.trim());
    formData.append('password', passwordInput.value.trim());

    // Manejamos el avatar
    if (avatarInput?.files?.length > 0) {
      // Si el usuario seleccionó una imagen, usarla
      formData.append('avatar', avatarInput.files[0]);
    }
    // Si no hay imagen seleccionada, no enviamos el campo avatar
    // y dejamos que el backend use su imagen por defecto

    console.log('Enviando datos de registro:', {
      name: nameInput.value,
      username: nicknameInput.value,
      email: emailInput.value,
      hasCustomAvatar: avatarInput?.files?.length > 0
    });

    const response = await api({
      endpoint: 'users/register',
      method: 'POST',
      body: formData,
      isFormData: true
    });

    if (response && response.success) {
      // Limpiamos el loader
      const loader = divApp.querySelector('.loader');
      if (loader) loader.remove();

      // Guardamos datos en localStorage
      localStorage.setItem('avatar', response.user.avatar || DEFAULT_AVATAR_PATH);
      localStorage.setItem('name', response.user.name);
      localStorage.setItem('username', response.user.username);
      localStorage.setItem('email', response.user.email);
      localStorage.setItem('userId', response.user._id);

      // Mostramos mensaje de éxito
      const welcomeMessage = `¡Bienvenido, ${response.user.name}! Tu registro fue exitoso.`;
      await new Promise((resolve) => {
        AlertNotification("Registro Exitoso", welcomeMessage, () => {
          closeRegistrationForm();
          createLoginForm();
          resolve();
        });
      });

      // Actualizamos el header
      const userHeaderContainer = document.getElementById('user-header');
      if (userHeaderContainer) {
        userHeaderContainer.innerHTML = '';
        createUserHeader(
          userHeaderContainer,
          response.user.avatar || DEFAULT_AVATAR_PATH,
          '../assets/setting-1-svgrepo-com.svg',
          openProfileSettings
        );
        toggleAuthDisplay(true);
      }
    } else {
      throw new Error(response.message || "Error en el registro");
    }
  } catch (error) {
    console.error('Error durante el registro:', error);
    const loader = divApp.querySelector('.loader');
    if (loader) loader.remove();

    AlertNotification(
      "Error en el registro",
      error.message || "No se pudo completar el registro. Por favor, intenta nuevamente."
    );
  }
}
