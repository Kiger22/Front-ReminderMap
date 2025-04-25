import { api } from '../../api/api';
import { AlertNotification } from '../../components/AlertNotification/notification';

export const showCategoryDetails = async (categoryId) => {
  try {

    // Realizamos la solicitud a la API para obtener los detalles de la categoría
    const response = await api({
      endpoint: `/categories/${categoryId}`,
      method: 'GET'
    });

    // Verificamos que la respuesta sea correcta
    if (!response.category) {
      throw new Error('Formato de respuesta inválido');
    }

    const category = response.category;

    // Creamos el contenido para el modal
    const modalContent = document.createElement('div');
    modalContent.classList.add('category-details');

    const title = document.createElement('h3');
    title.textContent = category.name;
    modalContent.appendChild(title);

    const description = document.createElement('p');
    description.textContent = category.description || 'Sin descripción';
    modalContent.appendChild(description);

    const stats = document.createElement('div');
    stats.classList.add('category-stats');

    // Corregimos el acceso al array de places
    stats.textContent = `Lugares asociados: ${category.places?.length || 0}`;
    modalContent.appendChild(stats);

    // Si hay lugares, los mostramos
    if (category.places && category.places.length > 0) {
      const placesList = document.createElement('div');
      placesList.classList.add('places-list');

      const placesTitle = document.createElement('h4');
      placesTitle.textContent = 'Lugares en esta categoría:';
      placesList.appendChild(placesTitle);

      const ul = document.createElement('ul');
      category.places.forEach(place => {
        const li = document.createElement('li');
        li.textContent = place.name || 'Lugar sin nombre';
        ul.appendChild(li);
      });
      placesList.appendChild(ul);
      modalContent.appendChild(placesList);
    }

    // Mostramos el modal con los detalles
    AlertNotification(
      'Detalles de la Categoría',
      modalContent
    );

    console.log('Detalles de categoría mostrados:', category);

  } catch (error) {
    console.error('Error al obtener detalles de la categoría:', error);
    AlertNotification(
      'Error',
      'No se pudieron obtener los detalles de la categoría'
    );
  }
};
