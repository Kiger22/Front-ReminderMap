import('./today.css');

export const todayPage = (node) => {
  node.innerHTML = "";

  const todayContainer = document.createElement('div');
  todayContainer.classList.add('today-container');

  const header = document.createElement('h2');
  header.textContent = "Hoy";

  const content = document.createElement('p');
  content.textContent = "Aquí puedes ver tus tareas y eventos para el día de hoy.";

  todayContainer.appendChild(header);
  todayContainer.appendChild(content);

  node.appendChild(todayContainer);
};

