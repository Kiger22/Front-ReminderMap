import { insertMap } from '../Map/insertMap';
import './mapModal.css';

export const createMapModal = (location, placeName) => {
  // Crear el contenedor del modal
  const modalOverlay = document.createElement('div');
  modalOverlay.classList.add('map-modal-overlay');
  
  // Crear el contenido del modal
  const modalContent = document.createElement('div');
  modalContent.classList.add('map-modal-content');
  
  // Crear la cabecera del modal
  const modalHeader = document.createElement('div');
  modalHeader.classList.add('map-modal-header');
  
  // Título del modal
  const modalTitle = document.createElement('h3');
  modalTitle.textContent = placeName || 'Ver ubicación';
  modalHeader.appendChild(modalTitle);
  
  // Botón para cerrar
  const closeButton = document.createElement('button');
  closeButton.classList.add('map-modal-close');
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', () => {
    document.body.removeChild(modalOverlay);
  });
  modalHeader.appendChild(closeButton);
  
  // Contenedor para el mapa
  const mapContainer = document.createElement('div');
  mapContainer.classList.add('map-modal-map-container');
  mapContainer.id = 'modal-map-container';
  
  // Añadir elementos al modal
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(mapContainer);
  modalOverlay.appendChild(modalContent);
  
  // Añadir el modal al body
  document.body.appendChild(modalOverlay);
  
  // Insertar el mapa en el contenedor
  insertMap(mapContainer, null, {
    location: location,
    isBackground: false
  });
  
  // Cerrar el modal al hacer clic fuera del contenido
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      document.body.removeChild(modalOverlay);
    }
  });
  
  // Cerrar el modal con la tecla Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.body.contains(modalOverlay)) {
      document.body.removeChild(modalOverlay);
    }
  });
};