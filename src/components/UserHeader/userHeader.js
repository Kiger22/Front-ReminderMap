import { goToHomePage } from "../../functions/goHomePage";
import { logOut } from "../../functions/logout";
import { AlertNotification } from "../AlertNotification/notification";
import { createButton } from "../Button/button";
import { Home } from "../Home/home";
import { NotificationReminder } from "../ReminderNotification/reminderNotification";
import('./userHeader.css');

export const createUserHeader = (node, avatarPath, settingsIconPath, openSettingsForm) => {
  const DEFAULT_AVATAR_PATH = './assets/user-circle-svgrepo-com.svg';

  const userContainer = document.createElement('div');
  userContainer.classList.add('user-header');

  const avatarDiv = document.createElement('div');
  avatarDiv.classList.add('avatar-container-header');

  const avatarImg = document.createElement('img');
  avatarImg.classList.add('avatar-img-header');
  avatarImg.src = avatarPath || DEFAULT_AVATAR_PATH;
  avatarImg.alt = 'User Avatar';
  avatarImg.addEventListener('click', () => {
    NotificationReminder()
  });

  // Manejar errores de carga de imagen
  avatarImg.onerror = () => {
    avatarImg.src = DEFAULT_AVATAR_PATH;
  };

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

  createButton(userContainer, "Logout", "logout-button", () => {
    console.log("Logout");
    logOut();
  })

  const logoutIcon = document.createElement('img');
  logoutIcon.classList.add('logout-icon');
  logoutIcon.src = '../../assets/logout-3-svgrepo-com.svg';

  logoutIcon.addEventListener('click', () => {
    console.log("Logout");
    logOut();
  });
  userContainer.appendChild(logoutIcon);


  node.appendChild(userContainer);
};
