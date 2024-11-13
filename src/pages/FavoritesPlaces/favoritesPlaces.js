import('./favoritesPlaces.css');

export const favoritesPlacesPage = (node) => {
  node.innerHTML = "";

  const placesContainer = document.createElement('div');
  placesContainer.classList.add('places-container');

  const header = document.createElement('h2');
  header.textContent = "Mis Sitios Favoritos";

  const content = document.createElement('p');
  content.textContent = "Lista de tus lugares Favoritos.";

  placesContainer.appendChild(header);
  placesContainer.appendChild(content);

  node.appendChild(placesContainer);
};
