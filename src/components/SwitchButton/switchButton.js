import("./switchButton.css")

export const SwitchButton = () => {
  const switchContainer = document.createElement('div');
  switchContainer.className = 'switch-container';

  const switchElement = document.createElement('div');
  switchElement.id = 'switch';
  switchContainer.appendChild(switchElement);

  const circle = document.createElement('div');
  circle.id = 'circle';
  switchElement.appendChild(circle);

  // No añadimos el event listener aquí, ya que se maneja en main.js
  // para evitar duplicidad de funcionalidad

  return switchContainer;
};




