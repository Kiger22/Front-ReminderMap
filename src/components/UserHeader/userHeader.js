import { AlertNotification } from "../AlertNotification/notification";
import('./userHeader.css');

export const createUserHeader = (node, avatarPath, settingsIconPath, openSettingsForm) => {
  const userContainer = document.createElement('div');
  userContainer.classList.add('user-header');

  const avatarDiv = document.createElement('div');
  avatarDiv.classList.add('avatar-container-header');

  const avatarImg = document.createElement('img');
  avatarImg.classList.add('avatar-img-header');
  avatarImg.src = avatarPath;
  avatarImg.alt = 'User Avatar';

  avatarDiv.appendChild(avatarImg);
  userContainer.appendChild(avatarDiv);

  const settingsDiv = document.createElement('div');
  settingsDiv.classList.add('settings-container');

  const settingsIcon = document.createElement('img');
  settingsIcon.classList.add('settings-icon');
  settingsIcon.src = settingsIconPath;
  settingsIcon.alt = 'Settings Icon';

  if (typeof openSettingsForm === 'function') {
    settingsIcon.addEventListener('click', openSettingsForm);
  }

  settingsDiv.appendChild(settingsIcon);
  userContainer.appendChild(settingsDiv);

  node.appendChild(userContainer);
};
