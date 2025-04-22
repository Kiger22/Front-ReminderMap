import("./button.css");

export const createButton = (node, text, ID, onClick) => {
  const button = document.createElement("button");
  button.className = "button";
  button.id = ID;
  button.type = "submit";
  button.innerHTML = `
      <span class="transition"></span>
      <span class="gradient"></span>
      <span class="label">${text}</span>
      `;

  // Verificamos que node sea un elemento DOM válido
  if (node && typeof node.appendChild === 'function') {
    node.appendChild(button);
  } else {
    console.error('El nodo proporcionado no es un elemento DOM válido:', node);
  }

  if (onClick && typeof onClick === 'function') {
    button.addEventListener("click", onClick);
  }

  return button;
};



