//* Gestionamos las transiciones entre páginas

export const pageTransition = async (currentPage, newPageFunction) => {
  // Añadimos animación de salida
  currentPage.classList.add('fade-out');

  // Esperamos a que termine la animación
  await new Promise(resolve => setTimeout(resolve, 300));

  // Limpiamos el contenido actual
  currentPage.innerHTML = '';

  // Renderizamos la nueva página
  newPageFunction();

  // Añadimos animación de entrada
  currentPage.classList.add('page-transition');

  // Limpiamos las clases de animación
  setTimeout(() => {
    currentPage.classList.remove('fade-out', 'page-transition');
  }, 300);
};