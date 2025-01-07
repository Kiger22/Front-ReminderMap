import { divApp } from "../../main";
import { api } from "../api/api";
import { AlertNotification } from "../components/AlertNotification/notification";
import { createLoader } from "../components/Loader/loader";
import { closeLoginForm } from "../components/LoginForm/login";
import { toggleAuthDisplay } from '../components/Header/header';

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

    // Mostramos datos del usuario en la consola 
    console.log('Enviando datos:', userData);

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
    if (response && response.message === "Acceso permitido") {
      const loader = divApp.querySelector('.loader');
      if (loader) {
        divApp.removeChild(loader);
      }

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
        };

        // Ocultamos botones de registro e inicio de sesión
        const registerButton = document.getElementById('register-button');
        const loginButton = document.getElementById('login-button');
        if (registerButton) {
          registerButton.style.display = 'none';
        }
        if (loginButton) {
          loginButton.style.display = 'none';
        }

        // Mostrar imagen del avatar
        const avatarImage = document.querySelector('.user-header');
        if (avatarImage) {
          avatarImage.style.display = 'flex';
          avatarImage.addEventListener('click', async () => {
            await logout();
          });
        }

      });
      // Guardamos el token en localStorage
      localStorage.setItem('authToken', response.token);
      console.log('Token en localStorage', response.token);

      // Actualizamos el estado de autenticación
      toggleAuthDisplay(true);
    }
    else {
      throw new Error(response.message || "Respuesta no válida del servidor");
    }
  }
  // Manejo de errores
  catch (error) {
    console.error('Error en el proceso de login:', error);
  }
  // Limpiar el timeout del loader si aún está activo
  finally {
    clearTimeout(loaderTimeout);
  }
};