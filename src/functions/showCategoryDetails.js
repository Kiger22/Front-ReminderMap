import { api } from '../api/api';
import { AlertNotification } from '../components/AlertNotification/notification';

export const showCategoryDetails = async (categoryId) => {
  try {
    const response = await api({
      endpoint: `/categories/${categoryId}`,
      method: 'GET'
    });

    const category = response;

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
    stats.textContent = `Lugares asociados: ${category.place?.length || 0}`;
    modalContent.appendChild(stats);

    // Mostramos el modal con los detalles
    AlertNotification(
      'Detalles de la Categoría',
      modalContent
    );
  } catch (error) {
    console.error('Error al obtener detalles de la categoría:', error);
    AlertNotification(
      'Error',
      'No se pudieron obtener los detalles de la categoría'
    );
  }
};
