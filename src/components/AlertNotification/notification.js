import('./notification.css');

export const AlertNotification = (title, content, callback, options = {}) => {
  const defaultOptions = {
    autoClose: false,
    autoCloseTime: 5000,
    showCancelButton: true
  };

  const mergedOptions = { ...defaultOptions, ...options };

  // Creamos el overlay
  const overlay = document.createElement('div');
  overlay.classList.add('notification-overlay');

  // Creamos el contenedor de la notificación
  const container = document.createElement('div');
  container.classList.add('notifications-container');

  // Creamos el div de éxito
  const successDiv = document.createElement('div');
  successDiv.classList.add('success');

  // Creamos el contenedor flex
  const flexDiv = document.createElement('div');
  flexDiv.classList.add('flex');

  // Creamos el contenedor del contenido
  const contentWrap = document.createElement('div');
  contentWrap.classList.add('success-prompt-wrap');

  // Añadimos el título si existe
  if (title) {
    const titleElement = document.createElement('p');
    titleElement.classList.add('success-prompt-heading');
    titleElement.textContent = title;
    contentWrap.appendChild(titleElement);
  }

  // Manejamos el contenido
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

  // Creamos el contenedor de botones
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('success-button-container');

  // Creamos el botón de aceptar
  const acceptButton = document.createElement('button');
  acceptButton.type = 'button';
  acceptButton.classList.add('success-button-main-alert');
  acceptButton.textContent = 'Aceptar';
  acceptButton.onclick = () => {
    overlay.remove();
    if (callback) callback(true);
  };

  buttonContainer.appendChild(acceptButton);

  // Creamos el botón de cancelar si está habilitado
  if (mergedOptions.showCancelButton) {
    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.classList.add('success-button-secondary-alert');
    cancelButton.textContent = 'Cancelar';
    cancelButton.onclick = () => {
      overlay.remove();
      if (callback) callback(false);
    };
    buttonContainer.appendChild(cancelButton);
  }

  // Ensamblamos la notificación
  contentWrap.appendChild(buttonContainer);
  flexDiv.appendChild(contentWrap);
  successDiv.appendChild(flexDiv);
  container.appendChild(successDiv);
  overlay.appendChild(container);

  // Añadimos al DOM
  document.body.appendChild(overlay);

  // Auto-cerrar si está configurado
  if (mergedOptions.autoClose) {
    setTimeout(() => {
      overlay.remove();
      if (callback) callback(true);
    }, mergedOptions.autoCloseTime);
  }
};
