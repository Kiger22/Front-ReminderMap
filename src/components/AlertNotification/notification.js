import('./notification.css');

export const AlertNotification = (title, text) => {
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

  const promptText = document.createElement('p');
  promptText.textContent = text;

  successPromptPrompt.appendChild(promptText);

  // Crear contenedor para los botones
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('success-button-container');

  // Crear botón principal
  const viewStatusButton = document.createElement('button');
  viewStatusButton.type = 'button';
  viewStatusButton.classList.add('success-button-main-alert');
  viewStatusButton.textContent = 'ok';

  // Crear botón secundario
  const dismissButton = document.createElement('button');
  dismissButton.type = 'button';
  dismissButton.classList.add('success-button-secondary-alert');
  dismissButton.textContent = 'close';
  viewStatusButton.addEventListener('click', () => {
    notificationsContainer.remove();
  });

  // Agregar los botones al contenedor de botones
  buttonContainer.appendChild(viewStatusButton);
  buttonContainer.appendChild(dismissButton);

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
