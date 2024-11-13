import('./remindersList.css');

export const remindersPage = (node) => {
  node.innerHTML = "";

  const remindersContainer = document.createElement('div');
  remindersContainer.classList.add('reminders-container');

  const header = document.createElement('h2');
  header.textContent = "Recordatorios";

  const content = document.createElement('p');
  content.textContent = "Gestiona todos tus recordatorios aquí.";

  remindersContainer.appendChild(header);
  remindersContainer.appendChild(content);

  node.appendChild(remindersContainer);
};
