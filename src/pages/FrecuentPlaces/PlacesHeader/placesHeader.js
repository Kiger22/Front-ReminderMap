import('./placesHeader.css');

export const createPlacesHeader = () => {
  // Header fijo
  const placesHeader = document.createElement('div');
  placesHeader.classList.add('places-header');

  const header = document.createElement('h2');
  header.textContent = "Lugares Frecuentes";

  const content = document.createElement('p');
  content.textContent = "Lugares ordenados por frecuencia de uso.";

  placesHeader.appendChild(header);
  placesHeader.appendChild(content);

  return placesHeader;
};