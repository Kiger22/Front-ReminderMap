import { createButton } from "../Button/button";
import { createSvgButton } from "../IconButton/iconButton";
import { createLoginForm } from "../LoginForm/login";
import { createRegisterForm } from "../RegisterForm/register";
import { NotificationReminder } from "../ReminderNotification/reminderNotification";
import { openProfileSettings } from "../SettingForm/settingsForm";
import { createUserHeader } from "../UserHeader/userHeader";
import "./header.css"

export const createHeader = (node, logoSrc, menuItems, menuItemsII) => {
  const header = document.createElement("header");
  header.className = "header";
  document.body.insertBefore(header, node);

  // logoSrc
  const logoSection = document.createElement("div");
  logoSection.className = "header-logo";
  const logoImg = document.createElement("img");
  logoImg.src = logoSrc;
  logoImg.addEventListener('click', () => NotificationReminder());
  logoSection.appendChild(logoImg);
  header.appendChild(logoSection);

  //Titulo principal
  const titleSection = document.createElement("div");
  titleSection.className = "header-title";
  const title = document.createElement("h1");
  title.innerText = "Hola ...";
  titleSection.appendChild(title);
  header.appendChild(titleSection);

  // menuItems
  const menuSection = document.createElement("nav");
  menuSection.className = "header-menu";
  menuItems.forEach(item => {
    const link = document.createElement("a");
    link.href = item.href;
    link.innerText = item.text;
    link.addEventListener("click", item.page)
    menuSection.appendChild(link);
  });
  header.appendChild(menuSection);

  // menuItemsII
  if (!menuItemsII) {
    const menuSectionII = document.createElement("nav");
    menuSectionII.className = "header-menu-login";
    menuItemsII.forEach(item => {
      const link = document.createElement("a");
      link.href = item.href;
      link.innerText = item.text;
      menuSectionII.appendChild(link);
    });
    header.appendChild(menuSectionII);
  }


  // loginSección
  const loginSection = document.createElement("div");
  loginSection.className = "header-login";
  createUserHeader(loginSection, './assets/aboutMe.jpeg', './assets/setting-1-svgrepo-com.svg', openProfileSettings);
  createButton(loginSection, "Login", createLoginForm);
  createSvgButton(loginSection, './assets/login-3-svgrepo-com.svg', createLoginForm, "Login");
  createButton(loginSection, "Register", createRegisterForm);
  createSvgButton(loginSection, './assets/add-square-svgrepo-com.svg', createRegisterForm, "Registro");

  header.appendChild(loginSection);
};



