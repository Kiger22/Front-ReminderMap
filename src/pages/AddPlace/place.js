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

  // Verificamos si faltan datos de autenticación
  if (!userId || !authToken) {
    console.warn('Falta información de autenticación para cargar categorías');
  }

  // Intentamos obtener las categorías
  try {
    const categories = await getCategories(userId);
    console.log('Categorías cargadas:', categories);

    // Verificamos si solo existe la categoría "Desconocida" o no hay categorías
    const onlyUnknownCategory = categories.length === 1 && categories[0].label === "Desconocida";
    const noCategories = categories.length === 0 || onlyUnknownCategory;

    // Creamos los campos del formulario (siempre, haya o no categorías)
    fields.forEach(field => {
      // Si es el campo de categoría y no hay categorías personalizadas, mostramos input con botón
      if (field.type === 'select' && field.name === 'category' && noCategories) {
        const fieldElement = createField(
          field.label,
          'text',
          field.id,
          field.name,
          field.required,
          null
        );

        // Obtenemos el input y lo configuramos
        const input = fieldElement.querySelector('input');
        if (input) {
          input.value = 'Sin categorías personalizadas';
          input.disabled = true;

          // Creamos el contenedor para el botón similar al de búsqueda
          const buttonContainer = document.createElement('div');
          buttonContainer.classList.add('category-input-container');

          // Movemos el input al contenedor
          input.parentNode.replaceChild(buttonContainer, input);
          buttonContainer.appendChild(input);

          // Creamos el botón para añadir categoría con estilo similar al de búsqueda
          const addCategoryButton = document.createElement('button');
          addCategoryButton.type = 'button';
          addCategoryButton.id = 'create-category-button';
          addCategoryButton.classList.add('category-add-button');
          addCategoryButton.innerHTML = `
            <img src="/assets/add-plus-svgrepo-com.svg" alt="Añadir" class="add-icon">
          `;

          // Añadimos el event listener al botón
          addCategoryButton.addEventListener('click', () => {
            import('../AddCategory/category.js').then(module => {
              const { categoryPage } = module;
              categoryPage(node);
            });
          });

          // Añadimos el botón al contenedor
          buttonContainer.appendChild(addCategoryButton);
        }

        fieldsWrapper.appendChild(fieldElement);
      } else if (field.type === 'select' && field.name === 'category') {
        // Creamos el campo de categoría con las categorías disponibles
        const fieldElement = createField(
          field.label,
          field.type,
          field.id,
          field.name,
          field.required,
          categories
        );

        // Obtenemos el select
        const select = fieldElement.querySelector('select');
        if (select) {
          // Verificamos si hay una categoría recién creada para seleccionarla
          const lastCreatedCategoryId = localStorage.getItem('lastCreatedCategoryId');
          if (lastCreatedCategoryId) {
            // Buscamos la opción correspondiente y la seleccionamos
            const options = select.options;
            for (let i = 0; i < options.length; i++) {
              if (options[i].value === lastCreatedCategoryId) {
                select.selectedIndex = i;
                break;
              }
            }
            // Limpiamos el localStorage después de usar el valor
            localStorage.removeItem('lastCreatedCategoryId');
            localStorage.removeItem('lastCreatedCategoryName');
          }

          // Creamos el contenedor para el select y el botón
          const selectContainer = document.createElement('div');
          selectContainer.classList.add('category-select-container');

          // Reemplazamos el select con el contenedor
          select.parentNode.replaceChild(selectContainer, select);
          selectContainer.appendChild(select);

          // Creamos el botón para añadir categoría
          const addCategoryButton = document.createElement('button');
          addCategoryButton.type = 'button';
          addCategoryButton.id = 'create-category-button';
          addCategoryButton.classList.add('category-add-button');
          addCategoryButton.innerHTML = `
            <img src="/assets/add-plus-svgrepo-com.svg" alt="Añadir" class="add-icon">
          `;

          // Añadimos el event listener al botón
          addCategoryButton.addEventListener('click', () => {
            // Guardamos los datos del formulario actual en localStorage
            const formData = new FormData(placeContainer);
            const tempPlaceData = {};
            for (const [key, value] of formData.entries()) {
              tempPlaceData[key] = value;
            }
            localStorage.setItem('tempPlaceData', JSON.stringify(tempPlaceData));

            // Navegamos a la página de categorías
            import('../AddCategory/category.js').then(module => {
              const { categoryPage } = module;
              categoryPage(node);
            });
          });

          // Añadimos el botón al contenedor
          selectContainer.appendChild(addCategoryButton);
        }

        fieldsWrapper.appendChild(fieldElement);
      } else {
        // Para los demás campos, los creamos normalmente
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
  } catch (error) {
    console.error('Error al cargar categorías:', error);

    // Creamos los campos del formulario a pesar del error
    fields.forEach(field => {
      // Si es el campo de categoría, creamos un campo de texto deshabilitado con botón
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

          // Creamos el contenedor para el botón similar al de búsqueda
          const buttonContainer = document.createElement('div');
          buttonContainer.classList.add('category-input-container');

          // Movemos el input al contenedor
          input.parentNode.replaceChild(buttonContainer, input);
          buttonContainer.appendChild(input);

          // Creamos el botón para añadir categoría con estilo similar al de búsqueda
          const addCategoryButton = document.createElement('button');
          addCategoryButton.type = 'button';
          addCategoryButton.id = 'create-category-button';
          addCategoryButton.classList.add('category-add-button');
          addCategoryButton.innerHTML = `
            <img src="/assets/add-svgrepo-com.svg" alt="Añadir" class="add-icon">
          `;

          // Añadimos el event listener al botón
          addCategoryButton.addEventListener('click', () => {
            import('../AddCategory/category.js').then(module => {
              const { categoryPage } = module;
              categoryPage(node);
            });
          });

          // Añadimos el botón al contenedor
          buttonContainer.appendChild(addCategoryButton);
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
  }

  // Agregamos el campo de ubicación
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
      console.log('Ubicación seleccionada:', location);
      if (locationInput) {
        locationInput.value = location;
        // Disparar un evento input para activar cualquier listener que pueda estar escuchando cambios
        const inputEvent = new Event('input', { bubbles: true });
        locationInput.dispatchEvent(inputEvent);
      } else {
        console.error('Campo de ubicación no encontrado');
      }
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
    } else if (fromReminder) {
      // Si venimos del formulario de recordatorio y el lugar se guardó correctamente,
      // volvemos al formulario de recordatorio
      const { reminderPageForm } = await import('../AddReminder/reminder.js');
      await reminderPageForm(node);

      // Restauramos los datos temporales si existen
      restoreReminderFormData();
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
      const heroContainer = document.querySelector('.hero-container');
      if (heroContainer) {
        const { reminderPageForm } = await import('../AddReminder/reminder.js');
        await reminderPageForm(heroContainer);

        // Restauramos los datos temporales
        setTimeout(() => {
          const tempData = localStorage.getItem('tempReminderData');
          if (tempData) {
            try {
              const data = JSON.parse(tempData);

              const nameInput = document.getElementById('reminder-name');
              const descriptionInput = document.getElementById('reminder-description');
              const dateInput = document.getElementById('reminder-date');
              const timeInput = document.getElementById('reminder-time');

              if (nameInput && data.name) nameInput.value = data.name;
              if (descriptionInput && data.description) descriptionInput.value = data.description;
              if (dateInput && data.date) dateInput.value = data.date;
              if (timeInput && data.time) timeInput.value = data.time;

              console.log('Datos de recordatorio restaurados correctamente');
            } catch (error) {
              console.error('Error al restaurar datos del recordatorio:', error);
            }
          }
        }, 300);
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

  // Función para restaurar los datos del formulario de recordatorio
  function restoreReminderFormData() {
    // Esperamos un poco para asegurarnos de que el formulario esté renderizado
    setTimeout(() => {
      const tempData = localStorage.getItem('tempReminderData');
      if (tempData) {
        try {
          const data = JSON.parse(tempData);
          console.log('Restaurando datos de recordatorio:', data);

          const nameInput = document.getElementById('reminder-name');
          const descriptionInput = document.getElementById('reminder-description');
          const dateInput = document.getElementById('reminder-date');
          const timeInput = document.getElementById('reminder-time');
          const locationSelect = document.getElementById('reminder-location');

          // Verificamos si los datos tienen menos de 30 minutos (para evitar usar datos muy antiguos)
          const now = new Date().getTime();
          const dataAge = now - (data.timestamp || 0);
          const maxAge = 30 * 60 * 1000; // 30 minutos en milisegundos

          if (dataAge < maxAge) {
            if (nameInput && data.name) nameInput.value = data.name;
            if (descriptionInput && data.description) descriptionInput.value = data.description;
            if (dateInput && data.date) dateInput.value = data.date;
            if (timeInput && data.time) timeInput.value = data.time;

            // Si hay un lugar recién creado, lo seleccionamos en el dropdown
            const newCreatedPlace = localStorage.getItem('newCreatedPlace');
            if (newCreatedPlace && locationSelect) {
              try {
                const placeData = JSON.parse(newCreatedPlace);
                // Buscamos la opción correspondiente al nuevo lugar
                const options = locationSelect.options;
                for (let i = 0; i < options.length; i++) {
                  if (options[i].value === placeData.location ||
                    options[i]._id === placeData._id) {
                    locationSelect.selectedIndex = i;
                    break;
                  }
                }
              } catch (e) {
                console.error('Error al procesar el lugar recién creado:', e);
              }
            }

            console.log('Datos de recordatorio restaurados correctamente');
          } else {
            console.log('Datos de recordatorio demasiado antiguos, no se restaurarán');
          }
        } catch (error) {
          console.error('Error al restaurar datos del recordatorio:', error);
        }
      } else {
        console.log('No hay datos temporales de recordatorio para restaurar');
      }
    }, 300); // Aumentamos el tiempo para asegurar que el DOM esté listo
  }
};


