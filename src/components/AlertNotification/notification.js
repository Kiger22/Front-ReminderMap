import('./notification.css');
import { createButton } from '../Button/button';

export const AlertNotification = (title, content, callback, options = {}) => {
  // Opciones por defecto
  const mergedOptions = {
    showCancelButton: false,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
    onCancel: null,
    ...options
  };

  // Creamos el overlay
  const overlay = document.createElement('div');
  overlay.classList.add('notification-overlay');

  // Creamos el contenedor principal de la notificación
  const notificationContainer = document.createElement('div');
  notificationContainer.classList.add('notification-container');

  // Creamos el contenedor de contenido
  const notificationContent = document.createElement('div');
  notificationContent.classList.add('notification-content');

  // Creamos el título
  if (title) {
    const titleElement = document.createElement('h2');
    titleElement.classList.add('notification-heading');
    titleElement.textContent = title;
    notificationContent.appendChild(titleElement);
  }

  // Creamos el contenido
  const contentElement = document.createElement('div');
  contentElement.classList.add('notification-prompt');

  if (typeof content === 'string') {
    contentElement.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    contentElement.appendChild(content);
  }

  notificationContent.appendChild(contentElement);

  // Creamos el contenedor de botones
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('notification-button-container');

  // Creamos el botón de aceptar usando createButton
  createButton(buttonContainer, mergedOptions.confirmButtonText, 'notification-confirm-button', () => {
    overlay.remove();
    if (callback) callback(true);
  });

  // Creamos el botón de cancelar si es necesario
  if (mergedOptions.showCancelButton) {
    createButton(buttonContainer, mergedOptions.cancelButtonText, 'notification-cancel-button', () => {
      overlay.remove();
      if (mergedOptions.onCancel) {
        mergedOptions.onCancel();
      } else if (callback) {
        callback(false);
      }
    });
  }

  // Ensamblamos la notificación
  notificationContent.appendChild(buttonContainer);
  notificationContainer.appendChild(notificationContent);
  overlay.appendChild(notificationContainer);
  document.body.appendChild(overlay);
};
