import { reminderPageForm } from "../../pages/AddReminder/reminder";
import { AlertNotification } from "../AlertNotification/notification";
import { ButtonPlus } from "../ButtonPlus/buttonPlus";
import { createLoginForm } from "../LoginForm/login";
import { insertMap } from "../../components/Map/insertMap";
import { homePage } from "../../pages/HomePage/homePage";
import { loadFavorites } from "../../functions/favorites/loadFavorites";

import("./hero.css");

export const heroPage = (node) => {
  node.innerHTML = '';

  // Creamos la primera pagina de nuestra APP
  const hero = document.createElement("section");
  hero.classList.add("hero");
  node.appendChild(hero);

  // Creamos el contenedor principal
  const heroContainer = document.createElement("div");
  heroContainer.classList.add("hero-container");

  // Botón para añadir recordatorio
  ButtonPlus(hero, "AÑADIR RECORDATORIO");
  const button = document.querySelector('.button_plus');
  button.addEventListener("click", () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      AlertNotification('Debes ser usuario', 'Inicia Seccion', () => {
        createLoginForm();
      });
      return;
    } else {
      // Pasamos false como tercer parámetro para indicar que venimos del home
      reminderPageForm(heroContainer, null, false);
    }
  });

  // Insertamos el contenedor principal en el hero
  hero.appendChild(heroContainer);

  // Creamos la pantalla de inicio usando la nueva página
  homePage(heroContainer);

  // Creamos la sección de favoritos
  const favoritesDivs = document.createElement("div");
  favoritesDivs.classList.add("favorites-divs", "hide"); // Añadimos 'hide' para que esté cerrada por defecto
  hero.appendChild(favoritesDivs);

  const h3 = document.createElement("h3");
  h3.textContent = "Mis Lugares Favoritos";
  h3.classList.add("favorites-title");
  favoritesDivs.appendChild(h3);

  // Contenedor para la lista de favoritos
  const favoritesList = document.createElement('div');
  favoritesList.classList.add('favorites-list');
  favoritesDivs.appendChild(favoritesList);

  // Creamos el botón de toggle con texto que cambia
  const arrow = document.createElement("div");
  arrow.classList.add("toggle-arrow");
  arrow.innerHTML = "<span class='arrow-icon'>&gt;</span><span class='collapsed-title'>Lugares <br> Favoritos</span>";
  favoritesDivs.appendChild(arrow);

  // Variable para controlar si ya se han cargado los favoritos
  let favoritesLoaded = false;

  arrow.addEventListener("click", () => {
    favoritesDivs.classList.toggle("hide");

    // Si se está abriendo la solapa y no se han cargado los favoritos o se abre después de estar cerrada
    if (!favoritesDivs.classList.contains("hide")) {
      // Cargar favoritos del usuario
      loadFavorites(favoritesList);
      favoritesLoaded = true;
    }
  });

  // Función para cerrar la solapa cuando se hace clic fuera de ella
  const handleClickOutside = (event) => {
    // Verificamos si la solapa está abierta y si el clic fue fuera de la solapa y del botón de toggle
    if (
      !favoritesDivs.classList.contains("hide") &&
      !favoritesDivs.contains(event.target) &&
      !arrow.contains(event.target)
    ) {
      favoritesDivs.classList.add("hide");
    }
  };

  // Agregamos el event listener al documento
  document.addEventListener("click", handleClickOutside);

  // No cargamos los favoritos inicialmente, ya que la solapa está cerrada
};
