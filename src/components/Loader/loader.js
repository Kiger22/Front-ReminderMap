import("./loader.css");

export const createLoader = (node) => {
  // Contenedor del loader
  const loaderDiv = document.createElement('div');
  loaderDiv.className = 'loader';

  // Div interno
  const innerDiv = document.createElement('div');
  innerDiv.className = 'primary-loading';
  loaderDiv.appendChild(innerDiv);

  node.appendChild(loaderDiv);
};