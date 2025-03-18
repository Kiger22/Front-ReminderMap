import('./notification.css');

/**
 * Crea una notificación de alerta
 * @param {string} title - Título de la notificación
 * @param {string|HTMLElement} content - Contenido de la notificación (puede ser texto o un elemento DOM)
 * @param {Function} callback - Función a ejecutar al cerrar la notificación
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.autoClose - Si la notificación se cierra automáticamente
 * @param {number} options.autoCloseTime - Tiempo en ms antes de cerrar automáticamente
 */
export const AlertNotification = (title, content, callback, options = {}) => {
  const defaultOptions = {
    autoClose: false,
    autoCloseTime: 3000
  };

  const settings = { ...defaultOptions, ...options };

  const overlay = document.createElement('div');
  overlay.classList.add('notification-overlay');

  const notificationsContainer = document.createElement('div');
  notificationsContainer.classList.add('notifications-container');

  // Botón de cerrar
  const closeBtn = document.createElement("span");
  closeBtn.className = "closeBtn";
  closeBtn.innerHTML = "&times;";
  notificationsContainer.appendChild(closeBtn);

  const successDiv = document.createElement('div');
  successDiv.classList.add('success');

  const successPromptHeading = document.createElement('h2');
  successPromptHeading.classList.add('success-prompt-heading');
  successPromptHeading.textContent = title;

  const successPromptPrompt = document.createElement('div');
  successPromptPrompt.classList.add('success-prompt-prompt');

  // Manejar tanto strings como elementos DOM
  if (content instanceof HTMLElement) {
    successPromptPrompt.appendChild(content);
  } else {
    successPromptPrompt.textContent = content;
  }

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('success-button-container');

  const mainButton = document.createElement('button');
  mainButton.classList.add('success-button-main-alert');
  mainButton.textContent = 'Aceptar';

  buttonContainer.appendChild(mainButton);

  successDiv.appendChild(successPromptHeading);
  successDiv.appendChild(successPromptPrompt);
  successDiv.appendChild(buttonContainer);

  notificationsContainer.appendChild(successDiv);
  overlay.appendChild(notificationsContainer);
  document.body.appendChild(overlay);

  const closeNotification = () => {
    overlay.remove();
    if (callback) callback();
  };

  closeBtn.onclick = closeNotification;
  mainButton.onclick = closeNotification;

  if (settings.autoClose) {
    setTimeout(closeNotification, settings.autoCloseTime);
  }
};
