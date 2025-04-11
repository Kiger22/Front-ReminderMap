/**
 * Crea un campo de formulario con etiqueta y entrada
 * @param {string} labelText - Texto de la etiqueta
 * @param {string} inputType - Tipo de entrada (text, select, date, etc.)
 * @param {string} inputId - ID del elemento de entrada
 * @param {string} inputName - Nombre del elemento de entrada
 * @param {boolean} isRequired - Si el campo es obligatorio
 * @param {Array} options - Opciones para campos select
 * @param {string} defaultValue - Valor predeterminado para el campo
 * @returns {HTMLElement} - Elemento span que contiene la etiqueta y la entrada
 */
export const createField = (labelText, inputType, inputId, inputName, isRequired = false, options = null, defaultValue = '') => {
  const span = document.createElement('span');
  span.classList.add('input-span');

  const label = document.createElement('label');
  label.setAttribute('for', inputId);
  label.textContent = labelText;
  span.appendChild(label);

  if (inputType === 'select') {
    const select = document.createElement('select');
    select.id = inputId;
    select.name = inputName;
    if (isRequired) select.required = true;

    // Opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Seleccione una opción --';
    select.appendChild(defaultOption);

    // Verificamos si hay opciones disponibles
    if (options && Array.isArray(options) && options.length > 0) {
      console.log(`Agregando ${options.length} opciones al select ${inputId}`);

      // Agregamos las opciones
      options.forEach(option => {
        // Verificamos si la opción tiene la estructura correcta
        if (!option) {
          console.warn('Opción inválida:', option);
          return;
        }

        const optionElement = document.createElement('option');

        // Adaptamos para manejar tanto el formato {value, label} como {_id, name, location}
        if (option.value && option.label) {
          // Formato {value, label}
          optionElement.value = option.value;
          optionElement.textContent = option.label;
        } else if (option._id) {
          // Formato {_id, name, location}
          optionElement.value = option.location || option._id;
          optionElement.textContent = option.name || option._id;
        } else {
          console.warn('Opción con formato desconocido:', option);
          return;
        }

        if (defaultValue && (optionElement.value === defaultValue || option._id === defaultValue)) {
          optionElement.selected = true;
        }

        select.appendChild(optionElement);
      });
    } else {
      console.warn(`No hay opciones disponibles para el select ${inputId}`);

      // Opción de "No hay categorías disponibles"
      const noOptionsElement = document.createElement('option');
      noOptionsElement.value = '';
      noOptionsElement.textContent = 'No hay opciones disponibles';
      noOptionsElement.disabled = true;
      select.appendChild(noOptionsElement);
    }

    span.appendChild(select);
  } else {
    const input = document.createElement('input');
    input.type = inputType;
    input.id = inputId;
    input.name = inputName;
    if (isRequired) input.required = true;
    if (defaultValue) input.value = defaultValue;
    span.appendChild(input);
  }

  return span;
};


