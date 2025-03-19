import("./buttonPlus.css");

export const ButtonPlus = (node, text) => {
  const caja = document.createElement("div");
  caja.classList.add("caja");
  node.appendChild(caja);

  const button = document.createElement("div");
  button.classList.add("button_plus");
  caja.appendChild(button);

  const span = document.createElement("span");
  span.classList.add("span_plus");
  span.textContent = text;
  caja.appendChild(span);
}
