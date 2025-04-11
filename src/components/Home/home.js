import("./home.css");
export const Home = () => {
  const heroContainer = document.querySelector('.hero-container');
  heroContainer.innerHTML = '';

  // Creamos la primera pagina de nuestra APP
  const homeContainer = document.createElement("div");
  homeContainer.classList.add("home-container");

  // Creamos el título y contenido del HERO
  const h3Hero = document.createElement("h3");
  h3Hero.textContent = "Gestiona tus recordatorios, según tu geolocalización";
  homeContainer.appendChild(h3Hero);

  const pHeroII = document.createElement("p");
  pHeroII.textContent = "Inicia Seccion y luego añade un recordatorio pulsando el botón +";
  homeContainer.appendChild(pHeroII);

  const pHero = document.createElement("p");
  pHero.textContent = "No te olvides de nada, KRG Reminder te lo recordara siempre que estés en el sitio que debe notificarte de la tarea";
  homeContainer.appendChild(pHero);

  heroContainer.appendChild(homeContainer);
};