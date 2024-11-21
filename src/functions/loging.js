import { divApp } from "../../main";
import { api } from "../api/api";
import { AlertNotification } from "../components/AlertNotification/notification";
import { createLoader } from "../components/Loader/loader";
import { closeLoginForm } from "../components/LoginForm/login";

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
        }
      });

    } else {
      throw new Error(response.message || "Respuesta no válida del servidor");
    }
  } catch (error) {
    console.error('Error durante el inicio de sesión:', error);
    AlertNotification("Error en el inicio de sesión: " + error.message, "error");
  } finally {
    clearTimeout(loaderTimeout);
  }
}