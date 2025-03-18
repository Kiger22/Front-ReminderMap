import { registering } from "../../functions/registering";
import { createLoginForm } from "../LoginForm/login";
import('./register.css');

const DEFAULT_AVATAR_PATH = '../assets/user-circle-svgrepo-com.svg';

export const createRegisterForm = () => {
  const registerContent = document.createElement('div');
  registerContent.classList.add('register-container');

  const form = document.createElement('form');
  form.classList.add('register-form');

  const closeBtn = document.createElement("span");
  closeBtn.className = "closeBtn";
  closeBtn.innerHTML = "&times;";
  form.appendChild(closeBtn);
  closeBtn.onclick = () => {
    registerContent.remove();
  }

  const h2 = document.createElement('h2');
  h2.classList.add('form-title');
  h2.textContent = 'Registro';

  // Contenedor del avatar
  const avatarContainer = document.createElement('div');
  avatarContainer.classList.add('avatar-container');

  const avatarImg = document.createElement('img');
  avatarImg.src = DEFAULT_AVATAR_PATH;
  avatarImg.alt = 'Avatar';
  avatarImg.classList.add('avatar-img');

  // Botón para cambiar avatar
  const changeAvatarBtn = document.createElement('button');
  changeAvatarBtn.type = 'button';
  changeAvatarBtn.classList.add('change-avatar-btn');
  changeAvatarBtn.textContent = 'Cambiar Avatar';

  // Evento para seleccionar una imagen
  changeAvatarBtn.onclick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = "avatar";
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          avatarImg.src = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        avatarImg.src = DEFAULT_AVATAR_PATH;
      }
    };

    fileInput.click();
  };

  avatarContainer.appendChild(avatarImg);
  avatarContainer.appendChild(changeAvatarBtn);

  // Campo de nombre
  const nameSpan = document.createElement('span');
  nameSpan.classList.add('input-span');

  const nameLabel = document.createElement('label');
  nameLabel.setAttribute('for', 'name');
  nameLabel.classList.add('label');
  nameLabel.textContent = 'Nombre';

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.name = 'name';
  nameInput.id = 'name';

  nameSpan.appendChild(nameLabel);
  nameSpan.appendChild(nameInput);

  // Campo de email
  const emailSpan = document.createElement('span');
  emailSpan.classList.add('input-span');

  const emailLabel = document.createElement('label');
  emailLabel.setAttribute('for', 'email');
  emailLabel.classList.add('label');
  emailLabel.textContent = 'Email';

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.id = 'email';

  emailSpan.appendChild(emailLabel);
  emailSpan.appendChild(emailInput);

  // Campo de nickname
  const nicknameSpan = document.createElement('span');
  nicknameSpan.classList.add('input-span');

  const nicknameLabel = document.createElement('label');
  nicknameLabel.setAttribute('for', 'nickname');
  nicknameLabel.classList.add('label');
  nicknameLabel.textContent = 'Nickname';

  const nicknameInput = document.createElement('input');
  nicknameInput.type = 'text';
  nicknameInput.name = 'nickname';
  nicknameInput.id = 'nickname';

  nicknameSpan.appendChild(nicknameLabel);
  nicknameSpan.appendChild(nicknameInput);

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

  // Botón de enviar
  const submitInput = document.createElement('input');
  submitInput.classList.add('submit');
  submitInput.type = 'submit';
  submitInput.value = 'Registrar';
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await registering();
  });

  // Enlace para iniciar sesión
  const loginSpan = document.createElement('span');
  loginSpan.classList.add('span');
  loginSpan.innerHTML = `¿Ya tienes cuenta?  <a href="#" id="loginLink"> Inicia sesión</a>`;

  loginSpan.querySelector('#loginLink').onclick = (event) => {
    event.preventDefault();
    registerContent.remove();
    createLoginForm();
  };

  form.appendChild(h2);
  form.appendChild(avatarContainer);
  form.appendChild(nameSpan);
  form.appendChild(nicknameSpan);
  form.appendChild(emailSpan);
  form.appendChild(passwordSpan);
  form.appendChild(submitInput);
  form.appendChild(loginSpan);
  registerContent.appendChild(form);

  document.body.appendChild(registerContent);
}

// Función para cerrar el formulario de registro
export const closeRegistrationForm = () => {
  const registrationForm = document.querySelector('.register-container');
  registrationForm.remove();
};
