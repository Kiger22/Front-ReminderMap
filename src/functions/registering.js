import { divApp } from "../../main";
import { api } from "../api/api";
import { AlertNotification } from "../components/AlertNotification/notification";
import { createLoader } from "../components/Loader/loader";
import { createLoginForm } from "../components/LoginForm/login";
import { closeRegistrationForm } from "../components/RegisterForm/register";

export const registering = async () => {

  // Creamos y mostramos un loader en la aplicación
  createLoader(divApp);

  // Tiempo mínimo que el loader debe estar visible
  const minLoaderTime = 1000;
  let loaderTimeout;

  try {
    // Obtenemos los datos del usuario desde el formulario  
    const userData = {
      name: document.getElementById('name')?.value?.trim(),
      username: document.getElementById('nickname')?.value?.trim(),
      email: document.getElementById('email')?.value?.trim(),
      password: document.getElementById('password')?.value?.trim()
    };

    // Mostramos los datos del usuario en la consola
    console.log('Enviando datos:', userData);

    // Establecemos un timeout para asegurar que el loader esté visible al menos 1 segundos
    loaderTimeout = setTimeout(() => {
      console.log("El loader ha estado visible durante al menos 1 segundos.");
    }, minLoaderTime);

    // Obtenemos el input de avatar
    const avatarInput = document.getElementById('avatar');
    const formData = new FormData();

    // Añadimos los datos del usuario al objeto FormData
    formData.append('name', userData.name);
    formData.append('username', userData.username);
    formData.append('email', userData.email);
    formData.append('password', userData.password);

    // Verificamos si avatarInput no es null antes de acceder a sus propiedades
    if (avatarInput && avatarInput.files && avatarInput.files[0]) {
      formData.append('avatar', avatarInput.files[0]);
    }
    else {
      console.log("No se seleccionó ninguna imagen de avatar.");
    };

    // Mostramos los datos del formulario para depurar
    console.log("Form Data:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    // Enviamos los datos del usuario al endpoint de registro
    const response = await api({
      endpoint: 'users/register',
      method: 'POST',
      body: formData
    });

    // Verificamos la respuesta del servidor
    if (response && response.message === "Usuario registrado con éxito") {
      const loader = divApp.querySelector('.loader');
      if (loader) {
        divApp.removeChild(loader);
      }

      // Mostramos un mensaje de bienvenida al usuario y redireccionamos a la página de login
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
  // Capturamos y mostramos los errores en caso de que ocurra alguna excepción
  catch (error) {
    console.error('Error durante el registro:', error);
    AlertNotification("Error en el registro: " + error.message, "error");
  }
  // Limpiamos el timeout del loader si aún está activo
  finally {
    clearTimeout(loaderTimeout);
  }
}