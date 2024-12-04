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

  // Titulo principal
  const titleSection = document.createElement("div");
  titleSection.className = "header-title";
  const title = document.createElement("h1");
  title.id = "title-header"
  title.innerText = "Hola ..."; // Texto inicial
  titleSection.appendChild(title);
  header.appendChild(titleSection);

  // menuItems
  const menuSection = document.createElement("nav");
  menuSection.className = "header-menu";
  menuItems.forEach(item => {
    const link = document.createElement("a");
    link.href = item.href;
    link.innerText = item.text;
    link.addEventListener("click", item.page);
    menuSection.appendChild(link);
  });
  header.appendChild(menuSection);

  // menuItemsII
  if (menuItemsII) {
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

  // Creamos un div para los botones de login/register
  const authButtons = document.createElement("div");
  authButtons.className = "auth-buttons";
  authButtons.id = "auth-buttons";

  createButton(authButtons, "Login", "login-button", createLoginForm);
  createSvgButton(authButtons, './assets/login-3-svgrepo-com.svg', createLoginForm, "Login");
  createButton(authButtons, "Register", "register-button", createRegisterForm);
  createSvgButton(authButtons, './assets/add-square-svgrepo-com.svg', createRegisterForm, "Registro");

  // Creamos un div para el header del usuario
  const userHeaderContainer = document.createElement("div");
  userHeaderContainer.className = "user-header-container";
  userHeaderContainer.id = "user-header";
  userHeaderContainer.style.display = "none"; // Inicialmente oculto

  createUserHeader(userHeaderContainer, './assets/aboutMe.jpeg', './assets/setting-1-svgrepo-com.svg', openProfileSettings);

  loginSection.appendChild(authButtons);
  loginSection.appendChild(userHeaderContainer);
  header.appendChild(loginSection);
};

// Agregar esta función para cambiar la visibilidad
export const toggleAuthDisplay = (isLoggedIn) => {
  const authButtons = document.getElementById("auth-buttons");
  const userHeader = document.getElementById("user-header");

  if (isLoggedIn) {
    authButtons.style.display = "none";
    userHeader.style.display = "flex";
  } else {
    authButtons.style.display = "flex";
    userHeader.style.display = "none";
  }
};



