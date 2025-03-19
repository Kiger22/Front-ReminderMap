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
    autoCloseTime: 3000,
    showCancelButton: true // Nueva opción para controlar si se muestra el botón cancelar
  };

  const mergedOptions = { ...defaultOptions, ...options };

  // Crear el overlay
  const overlay = document.createElement('div');
  overlay.classList.add('notification-overlay');

  // Crear el contenedor de la notificación
  const container = document.createElement('div');
  container.classList.add('notifications-container');

  // Crear el div de éxito
  const successDiv = document.createElement('div');
  successDiv.classList.add('success');

  // Crear el contenedor flex
  const flexDiv = document.createElement('div');
  flexDiv.classList.add('flex');

  // Crear el contenedor del contenido
  const contentWrap = document.createElement('div');
  contentWrap.classList.add('success-prompt-wrap');

  // Añadir el título si existe
  if (title) {
    const titleElement = document.createElement('p');
    titleElement.classList.add('success-prompt-heading');
    titleElement.textContent = title;
    contentWrap.appendChild(titleElement);
  }

  // Manejar el contenido
  if (typeof content === 'string') {
    // Si el contenido parece ser HTML
    if (content.trim().startsWith('<')) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      contentWrap.appendChild(tempDiv.firstElementChild);
    } else {
      // Si es texto plano
      const contentElement = document.createElement('p');
      contentElement.classList.add('success-prompt-prompt');
      contentElement.textContent = content;
      contentWrap.appendChild(contentElement);
    }
  } else if (content instanceof HTMLElement) {
    contentWrap.appendChild(content);
  }

  // Crear el contenedor de botones
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('success-button-container');

  // Crear el botón de aceptar
  const acceptButton = document.createElement('button');
  acceptButton.type = 'button';
  acceptButton.classList.add('success-button-main-alert');
  acceptButton.textContent = 'Aceptar';
  acceptButton.onclick = () => {
    overlay.remove();
    if (callback) callback(true); // Pasamos true para indicar que se aceptó
  };

  // Crear el botón de cancelar
  if (mergedOptions.showCancelButton) {
    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.classList.add('success-button-secondary-alert');
    cancelButton.textContent = 'Cancelar';
    cancelButton.onclick = () => {
      overlay.remove();
      if (callback) callback(false); // Pasamos false para indicar que se canceló
    };
    buttonContainer.appendChild(cancelButton);
  }

  // Ensamblar la notificación
  buttonContainer.appendChild(acceptButton);
  contentWrap.appendChild(buttonContainer);
  flexDiv.appendChild(contentWrap);
  successDiv.appendChild(flexDiv);
  container.appendChild(successDiv);
  overlay.appendChild(container);

  // Añadir al DOM
  document.body.appendChild(overlay);

  // Auto-cerrar si está configurado
  if (mergedOptions.autoClose) {
    setTimeout(() => {
      overlay.remove();
      if (callback) callback(true);
    }, mergedOptions.autoCloseTime);
  }
};
