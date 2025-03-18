import { divApp } from "../../main";
import { api } from "../api/api";
import { AlertNotification } from "../components/AlertNotification/notification";
import { createLoader } from "../components/Loader/loader";
import { closeLoginForm } from "../components/LoginForm/login";
import { toggleAuthDisplay } from '../components/Header/header';
import { createUserHeader } from "../components/UserHeader/userHeader";
import { openProfileSettings } from "../components/SettingForm/settingsForm";

// Función principal de login
export const loging = async () => {

  // Crear y mostrar el loader
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

    console.log('Enviando datos:', {
      username: userData.username,
      passwordLength: userData.password?.length,
      passwordTrimmed: userData.password?.trim()?.length
    });

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

    // Mostramos la respuesta del servidor
    console.log('Respuesta del servidor:', response);

    // Verificamos la respuesta del servidor
    if (response && response.éxito) {
      // Cerramos el loader
      const loader = divApp.querySelector('.loader');
      if (loader) loader.remove();

      // Mostramos mensaje de bienvenida, cerramos el formulario de login y actualizamos el estado de autenticación
      const welcomeMessage = `¡Bienvenido, ${response.user.username}!`;
      await new Promise((resolve) => {
        AlertNotification("Inicio de sesión exitoso", welcomeMessage, () => {
          closeLoginForm();
          resolve();
        });

        // Cambiamos el texto del h1 del header
        const titleHeader = document.getElementById('title-header');
        if (titleHeader) {
          titleHeader.innerText = `Hola ${response.user.name}`;
        }

        // Guardamos el username en localStorage
        localStorage.setItem('name', response.user.name);
        console.log('name en localStorage', response.user.name);

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
  }
  // Manejo de errores
  catch (error) {
    console.error('Error en el proceso de login:', error);

    // Cerramos el loader
    const loader = divApp.querySelector('.loader');
    if (loader) loader.remove();

    AlertNotification(
      "Error de inicio de sesión",
      error.message || "Credenciales incorrectas. Por favor, verifica tu usuario y contraseña.",
      () => {
        console.log('Mostrando alerta de error');
      }
    );
  } finally {
    clearTimeout(loaderTimeout);
  }
};