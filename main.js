import './style.css'
import { createFooter } from './src/components/Footer/footer';
import { createHeader, toggleAuthDisplay } from './src/components/Header/header';
import { createAsideMenu } from './src/components/MenuAsside/menuAside';
import { SwitchButton } from './src/components/SwitchButton/switchButton';
import { menuAsideI, menuAsideII } from './src/data/aside';
import { footerLogo, menuFooter, socialLinks } from './src/data/footer';
import { heaterLogo, menuItemsHeaderI, menuItemsHeaderII } from './src/data/header';
import { toggletheme, loadSavedTheme } from './src/functions/navigation/toggleTheme';
import { heroPage } from './src/components/Hero/hero';
import { insertMap } from './src/components/Map/insertMap';
import { showWelcomeModal } from './src/components/WelcomeModal/welcomeModal';

// Objeto que contiene el elemento donde se insertará la app (App)
export const divApp = document.querySelector("#app");

// Crear el mapa de fondo
const createBackgroundMap = () => {
  const mapSrc = `https://www.google.com/maps/embed/v1/view?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&center=40.416775,-3.703790&zoom=12`;
  insertMap(document.body, mapSrc, {
    isBackground: true,
    controls: false
  });
};

// Función para añadir la clase app-element a todos los elementos dentro del div app
const addAppElementClass = () => {
  const appDiv = document.querySelector("#app");
  if (appDiv) {
    // Añadir la clase app-element a todos los elementos de texto dentro del div app
    const textElements = appDiv.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a');
    textElements.forEach(el => {
      el.classList.add('app-element');
    });
  }
};

// Inicializar la aplicación
const initializeApp = () => {
  // Inicializar el mapa de fondo
  createBackgroundMap();

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

    // Forzar actualización de estilos en el div app
    const appDiv = document.querySelector("#app");
    if (appDiv) {
      if (fullpage.classList.contains("dark")) {
        appDiv.style.color = 'var(--kg-text-light-mode)';
      } else {
        appDiv.style.color = 'var(--kg-text-dark-mode)';
      }
    }
  });

  // Cargamos el tema guardado
  loadSavedTheme();

  // Asegurarse de que el div app tenga el tema correcto al cargar
  const body = document.querySelector("body");
  const appDiv = document.querySelector("#app");
  if (appDiv) {
    if (body.classList.contains("dark")) {
      appDiv.style.color = 'var(--kg-text-light-mode)';
    } else {
      appDiv.style.color = 'var(--kg-text-dark-mode)';
    }
  }

  // Mostramos el modal de bienvenida solo una vez por sesión
  showWelcomeModal();
};

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

  // Añadimos la clase app-element a todos los elementos dentro del div app
  addAppElementClass();

  // Observamos cambios en el DOM para añadir la clase a nuevos elementos
  const observer = new MutationObserver(() => {
    addAppElementClass();
  });

  const appDiv = document.querySelector("#app");
  if (appDiv) {
    observer.observe(appDiv, { childList: true, subtree: true });
  }
});

// Inicializamos la aplicación después de que se hayan cargado todos los módulos
initializeApp();
