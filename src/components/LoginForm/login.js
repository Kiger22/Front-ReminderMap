import { loging } from "../../functions/loging";
import { AlertNotification } from "../AlertNotification/notification";
import { createRegisterForm } from "../RegisterForm/register";
import("./login.css");

export const createLoginForm = () => {

  // Contenedor del formulario de login
  const loginContent = document.createElement('div');
  loginContent.classList.add('login-container');

  const form = document.createElement('form');
  form.classList.add('form');

  // Botón de cerrar el Form
  const closeBtn = document.createElement("span");
  closeBtn.className = "closeBtn";
  closeBtn.innerHTML = "&times;";
  form.appendChild(closeBtn);
  closeBtn.onclick = () => {
    loginContent.remove();
  }

  // Título del formulario
  const h2 = document.createElement('h2');
  h2.classList.add('form-title');
  h2.textContent = 'Login';

  // Campo del email
  const emailSpan = document.createElement('span');
  emailSpan.classList.add('input-span');

  const emailLabel = document.createElement('label');
  emailLabel.setAttribute('for', 'email');
  emailLabel.classList.add('label');
  emailLabel.textContent = 'Usuario';

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.id = 'email';

  emailSpan.appendChild(emailLabel);
  emailSpan.appendChild(emailInput);

  // Campo de contraseña
  const passwordSpan = document.createElement('span');
  passwordSpan.classList.add('input-span');

  const passwordLabel = document.createElement('label');
  passwordLabel.setAttribute('for', 'password');
  passwordLabel.classList.add('label');
  passwordLabel.textContent = 'Contraseña';

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.name = 'password';
  passwordInput.id = 'password';

  passwordSpan.appendChild(passwordLabel);
  passwordSpan.appendChild(passwordInput);

  // Link para recuperar contraseña
  const forgotPasswordSpan = document.createElement('span');
  forgotPasswordSpan.classList.add('span');

  const forgotPasswordLink = document.createElement('a');
  forgotPasswordLink.textContent = 'Olvidaste tu contraseña?';
  forgotPasswordLink.href = '#';
  forgotPasswordLink.addEventListener('click', (event) => {
    event.preventDefault();
    AlertNotification('Lo Siento', 'Este evento aun esta en desarrollo');
  });


  forgotPasswordSpan.appendChild(forgotPasswordLink);

  // Botón de envío
  const submitInput = document.createElement('input');
  submitInput.classList.add('submit');
  submitInput.type = 'submit';
  submitInput.value = 'Log in';
  submitInput.addEventListener('click', loging);

  // Enlace para registrarse
  const signUpSpan = document.createElement('span');
  signUpSpan.classList.add('span');
  signUpSpan.innerHTML = `Aún no tienes cuenta? <a href="#" id="registerLink">Regístrate</a>`;

  signUpSpan.querySelector('#registerLink').onclick = (event) => {
    event.preventDefault();
    loginContent.remove();
    createRegisterForm();
  };

  form.appendChild(h2);
  form.appendChild(emailSpan);
  form.appendChild(passwordSpan);
  form.appendChild(forgotPasswordSpan);
  form.appendChild(submitInput);
  form.appendChild(signUpSpan);
  loginContent.appendChild(form);

  document.body.appendChild(loginContent);
}
