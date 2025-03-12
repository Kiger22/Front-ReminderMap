import('./notification.css');

export const AlertNotification = (title, content, callback, autoClose = true) => {
  // Crear contenedor principal de notificación
  const notificationsContainer = document.createElement('div');
  notificationsContainer.classList.add('notifications-container');

  // Crear contenedor para el mensaje de éxito
  const successDiv = document.createElement('div');
  successDiv.classList.add('success');

  // Crear contenedor flex para alinear elementos
  const flexDiv = document.createElement('div');
  flexDiv.classList.add('flex');

  // Crear contenedor para el mensaje de texto
  const successPromptWrap = document.createElement('div');
  successPromptWrap.classList.add('success-prompt-wrap');

  // Crear encabezado del mensaje
  const successPromptHeading = document.createElement('p');
  successPromptHeading.classList.add('success-prompt-heading');
  successPromptHeading.textContent = title;

  // Crear el mensaje de descripción
  const successPromptPrompt = document.createElement('div');
  successPromptPrompt.classList.add('success-prompt-prompt');

  // Manejar el contenido según su tipo
  if (content instanceof HTMLElement) {
    successPromptPrompt.appendChild(content);
  } else {
    const promptText = document.createElement('p');
    promptText.textContent = content;
    successPromptPrompt.appendChild(promptText);
  }

  // Crear contenedor para los botones
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('success-button-container');

  // Crear botón principal (OK o Confirmar)
  const confirmButton = document.createElement('button');
  confirmButton.type = 'button';
  confirmButton.classList.add('success-button-main-alert');
  confirmButton.textContent = autoClose ? 'OK' : 'Confirmar';
  confirmButton.addEventListener('click', () => {
    notificationsContainer.remove();
    if (callback) callback();
  });

  // Agregar el botón principal
  buttonContainer.appendChild(confirmButton);

  // Si no es autoClose, añadir botón de cancelar
  if (!autoClose) {
    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.classList.add('success-button-secondary-alert');
    cancelButton.textContent = 'Cancelar';
    cancelButton.addEventListener('click', () => {
      notificationsContainer.remove();
    });
    buttonContainer.appendChild(cancelButton);
  }

  // Agregar todos los elementos al contenedor principal
  successPromptWrap.appendChild(successPromptHeading);
  successPromptWrap.appendChild(successPromptPrompt);
  successPromptWrap.appendChild(buttonContainer);

  flexDiv.appendChild(successPromptWrap);
  successDiv.appendChild(flexDiv);
  notificationsContainer.appendChild(successDiv);

  // Agregar el contenedor de notificación al body del documento
  document.body.appendChild(notificationsContainer);
};
