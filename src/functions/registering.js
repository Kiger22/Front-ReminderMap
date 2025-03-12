import { divApp } from "../../main";
import { api } from "../api/api";
import { AlertNotification } from "../components/AlertNotification/notification";
import { createLoader } from "../components/Loader/loader";
import { createLoginForm } from "../components/LoginForm/login";
import { closeRegistrationForm } from "../components/RegisterForm/register";
import { createUserHeader } from "../components/UserHeader/userHeader";
import { openProfileSettings } from "../components/SettingForm/settingsForm";
import { toggleAuthDisplay } from '../components/Header/header';

export const registering = async () => {

  // Creamos y mostramos un loader en la aplicación
  createLoader(divApp);

  try {
    const userData = {
      name: document.getElementById('name')?.value?.trim(),
      username: document.getElementById('nickname')?.value?.trim(),
      email: document.getElementById('email')?.value?.trim(),
      password: document.getElementById('password')?.value?.trim()
    };

    const avatarInput = document.getElementById('avatar');
    const formData = new FormData();

    // Añadimos los datos del usuario
    Object.keys(userData).forEach(key => {
      formData.append(key, userData[key]);
    });

    // Manejamos el avatar
    if (avatarInput && avatarInput.files && avatarInput.files[0]) {
      formData.append('avatar', avatarInput.files[0]);
    } else {
      try {
        const defaultAvatar = await fetch('/assets/aboutMe.jpeg')
          .then(res => res.blob());
        formData.append('avatar', defaultAvatar, 'default-avatar.jpg');
      } catch (error) {
        console.error('Error al cargar el avatar por defecto:', error);
      }
    }

    const response = await api({
      endpoint: 'users/register',
      method: 'POST',
      body: formData
    });

    if (response && response.éxito) {
      const loader = divApp.querySelector('.loader');
      if (loader) {
        divApp.removeChild(loader);
      }

      // Guardamos los datos del usuario incluyendo el avatar
      localStorage.setItem('avatar', response.user.avatar);
      localStorage.setItem('name', response.user.name);
      localStorage.setItem('username', response.user.username);
      localStorage.setItem('email', response.user.email);

      const welcomeMessage = `¡Bienvenido, ${userData.name}! Tu registro fue exitoso.`;
      await new Promise((resolve) => {
        AlertNotification("Registro Exitoso", welcomeMessage, () => {
          closeRegistrationForm();
          createLoginForm();
          resolve();
        });
      });

      // Actualizamos el header del usuario
      const userHeaderContainer = document.getElementById('user-header');
      if (userHeaderContainer) {
        userHeaderContainer.innerHTML = '';
        createUserHeader(
          userHeaderContainer,
          response.user.avatar,
          '../assets/setting-1-svgrepo-com.svg',
          openProfileSettings
        );
        toggleAuthDisplay(true); // Actualizamos la visualización del header
      }
    } else {
      throw new Error(response.mensaje || "Error en el registro");
    }
  } catch (error) {
    console.error('Error durante el registro:', error);
    AlertNotification("Error", "Error en el registro: " + error.message);
  }
}
