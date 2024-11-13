import { reminderPage } from "../../pages/AddReminder/reminder";
import { todayPage } from "../../pages/TodayList/today";
import { buttonPlus } from "../buttonPlus/buttonPlus";
import { insertMap } from "../Map/insertMap";

import("./hero.css");

export const heroPage = (node) => {
  const hero = document.createElement("div");
  hero.classList.add("hero");
  node.appendChild(hero);

  buttonPlus(hero, "AÑADIR RECORDATORIO");

  const heroContainer = document.createElement("div");
  heroContainer.classList.add("hero-container");
  hero.appendChild(heroContainer);

  todayPage(heroContainer);

  const button = document.querySelector('.button_plus');
  button.addEventListener("click", () => {
    reminderPage(heroContainer);
  });

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

  const Src_Map = "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d12079.93823943867!2d0.6929329576949611!3d40.80633308204328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2ses!4v1730927072599!5m2!1ses!2ses";
  insertMap(hero, Src_Map);


}