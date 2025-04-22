import { AlertNotification } from '../AlertNotification/notification';
import('./welcomeModal.css');

export const showWelcomeModal = (delay = 500, force = false) => {
  // Verificamos si ya se ha mostrado el modal en esta sesión
  const hasShownWelcomeModal = sessionStorage.getItem('hasShownWelcomeModal');

  // Si ya se ha mostrado en esta sesión y no se fuerza su visualización, no hacemos nada
  if (hasShownWelcomeModal && !force) {
    return;
  }

  // Creamos el contenido para el modal
  const modalContent = document.createElement('div');
  modalContent.classList.add('welcome-modal-content');

  // Añadimos el título y contenido al modal
  const h3Hero = document.createElement("h3");
  h3Hero.textContent = "Gestiona tus recordatorios, según tu geolocalización";
  modalContent.appendChild(h3Hero);

  const pHeroII = document.createElement("p");
  pHeroII.textContent = "Inicia Seccion y luego añade un recordatorio pulsando el botón +";
  modalContent.appendChild(pHeroII);

  const pHero = document.createElement("p");
  pHero.textContent = "No te olvides de nada, KRG Reminder te lo recordara siempre que estés en el sitio que debe notificarte de la tarea";
  modalContent.appendChild(pHero);

  // Mostramos el modal con la información
  setTimeout(() => {
    AlertNotification(
      "Bienvenido a KRG Reminder",
      modalContent,
      () => {
        // Guardamos en sessionStorage que ya se ha mostrado el modal en esta sesión
        sessionStorage.setItem('hasShownWelcomeModal', 'true');
      },
      {
        showCancelButton: false,
        confirmButtonText: 'Aceptar'
      }
    );
  }, delay);
};

