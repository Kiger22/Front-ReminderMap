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

  // Campo del usuario
  const userSpan = document.createElement('span');
  userSpan.classList.add('input-span');

  const userLabel = document.createElement('label');
  userLabel.setAttribute('for', 'user');
  userLabel.classList.add('label');
  userLabel.textContent = 'Usuario';

  const userInput = document.createElement('input');
  userInput.type = 'text';
  userInput.name = 'user';
  userInput.id = 'user';

  userSpan.appendChild(userLabel);
  userSpan.appendChild(userInput);

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

  // Agregar el EventListener al formulario
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevenir el envío del formulario
    loging(); // Llamar a la función loging
  });

  // Botón de envío
  const submitInput = document.createElement('input');
  submitInput.classList.add('submit');
  submitInput.type = 'submit'; // Mantener como 'submit'
  submitInput.value = 'Log in';

  form.appendChild(h2);
  form.appendChild(userSpan);
  form.appendChild(passwordSpan);
  form.appendChild(forgotPasswordSpan);
  form.appendChild(submitInput);

  // Enlace para registrarse
  const signUpSpan = document.createElement('span');
  signUpSpan.classList.add('span');
  signUpSpan.innerHTML = `Aún no tienes cuenta? <a href="#" id="registerLink">Regístrate</a>`;

  signUpSpan.querySelector('#registerLink').onclick = (event) => {
    event.preventDefault();
    loginContent.remove();
    createRegisterForm();
  };

  form.appendChild(signUpSpan);
  loginContent.appendChild(form);

  document.body.appendChild(loginContent);
}

// Función para cerrar el formulario de login
export const closeLoginForm = () => {
  const loginForm = document.querySelector('.login-container');
  if (loginForm) {
    loginForm.remove();
  }
};
