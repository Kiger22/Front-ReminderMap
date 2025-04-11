import { divApp } from "../../../main";
import { AlertNotification } from "../../components/AlertNotification/notification";
import { toggleAuthDisplay } from "../../components/Header/header";
import { createLoader } from "../../components/Loader/loader";
import { openProfileSettings } from "../../components/SettingForm/settingsForm";
import { createUserHeader } from "../../components/UserHeader/userHeader";
import { goToHomePage } from "../navigation/goHomePage";

export const logOut = async (isPageReload = false) => {
  try {
    // Creamos y mostramos un loader en la aplicación
    createLoader(divApp);

    // Eliminamos el token de autenticación de localStorage
    localStorage.removeItem('authToken');
    console.log('Token eliminado de localStorage');

    // Actualizamos el estado de autenticación
    toggleAuthDisplay(false);

    if (!isPageReload) {
      // Mostramos un mensaje de éxito
      AlertNotification('Cierre de sesión exitoso', '¡Hasta pronto!', () => {
        // Redireccionamos al usuario a la página de inicio
        window.location.reload();
      });
    } else {
      // Redireccionamos al usuario a la página de inicio sin mostrar la notificación
      window.location.reload();
      // Creamos el header del usuario
      const userHeaderContainer = document.getElementById('user-header');
      const avatar = localStorage.getItem('avatar');
      createUserHeader(userHeaderContainer, avatar, '../assets/setting-1-svgrepo-com.svg', openProfileSettings);
    }
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    AlertNotification('Error', 'No se pudo cerrar la sesión. Inténtalo de nuevo más tarde.');
  }
};