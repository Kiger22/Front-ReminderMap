export const toggletheme = (node) => {
  const switchButton = document.querySelector("#switch");
  const circle = document.querySelector("#circle");

  if (node.classList.contains("dark")) {
    // Cambiar a modo claro
    node.classList.remove("dark");
    switchButton.classList.remove("switched");
    circle.classList.remove("on");

    // Guardar preferencia en localStorage
    localStorage.setItem("theme", "light");
  } else {
    // Cambiar a modo oscuro
    node.classList.add("dark");
    switchButton.classList.add("switched");
    circle.classList.add("on");

    // Guardar preferencia en localStorage
    localStorage.setItem("theme", "dark");
  }
}

// Función para cargar el tema guardado
export const loadSavedTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  const body = document.querySelector("body");
  const switchButton = document.querySelector("#switch");
  const circle = document.querySelector("#circle");

  if (savedTheme === "dark") {
    body.classList.add("dark");
    if (switchButton) switchButton.classList.add("switched");
    if (circle) circle.classList.add("on");
  }
}
