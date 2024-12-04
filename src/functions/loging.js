import { divApp } from "../../main";
import { api } from "../api/api";
import { AlertNotification } from "../components/AlertNotification/notification";
import { createLoader } from "../components/Loader/loader";
import { closeLoginForm } from "../components/LoginForm/login";
import { toggleAuthDisplay } from '../components/Header/header';

export const loging = async () => {
  createLoader(divApp);

  const minLoaderTime = 1000;
  let loaderTimeout;

  try {
    const userData = {
      username: document.getElementById('user')?.value?.trim(),
      password: document.getElementById('password')?.value?.trim()
    };

    console.log('Enviando datos:', userData);

    loaderTimeout = setTimeout(() => {
      console.log("El loader ha estado visible durante al menos 1 segundo.");
    }, minLoaderTime);

    const response = await api({
      endpoint: 'users/login',
      method: 'POST',
      body: userData
    });

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

        // Cambia el texto del h1 del header
        const titleHeader = document.getElementById('title-header');
        if (titleHeader) {
          titleHeader.innerText = `Hola ${response.user.name}`;
        };

        // Ocultar botones de registro e inicio de sesión
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

      // Guardar el token en localStorage
      localStorage.setItem('authToken', response.token);
      console.log('Token en localStorage', response.token);

      // Actualizar el estado de autenticación
      toggleAuthDisplay(true);

    } else {
      throw new Error(response.message || "Respuesta no válida del servidor");
    }
  } catch (error) {
    console.error('Error durante el inicio de sesión:', error);
    AlertNotification("Error en el inicio de sesión: " + error.message, "error");
  } finally {
    clearTimeout(loaderTimeout);
  }
};

const logout = async () => {
  try {

    localStorage.removeItem('authToken');

    // Mostrar una notificación de cierre de sesión exitoso
    const byeMessage = "Has cerrado sesión exitosamente";
    await new Promise((resolve) => {
      AlertNotification("LogOut", byeMessage, () => {
        resolve();
        // Redirigir al usuario a la página de inicio o de inicio de sesión
        window.location.href = '/login';
      });
    });
  } catch (error) {
    console.error('Error durante el cierre de sesión:', error);
    AlertNotification("Error al cerrar sesión: " + error.message, "error");
  }
};