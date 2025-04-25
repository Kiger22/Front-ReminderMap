//* Función para cambiar el tema de la página
export const toggletheme = (node) => {
  try {

    // Seleccionar elementos necesarios
    const switchButton = document.querySelector("#switch");
    const circle = document.querySelector("#circle");
    const appDiv = document.querySelector("#app");
    const headerLogo = document.querySelector(".header-logo img");

    // Forzamos actualización de estilos
    document.documentElement.style.setProperty('--force-repaint', 'true');

    if (node.classList.contains("dark")) {

      // Cambiamos a modo oscuro 
      node.classList.remove("dark");
      if (switchButton) switchButton.classList.remove("switched");
      if (circle) circle.classList.remove("on");

      // Quitamos filtro para que el logo se vea normal
      if (headerLogo) headerLogo.style.filter = "none";

      // Actualizamos todos los elementos con clase app-element
      document.querySelectorAll('.app-element').forEach(el => {
        el.style.color = 'var(--kg-text-dark-mode)';
      });

      // Guardamos preferencia en localStorage
      localStorage.setItem("theme", "dark");
    } else {
      // Cambiamos a modo claro (añadiendo la clase dark)
      node.classList.add("dark");
      if (switchButton) switchButton.classList.add("switched");
      if (circle) circle.classList.add("on");

      // Aplicamos filtro para que el logo se vea negro
      if (headerLogo) headerLogo.style.filter = "brightness(0)";

      // Actualizamos todos los elementos con clase app-element
      document.querySelectorAll('.app-element').forEach(el => {
        el.style.color = 'var(--kg-text-light-mode)';
      });

      // Guardamos preferencia en localStorage
      localStorage.setItem("theme", "light");
    }

    // Forzamos repintado del div app
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

//* Función para cargar el tema guardado
export const loadSavedTheme = () => {
  try {
    // Cargamos el tema guardado
    const savedTheme = localStorage.getItem("theme");
    const body = document.querySelector("body");
    const switchButton = document.querySelector("#switch");
    const circle = document.querySelector("#circle");
    const appDiv = document.querySelector("#app");

    // Aplicamos el tema guardado
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
