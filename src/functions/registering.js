import { divApp } from "../../main";
import { api } from "../api/api";
import { AlertNotification } from "../components/AlertNotification/notification";
import { createLoader } from "../components/Loader/loader";
import { createLoginForm } from "../components/LoginForm/login";
import { closeRegistrationForm } from "../components/RegisterForm/register";

export const registering = async () => {
  createLoader(divApp);

  const minLoaderTime = 1000;
  let loaderTimeout;

  try {
    const userData = {
      name: document.getElementById('name')?.value?.trim(),
      username: document.getElementById('nickname')?.value?.trim(),
      email: document.getElementById('email')?.value?.trim(),
      password: document.getElementById('password')?.value?.trim()
    };

    console.log('Enviando datos:', userData);

    loaderTimeout = setTimeout(() => {
      console.log("El loader ha estado visible durante al menos 2 segundos.");
    }, minLoaderTime);

    const response = await api({
      endpoint: 'users/register',
      method: 'POST',
      body: userData
    });

    if (response && response.message === "Usuario registrado con éxito") {
      const loader = divApp.querySelector('.loader');
      if (loader) {
        divApp.removeChild(loader);
      }

      const welcomeMessage = `¡Bienvenido, ${userData.name}! Tu registro fue exitoso.`;
      await new Promise((resolve) => {
        AlertNotification("Registro Exitoso", welcomeMessage, () => {
          closeRegistrationForm();
          createLoginForm();
          resolve();
        });
      });
    } else {
      throw new Error(response.message || "Respuesta no válida del servidor");
    }
  }
  catch (error) {
    console.error('Error durante el registro:', error);
    AlertNotification("Error en el registro: " + error.message, "error");
  }
  finally {
    clearTimeout(loaderTimeout);
  }
}