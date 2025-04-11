
import { api } from "../../api/api";
import { AlertNotification } from "../../components/AlertNotification/notification";
import { createLoader } from "../../components/Loader/loader";
import { closeLoginForm } from "../../components/LoginForm/login";
import { toggleAuthDisplay } from '../../components/Header/header';
import { createUserHeader } from "../../components/UserHeader/userHeader";
import { openProfileSettings } from "../../components/SettingForm/settingsForm";
import { divApp } from "../../../main";

// Función principal de login
export const loging = async () => {

  // Creamos y mostramos el loader
  createLoader(divApp);

  // Tiempo mínimo que el loader debe estar visible 
  const minLoaderTime = 1000;
  let loaderTimeout;

  try {
    // Obtenemos datos del usuario desde el formulario
    const userData = {
      username: document.getElementById('user')?.value?.trim(),
      password: document.getElementById('password')?.value?.trim()
    };

    if (!userData.username || !userData.password) {
      throw new Error('Usuario y contraseña son requeridos');
    }

    // Establecemos timeout para asegurar que el loader esté visible al menos 1 segundo
    loaderTimeout = setTimeout(() => {
      console.log("El loader ha estado visible durante al menos 1 segundo.");
    }, minLoaderTime);

    // Enviamos los datos del usuario al endpoint de login
    const response = await api({
      endpoint: 'users/login',
      method: 'POST',
      body: userData
    });

    // Verificamos la respuesta del servidor
    if (response && response.éxito) {
      // Guardamos el token en localStorage
      localStorage.setItem('authToken', response.token);

      // Cerramos el loader
      const loader = divApp.querySelector('.loader');
      if (loader) loader.remove();

      // Mostramos mensaje de bienvenida
      const welcomeMessage = `¡Bienvenido, ${response.user.username}!`;
      await new Promise((resolve) => {
        AlertNotification("Inicio de sesión exitoso", welcomeMessage, () => {
          closeLoginForm();
          resolve();
        });

        // Guardamos los datos del usuario en localStorage
        localStorage.setItem('name', response.user.name);
        localStorage.setItem('email', response.user.email);
        localStorage.setItem('avatar', response.user.avatar);
        localStorage.setItem('userId', response.user._id);
        localStorage.setItem('username', response.user.username);
        localStorage.setItem('myHouseLocation', response.user.myHouseLocation || '');
        localStorage.setItem('myWorkLocation', response.user.myWorkLocation || '');

        // Actualizamos la UI
        const titleHeader = document.getElementById('title-header');
        if (titleHeader) {
          titleHeader.innerText = `Hola ${response.user.name}`;
        }

        // Ocultamos botones de registro e inicio de sesión
        const registerButton = document.getElementById('register-button');
        const loginButton = document.getElementById('login-button');
        if (registerButton) registerButton.style.display = 'none';
        if (loginButton) loginButton.style.display = 'none';

        const userHeader = document.getElementById('user-header');
        if (userHeader) {
          userHeader.style.display = 'flex';
          userHeader.innerHTML = '';
          createUserHeader(userHeader, response.user.avatar, '../assets/setting-1-svgrepo-com.svg', openProfileSettings);
        }
      });

      toggleAuthDisplay(true);
    } else {
      throw new Error(response.mensaje || 'Error de autenticación');
    }
  } catch (error) {
    console.error('Error en el proceso de login:', error);
    const loader = divApp.querySelector('.loader');
    if (loader) loader.remove();

    AlertNotification(
      "Error de inicio de sesión",
      error.message || "Credenciales incorrectas. Por favor, verifica tu usuario y contraseña.",
      () => console.log('Mostrando alerta de error')
    );
  } finally {
    clearTimeout(loaderTimeout);
  }
};
