import { goToHomePage } from "../../functions/navigation/goHomePage";
import { createButton } from "../Button/button";
import { createIconButton } from "../IconButton/iconButton";
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
  logoImg.addEventListener('click', () => {
    goToHomePage();
  });
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
  createIconButton(authButtons, './assets/login-3-svgrepo-com.svg', createLoginForm, "Login");
  createButton(authButtons, "Register", "register-button", createRegisterForm);
  createIconButton(authButtons, './assets/add-square-svgrepo-com.svg', createRegisterForm, "Register");

  // Creamos un div para el header del usuario
  const userHeaderContainer = document.createElement("div");
  userHeaderContainer.className = "user-header-container";
  userHeaderContainer.id = "user-header";
  userHeaderContainer.style.display = "none"; // Inicialmente oculto

  // Creamos el header del usuario
  if (userHeaderContainer) {
    const avatar = localStorage.getItem('avatar');
    createUserHeader(userHeaderContainer, avatar, '../assets/setting-1-svgrepo-com.svg', openProfileSettings);
  }

  loginSection.appendChild(authButtons);
  header.appendChild(loginSection);
  header.appendChild(userHeaderContainer);
};

// Agregamos esta función para cambiar la visibilidad
export const toggleAuthDisplay = (isLoggedIn) => {
  const authButtons = document.getElementById("auth-buttons");
  const userHeader = document.getElementById("user-header");

  if (authButtons && userHeader) {
    if (isLoggedIn) {
      authButtons.style.display = "none";
      userHeader.style.display = "flex";
    } else {
      authButtons.style.display = "flex";
      userHeader.style.display = "none";
    }
  } else {
    console.error('Elementos authButtons o userHeader no encontrados en el DOM');
  }
};



