import("./menuAside.css");

export const createAsideMenu = (node, menuItems, menuItemsII) => {
  const aside = document.createElement("aside");
  aside.classList.add("menu-aside");
  document.body.insertBefore(aside, node);

  const nav = document.createElement("nav");
  nav.classList.add("menu-nav");
  aside.appendChild(nav);

  // Sección principal
  const primarySection = document.createElement("div");
  primarySection.classList.add("menu-section");
  nav.appendChild(primarySection);

  // Título para la sección principal
  const primaryTitle = document.createElement("h3");
  primaryTitle.classList.add("menu-section-title");
  primaryTitle.textContent = "Principal";
  primarySection.appendChild(primaryTitle);

  const ul = document.createElement("ul");
  ul.classList.add("menu-list");
  primarySection.appendChild(ul);

  // Sección secundaria
  const secondarySection = document.createElement("div");
  secondarySection.classList.add("menu-section");
  nav.appendChild(secondarySection);

  // Título para la sección secundaria
  const secondaryTitle = document.createElement("h3");
  secondaryTitle.classList.add("menu-section-title");
  secondaryTitle.textContent = "Lugares y Categorías";
  secondarySection.appendChild(secondaryTitle);

  const ulII = document.createElement("ul");
  ulII.classList.add("menu-list");
  secondarySection.appendChild(ulII);

  // Función para crear elementos de menú
  const createMenuItem = (item, parentUl) => {
    const li = document.createElement("li");
    li.classList.add("menu-item");
    parentUl.appendChild(li);

    const link = document.createElement("a");
    link.classList.add("menu-link");
    link.href = item.href || '#';
    li.appendChild(link);

    // Añadimos un contenedor de icono
    if (item.icon) {
      const iconDiv = document.createElement("div");
      iconDiv.classList.add("menu-icon");

      const iconImg = document.createElement("img");
      iconImg.classList.add("icon");
      iconImg.src = item.icon;
      iconImg.alt = `${item.title} icon`;
      iconDiv.appendChild(iconImg);

      // Insertamos el contenedor de icono en el enlace
      link.appendChild(iconDiv);
    }

    // Añadimos un contenedor para el texto
    const textDiv = document.createElement("div");
    textDiv.classList.add("menu-text");
    textDiv.textContent = item.title;
    link.appendChild(textDiv);

    // Añadimos acción si existe
    if (typeof item.action === 'function') {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        item.action();
      });
    }
  };

  // Creamos elementos de menú para el primer grupo
  menuItems.forEach(item => {
    createMenuItem(item, ul);
  });

  // Creamos elementos de menú para el segundo grupo
  menuItemsII.forEach(item => {
    createMenuItem(item, ulII);
  });
};
