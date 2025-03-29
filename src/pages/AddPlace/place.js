import { addPlace } from '../../functions/addPlace';
import { getCategories } from '../../functions/getCategory';
import { verifyLabels } from '../../functions/verifyLabels';
import { favoritesPlacesPage } from '../FavoritesPlaces/favoritesPlaces';
import { insertMap } from '../../components/Map/insertMap';
import { createButton } from "../../components/Button/button";

import('./place.css');

// Definimos la función createField antes de usarla
const createField = (labelText, inputType, inputId, inputName, isRequired = false, options = null) => {
  const span = document.createElement('span');
  span.classList.add('input-span');

  const label = document.createElement('label');
  label.setAttribute('for', inputId);
  label.textContent = labelText;
  span.appendChild(label);

  if (inputType === 'select' && options) {
    const select = document.createElement('select');
    select.id = inputId;
    select.name = inputName;
    if (isRequired) select.required = true;

    // Opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Seleccione una categoría --';
    select.appendChild(defaultOption);

    // Agregamos las opciones de categorías
    options.forEach(category => {
      const option = document.createElement('option');
      option.value = category.value; // Usando el value definido en getCategories
      option.textContent = category.label; // Usando el label definido en getCategories
      select.appendChild(option);
    });

    span.appendChild(select);
  } else {
    const input = document.createElement('input');
    input.type = inputType;
    input.id = inputId;
    input.name = inputName;
    if (isRequired) input.required = true;
    span.appendChild(input);
  }

  return span;
};

export const placePage = async (node, fromReminder = false) => {
  console.log('placePage called with fromReminder:', fromReminder);

  // Limpiamos el contenido existente
  const existingContent = node.querySelector('.place-form, .reminder-form');
  if (existingContent) {
    existingContent.remove();
  }

  node.innerHTML = '';

  const placeForm = document.createElement('div');
  placeForm.classList.add('place-form');

  const title = document.createElement('h2');
  title.textContent = 'Agrega tus sitios frecuentes para poder utilizarlos mejor...';
  placeForm.appendChild(title);

  const placeContainer = document.createElement('form');
  placeContainer.classList.add('place-container');
  placeContainer.dataset.fromReminder = fromReminder;

  // Creamos sección del formulario
  const formSection = document.createElement('div');
  formSection.classList.add('form-section');

  // Creamos sección del mapa
  const mapSection = document.createElement('div');
  mapSection.classList.add('map-section');

  // Título para la sección del mapa
  const mapTitle = document.createElement('h3');
  mapTitle.textContent = 'Selecciona la ubicación en el mapa ... ↓↓↓';
  mapSection.appendChild(mapTitle);

  // Contenedor del mapa
  const mapContainer = document.createElement('div');
  mapContainer.classList.add('place-form__map-container');

  // Creamos fields-wrapper
  const fieldsWrapper = document.createElement('div');
  fieldsWrapper.classList.add('fields-wrapper');

  // Definimos los campos restantes
  const fields = [
    {
      label: 'Nombre del lugar',
      type: 'text',
      id: 'place-name',
      name: 'name',
      required: true
    },
    {
      label: 'Categoría',
      type: 'select',
      id: 'place-category',
      name: 'category',
      required: true
    },
    {
      label: 'Descripción',
      type: 'text',
      id: 'place-description',
      name: 'description',
      required: false
    }
  ];

  // Obtenemos las categorías antes de crear los campos
  const userId = localStorage.getItem('userId');
  const categories = await getCategories(userId);
  console.log('Categorías cargadas:', categories);

  // Creamos los campos del formulario
  fields.forEach(field => {
    const fieldElement = createField(
      field.label,
      field.type,
      field.id,
      field.name,
      field.required,
      field.type === 'select' ? categories : null
    );
    fieldsWrapper.appendChild(fieldElement);
  });

  // Agregamos el campo de ubicación al final
  const locationSpan = document.createElement('span');
  locationSpan.classList.add('input-span');

  const locationLabel = document.createElement('label');
  locationLabel.textContent = 'Ubicación';
  locationLabel.setAttribute('for', 'location');

  const locationInputContainer = document.createElement('div');
  locationInputContainer.classList.add('location-input-container');

  const locationInput = document.createElement('input');
  locationInput.type = 'text';
  locationInput.id = 'location';
  locationInput.name = 'location';
  locationInput.required = true;
  locationInput.placeholder = 'Ingresa una ubicación';

  const searchButton = document.createElement('button');
  searchButton.type = 'button';
  searchButton.classList.add('location-search-button');
  searchButton.innerHTML = `
    <img src="/assets/search-svgrepo-com.svg" alt="Buscar" class="search-icon">
  `;

  locationInputContainer.appendChild(locationInput);
  locationInputContainer.appendChild(searchButton);
  locationSpan.appendChild(locationLabel);
  locationSpan.appendChild(locationInputContainer);
  fieldsWrapper.appendChild(locationSpan);

  // Agregamos fields-wrapper a form-section
  formSection.appendChild(fieldsWrapper);

  // Insertamos el mapa
  const defaultLocation = "Madrid, España";
  const mapInstance = insertMap(mapContainer, null, {
    selectable: true,
    location: defaultLocation,
    onLocationSelect: (location) => {
      locationInput.value = location;
    }
  });

  // Configuramos los event listeners para la búsqueda
  searchButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
      mapInstance.updateLocation(location);
    }
  });

  // Agregamos un evento para buscar también al presionar Enter en el input
  locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const location = locationInput.value;
      if (location) {
        mapInstance.updateLocation(location);
      }
    }
  });

  // Creamos contenedor para los botones
  const divButtons = document.createElement('div');
  divButtons.classList.add('buttons');

  // Creamos botón de submit
  createButton(divButtons, 'Guardar Lugar', 'submit-button', async (e) => {
    e.preventDefault();
    const success = await addPlace(fromReminder);
    if (!success) {
      console.error('Error al guardar el lugar');
    }
  });

  // Creamos botón de reset
  createButton(divButtons, 'Limpiar', 'reset-button', (e) => {
    e.preventDefault();
    placeContainer.reset();
  });

  // Creamos botón de cancelar
  createButton(divButtons, 'Cancelar', 'cancel-button', (e) => {
    e.preventDefault();
    placeForm.remove();
    if (fromReminder && existingReminderForm) {
      existingReminderForm.style.display = 'flex';
    } else {
      const heroContainer = document.querySelector('.hero-container');
      if (heroContainer) {
        favoritesPlacesPage(heroContainer);
      }
    }
  });

  // Añadimos el contenedor de botones al formSection
  formSection.appendChild(divButtons);

  mapSection.appendChild(mapContainer);

  // Agregamos las secciones al contenedor principal
  placeContainer.appendChild(formSection);
  placeContainer.appendChild(mapSection);

  // Agregamos el contenedor al formulario
  placeForm.appendChild(placeContainer);
  node.appendChild(placeForm);

  verifyLabels();
};


