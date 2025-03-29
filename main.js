import { createFooter } from './src/components/Footer/footer';
import { createHeader, toggleAuthDisplay } from './src/components/Header/header';
import { createAsideMenu } from './src/components/MenuAsside/menuAside';
import { SwitchButton } from './src/components/SwitchButton/switchButton';
import { menuAsideI, menuAsideII } from './src/data/aside';
import { footerLogo, menuFooter, socialLinks } from './src/data/footer';
import { heaterLogo, menuItemsHeaderI, menuItemsHeaderII } from './src/data/header';
import { toggletheme } from './src/functions/toggleTheme';
import { heroPage } from './src/components/Hero/hero';
import { insertMap } from './src/components/Map/insertMap';
import './style.css'

// Crear el mapa de fondo
const createBackgroundMap = () => {
  const mapSrc = `https://www.google.com/maps/embed/v1/view?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&center=40.416775,-3.703790&zoom=12`;
  insertMap(document.body, mapSrc, {
    isBackground: true,
    controls: false
  });
};

// Objeto que contiene el elemento donde se insertará la app (App)
export const divApp = document.querySelector("#app");

// Inicializar el mapa de fondo
createBackgroundMap();

// Evento para verificar si el documento está cargado completamente (DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
  // Verificamos si localStorage está disponible y si hay un token de autenticación
  if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Si hay un token, actualizamos el estado de autenticación
      console.log('Token encontrado en localStorage');
      toggleAuthDisplay(true);
      // Actualizamos el título del header
      const titleHeader = document.getElementById('title-header');
      const name = localStorage.getItem('name');
      if (titleHeader) {
        titleHeader.innerText = `¡Bienvenido, ${name}!`;
      }
    } else {
      toggleAuthDisplay(false);
    }
  }
});

// Creamos y añadimos los componentes al divApp
createHeader(divApp, heaterLogo, menuItemsHeaderI, menuItemsHeaderII);
heroPage(divApp);
createAsideMenu(divApp, menuAsideI, menuAsideII);
createFooter(footerLogo, menuFooter, socialLinks);
SwitchButton();

// Evento para el botón de cambio de tema
const switchButton = document.querySelector("#switch");
const fullpage = document.querySelector("body");
switchButton.addEventListener("click", () => {
  toggletheme(fullpage);
});
