export const toggletheme = (node) => {
  try {
    const switchButton = document.querySelector("#switch");
    const circle = document.querySelector("#circle");
    const appDiv = document.querySelector("#app");
    const headerLogo = document.querySelector(".header-logo img");

    // Forzar actualización de estilos
    document.documentElement.style.setProperty('--force-repaint', 'true');

    if (node.classList.contains("dark")) {
      // Cambiar a modo oscuro (quitando la clase dark)
      node.classList.remove("dark");
      if (switchButton) switchButton.classList.remove("switched");
      if (circle) circle.classList.remove("on");

      // Quitar filtro para que el logo se vea normal (claro)
      if (headerLogo) headerLogo.style.filter = "none";

      // Actualizar todos los elementos con clase app-element
      document.querySelectorAll('.app-element').forEach(el => {
        el.style.color = 'var(--kg-text-dark-mode)';
      });

      // Guardar preferencia en localStorage
      localStorage.setItem("theme", "dark");
    } else {
      // Cambiar a modo claro (añadiendo la clase dark)
      node.classList.add("dark");
      if (switchButton) switchButton.classList.add("switched");
      if (circle) circle.classList.add("on");

      // Aplicar filtro para que el logo se vea negro
      if (headerLogo) headerLogo.style.filter = "brightness(0)";

      // Actualizar todos los elementos con clase app-element
      document.querySelectorAll('.app-element').forEach(el => {
        el.style.color = 'var(--kg-text-light-mode)';
      });

      // Guardar preferencia en localStorage
      localStorage.setItem("theme", "light");
    }

    // Forzar repintado del div app
    if (appDiv) {
      appDiv.style.display = 'none';
      setTimeout(() => {
        appDiv.style.display = '';
      }, 5);
    }

    return false;
  } catch (error) {
    console.error("Error al cambiar el tema:", error);
    return false;
  }
}

// Función para cargar el tema guardado
export const loadSavedTheme = () => {
  try {
    const savedTheme = localStorage.getItem("theme");
    const body = document.querySelector("body");
    const switchButton = document.querySelector("#switch");
    const circle = document.querySelector("#circle");
    const appDiv = document.querySelector("#app");

    if (savedTheme === "light") {
      if (body) body.classList.add("dark");
      if (switchButton) switchButton.classList.add("switched");
      if (circle) circle.classList.add("on");
      if (appDiv) appDiv.setAttribute("data-theme", "light");
    } else {
      if (appDiv) appDiv.setAttribute("data-theme", "dark");
    }

    return false;
  } catch (error) {
    console.error("Error al cargar el tema guardado:", error);
    return false;
  }
}
