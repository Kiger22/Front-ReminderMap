import('./reminderNotification.css');

export const NotificationReminder = (reminder) => {
  // Crear contenedor principal de notificación
  const notificationsContainer = document.createElement('div');
  notificationsContainer.classList.add('reminder-notifications-container');

  // Crear contenedor para el mensaje de recordatorio
  const reminderDiv = document.createElement('div');
  reminderDiv.classList.add('success');

  // Crear contenedor flex para alinear elementos
  const flexDiv = document.createElement('div');
  flexDiv.classList.add('flex');

  // Crear contenedor para el mensaje de texto
  const reminderPromptWrap = document.createElement('div');
  reminderPromptWrap.classList.add('success-prompt-wrap');

  // Crear encabezado del recordatorio (título)
  const reminderTitle = document.createElement('p');
  reminderTitle.classList.add('success-prompt-heading');
  reminderTitle.textContent = reminder.name;

  // Crear el mensaje del recordatorio
  const reminderPrompt = document.createElement('div');
  reminderPrompt.classList.add('success-prompt-prompt');

  const reminderText = document.createElement('p');
  reminderText.innerHTML = `
    📅  ${new Date(reminder.date).toLocaleDateString()}<br>
    ⏰  ${reminder.time}<br>
    📝  ${reminder.description}<br>
    📍  ${reminder.location}
  `;

  reminderPrompt.appendChild(reminderText);

  // Crear contenedor para los botones
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('success-button-container');

  // Crear botón "Visto"
  const seenButton = document.createElement('button');
  seenButton.type = 'button';
  seenButton.classList.add('success-button-main');
  seenButton.textContent = 'Visto';
  seenButton.addEventListener('click', () => {
    notificationsContainer.remove();
  });

  // Crear botón "Posponer"
  const snoozeButton = document.createElement('button');
  snoozeButton.type = 'button';
  snoozeButton.classList.add('success-button-secondary');
  snoozeButton.textContent = 'Posponer';
  snoozeButton.addEventListener('click', () => {
    alert('Recordatorio pospuesto por 10 minutos');
  });

  // Crear botón "Cancelar"
  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.classList.add('success-button-secondary');
  cancelButton.textContent = 'Cancelar';
  cancelButton.addEventListener('click', () => {
    notificationsContainer.remove();
  });

  // Agregar los botones al contenedor de botones
  buttonContainer.appendChild(seenButton);
  buttonContainer.appendChild(snoozeButton);
  buttonContainer.appendChild(cancelButton);

  // Agregar todos los elementos al contenedor principal
  reminderPromptWrap.appendChild(reminderTitle);
  reminderPromptWrap.appendChild(reminderPrompt);
  reminderPromptWrap.appendChild(buttonContainer);

  flexDiv.appendChild(reminderPromptWrap);
  reminderDiv.appendChild(flexDiv);
  notificationsContainer.appendChild(reminderDiv);

  // Agregar el contenedor de notificación al body del documento
  document.body.appendChild(notificationsContainer);
};
