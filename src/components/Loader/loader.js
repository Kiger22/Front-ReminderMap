import("./loader.css");

export const createLoader = (node) => {
  // Contenedor del loader
  const loaderDiv = document.createElement('div');
  loaderDiv.className = 'loader';

  // Div interno
  const innerDiv = document.createElement('div');
  innerDiv.className = 'primary-loading';
  loaderDiv.appendChild(innerDiv);

  // Establecemos un timeout para asegurar que el loader esté visible al menos 1 segundos
  setTimeout(() => {
    loaderDiv.remove();
  }, 2000);

  node.appendChild(loaderDiv);
};