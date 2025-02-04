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
      `
  node.append(button);
  button.addEventListener("click", onClick);
};


