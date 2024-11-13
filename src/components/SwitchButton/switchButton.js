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

  document.body.appendChild(switchContainer);
};




