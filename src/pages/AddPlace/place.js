import { addPlace } from '../../functions/places/addPlace';
import { getCategories } from '../../functions/categories/getCategory';
import { verifyLabels } from '../../functions/navigation/verifyLabels';
import { frequentPlacesPage } from '../FrecuentPlaces/frequentPlaces';
import { insertMap } from '../../components/Map/insertMap';
import { createButton } from "../../components/Button/button";
import { createField } from "../../utils/formUtils";

import('./place.css');

export const placePage = async (node, fromReminder = false) => {
  console.log('placePage called with fromReminder:', fromReminder);

  // Limpiamos el contenido existente
  const existingContent = node.querySelector('.place-form, .reminder-form');
  if (existingContent) {
    existingContent.remove();
  }
  node.innerHTML = '';

  // Definimos los campos del formulario
  const fields = [
    { label: 'Nombre del lugar', type: 'text', id: 'place-name', name: 'name', required: true },
    { label: 'Descripción', type: 'textarea', id: 'place-description', name: 'description', required: false },
    { label: 'Categoría', type: 'select', id: 'place-category', name: 'category', required: false }
  ];

  // Creamos el formulario
  const placeForm = document.createElement('div');
  placeForm.classList.add('place-form');

  // Agregamos el título
  const title = document.createElement('h2');
  title.textContent = 'Agrega tus sitios frecuentes para poder utilizarlos mejor...';
  placeForm.appendChild(title);

  // Creamos el contenedor principal
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

  // Añadimos fields-wrapper a form-section
  formSection.appendChild(fieldsWrapper);

  // Obtenemos las categorías antes de crear los campos
  const userId = localStorage.getItem('userId');
  const authToken = localStorage.getItem('authToken');

  console.log('Datos de autenticación para categorías:', {
    userId,
    authTokenPresente: !!authToken
  });

  if (!userId || !authToken) {
    console.warn('Falta información de autenticación para cargar categorías');
  }

  try {
    const categories = await getCategories(userId);
    console.log('Categorías cargadas:', categories);

    // Verificamos si solo existe la categoría "Desconocida" o no hay categorías
    const onlyUnknownCategory = categories.length === 1 && categories[0].label === "Desconocida";
    const noCategories = categories.length === 0 || onlyUnknownCategory;

    // Si no hay categorías o solo está la categoría "Desconocida", mostrar mensaje
    if (noCategories) {
      const noCategoriesMessage = document.createElement('div');
      noCategoriesMessage.classList.add('no-categories-message');
      noCategoriesMessage.innerHTML = `
        <p>No hay categorías personalizadas disponibles. Puedes crear un lugar sin categoría o crear una categoría primero.</p>
        <button id="create-category-button" class="secondary-button">Crear Categoría</button>
      `;

      // Añadimos el mensaje al principio del contenedor principal
      placeContainer.prepend(noCategoriesMessage);

      // Configuramos el event listener para el botón
      setTimeout(() => {
        const createCategoryButton = document.getElementById('create-category-button');
        if (createCategoryButton) {
          createCategoryButton.addEventListener('click', () => {
            import('../AddCategory/category.js').then(module => {
              const { categoryPage } = module;
              categoryPage(node);
            });
          });
        }
      }, 0);
    }

    // Creamos los campos del formulario (siempre, haya o no categorías)
    fields.forEach(field => {
      // Si es el campo de categoría y no hay categorías personalizadas, mostramos mensaje
      if (field.type === 'select' && field.name === 'category' && noCategories) {
        const fieldElement = createField(
          field.label,
          'text',
          field.id,
          field.name,
          field.required,
          null
        );
        const input = fieldElement.querySelector('input');
        if (input) {
          input.value = 'Sin categorías personalizadas';
          input.disabled = true;
        }
        fieldsWrapper.appendChild(fieldElement);
      } else {
        const fieldElement = createField(
          field.label,
          field.type,
          field.id,
          field.name,
          field.required,
          field.type === 'select' ? categories : null
        );
        fieldsWrapper.appendChild(fieldElement);
      }
    });
  } catch (error) {
    console.error('Error al cargar categorías:', error);

    // Mostrar mensaje de error pero continuar con el formulario
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    errorMessage.innerHTML = `
      <p>Error al cargar categorías. Puedes crear un lugar sin categoría o intentar crear una categoría.</p>
      <button id="create-category-button" class="secondary-button">Crear Categoría</button>
    `;

    // Añadimos el mensaje al principio del contenedor principal
    placeContainer.prepend(errorMessage);

    // Creamos los campos del formulario a pesar del error
    fields.forEach(field => {
      // Si es el campo de categoría, creamos un campo de texto deshabilitado
      if (field.type === 'select' && field.name === 'category') {
        const fieldElement = createField(
          field.label,
          'text',
          field.id,
          field.name,
          field.required,
          null
        );
        const input = fieldElement.querySelector('input');
        if (input) {
          input.value = 'Error al cargar categorías';
          input.disabled = true;
        }
        fieldsWrapper.appendChild(fieldElement);
      } else {
        const fieldElement = createField(
          field.label,
          field.type,
          field.id,
          field.name,
          field.required,
          null
        );
        fieldsWrapper.appendChild(fieldElement);
      }
    });

    // Agregamos el event listener para el botón de crear categoría
    setTimeout(() => {
      const createCategoryButton = document.getElementById('create-category-button');
      if (createCategoryButton) {
        createCategoryButton.addEventListener('click', () => {
          import('../AddCategory/category.js').then(module => {
            const { categoryPage } = module;
            categoryPage(node);
          });
        });
      }
    }, 0);
  }

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
  createButton(divButtons, 'Cancelar', 'cancel-button', async () => {
    if (fromReminder) {
      // Si venimos del formulario de recordatorio, volvemos a él
      const { reminderPageForm } = await import('../AddReminder/reminder.js');
      await reminderPageForm(node);

      // Restauramos los datos temporales si existen
      const tempData = localStorage.getItem('tempReminderData');
      if (tempData) {
        const data = JSON.parse(tempData);
        const nameInput = document.getElementById('reminder-name');
        const descriptionInput = document.getElementById('reminder-description');
        const dateInput = document.getElementById('reminder-date');
        const timeInput = document.getElementById('reminder-time');

        if (nameInput && data.name) nameInput.value = data.name;
        if (descriptionInput && data.description) descriptionInput.value = data.description;
        if (dateInput && data.date) dateInput.value = data.date;
        if (timeInput && data.time) timeInput.value = data.time;

        // Limpiamos los datos temporales
        localStorage.removeItem('tempReminderData');
      }
    } else {
      // Si no venimos del formulario de recordatorio, volvemos a la página principal
      const heroContainer = document.querySelector('.hero-container');
      if (heroContainer) {
        frequentPlacesPage(heroContainer);
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


