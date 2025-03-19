import { reminderPageForm } from "../../pages/AddReminder/reminder";
import { AlertNotification } from "../AlertNotification/notification";
import { ButtonPlus } from "../ButtonPlus/buttonPlus";
import { Home } from "../Home/home";
import { createLoginForm } from "../LoginForm/login";
import { insertMap } from "../Map/insertMap";

import("./hero.css");

export const heroPage = (node) => {
  node.innerHTML = '';

  // Creamos la primera pagina de nuestra APP
  const hero = document.createElement("div");
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

  // Creamos la pantalla de inicio
  Home();

  // Creamos la sección de sugerencias
  const suggestionsDivs = document.createElement("div");
  suggestionsDivs.classList.add("suggestions-divs");
  hero.appendChild(suggestionsDivs);

  const h3 = document.createElement("h3");
  h3.className = 'suggestions-title'
  h3.textContent = "Sugerencias...";
  suggestionsDivs.appendChild(h3);

  const p = document.createElement('p');
  p.textContent = "Encuentra tus próximos recordatorios en este mapa";
  suggestionsDivs.appendChild(p);

  const arrow = document.createElement("div");
  arrow.classList.add("toggle-arrow");
  arrow.textContent = " >";
  suggestionsDivs.appendChild(arrow);
  arrow.addEventListener("click", () => {
    suggestionsDivs.classList.toggle("hide");
    //arrow.textContent = suggestionsDivs.classList.contains("hide") ? '<' : '>';
  });
  suggestionsDivs.classList.add("hide");

  // Creamos el mapa
  const Src_Map = "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d12079.93823943867!2d0.6929329576949611!3d40.80633308204328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2ses!4v1730927072599!5m2!1ses!2ses";
  insertMap(hero, Src_Map);
};



