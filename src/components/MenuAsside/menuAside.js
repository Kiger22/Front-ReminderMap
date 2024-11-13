import("./menuAside.css");

export const createAsideMenu = (node, menuItems, menuItemsII) => {
  const aside = document.createElement("aside");
  aside.classList.add("menu-aside");
  document.body.insertBefore(aside, node);

  const nav = document.createElement("nav");
  nav.classList.add("menu-nav");
  aside.appendChild(nav);

  const ul = document.createElement("ul");
  ul.classList.add("menu-list");
  nav.appendChild(ul);

  // Función para crear elementos de menú
  const createMenuItem = (item, parentUl) => {
    const li = document.createElement("li");
    li.classList.add("menu-item");
    parentUl.appendChild(li);

    const link = document.createElement("a");
    link.classList.add("menu-link");
    link.href = item.href || '#';
    li.appendChild(link);

    // Añadir un contenedor de icono
    if (item.icon) {
      const iconDiv = document.createElement("div");
      iconDiv.classList.add("menu-icon");

      const iconImg = document.createElement("img");
      iconImg.classList.add("icon");
      iconImg.src = item.icon; // Aquí va la ruta del archivo SVG
      iconImg.alt = `${item.title} icon`;
      iconDiv.appendChild(iconImg);

      // Insertar el contenedor de icono en el enlace
      link.appendChild(iconDiv);
    }

    // Añadir un contenedor para el texto
    const textDiv = document.createElement("div");
    textDiv.classList.add("menu-text");
    textDiv.textContent = item.title;
    link.appendChild(textDiv);

    // Añadir acción si existe
    if (typeof item.action === 'function') {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        item.action();
      });
    }
  };

  // Crear elementos de menú para el primer grupo
  menuItems.forEach(item => {
    createMenuItem(item, ul);
  });

  const ulII = document.createElement("ul");
  ulII.classList.add("menu-list");
  nav.appendChild(ulII);

  // Crear elementos de menú para el segundo grupo
  menuItemsII.forEach(item => {
    createMenuItem(item, ulII);
  });
};



