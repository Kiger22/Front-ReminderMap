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

    console.log('Datos del usuario antes de enviar:', userData);

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
      if (loader) {
        loader.remove();
      }

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
        if (registerButton) {
          registerButton.style.display = 'none';
        }
        if (loginButton) {
          loginButton.style.display = 'none';
        }

        // Mostramos botón de cerrar sesión
        const userHeader = document.getElementById('user-header');
        if (userHeader) {
          userHeader.style.display = 'flex';
        }

        // Mostramos imagen del avatar
        const avatarImage = document.querySelector('.user-header-avatar');
        if (avatarImage) {
          avatarImage.style.display = 'flex';
          avatarImage.src = response.user.avatar;
        };
      });

      // Guardamos el path del avatar en el localStorage
      localStorage.setItem('avatar', response.user.avatar);
      console.log('avatar en localStorage', response.user.avatar);

      // Guardamos el username en localStorage
      localStorage.setItem('username', response.user.username);
      console.log('username en localStorage', response.user.username);

      // Guardamos el email en localStorage
      localStorage.setItem('email', response.user.email);
      console.log('email en localStorage', response.user.email);

      // Guardamos el token en localStorage
      localStorage.setItem('authToken', response.token);
      console.log('Token en localStorage', response.token);

      // Guardamos el userId en localStorage
      localStorage.setItem('userId', response.user._id);
      console.log('userId en localStorage', response.user._id);

      // Actualizamos el estado de autenticación
      toggleAuthDisplay(true);

      // Creamos el header del usuario
      const userHeaderContainer = document.getElementById('user-header');
      userHeaderContainer.innerHTML = ''; // Limpiamos el contenedor
      createUserHeader(userHeaderContainer, response.user.avatar, '../assets/setting-1-svgrepo-com.svg', openProfileSettings);

    }
    else {
      console.log('Access Denied');
      // Cerramos el loader
      const loader = divApp.querySelector('.loader');
      if (loader) {
        loader.remove();
      }

      // Mostramos mensaje de error en un mensaje de alerta
      AlertNotification("Error de inicio de sesión", response.mensaje || "Ocurrió un error desconocido", () => {
        console.log('Mostrando alerta de error');
        // Cerramos el formulario de login
        closeLoginForm();
      });
      // Mostramos el mensaje de error en un mensaje de alerta
      console.error('Error en el proceso de login:', response.mensaje || "Ocurrió un error desconocido");
    }
  }
  // Manejo de errores
  catch (error) {
    console.error('Error en el proceso de login:', error);

    // Cerramos el loader
    const loader = divApp.querySelector('.loader');
    if (loader) {
      loader.remove();
    }

    // Mostramos mensaje de error en un mensaje de alerta
    AlertNotification("Error de inicio de sesión", error.message || "Ocurrió un error desconocido", () => {
      console.log('Mostrando alerta de error');
      // Cerramos el formulario de login
      closeLoginForm();
    });
  }
  // Limpiar el timeout del loader si aún está activo
  finally {
    clearTimeout(loaderTimeout);
  }
};