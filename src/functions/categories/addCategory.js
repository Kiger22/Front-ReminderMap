import { api } from "../../api/api";
import { AlertNotification } from "../../components/AlertNotification/notification";
import { goToHomePage } from "../navigation/goHomePage";

export const addCategory = async () => {
  try {
    const categoryName = document.getElementById('category-name').value;
    const categoryDescription = document.getElementById('category-description').value;
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');

    if (!categoryName || !userId || !authToken) {
      console.error('Faltan datos para crear la categoría');
      return false;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        name: categoryName,  // Cambiado de 'label' a 'name' para coincidir con el backend
        description: categoryDescription,
        userId
      })
    });

    if (!response.ok) {
      throw new Error(`Error al crear categoría: ${response.status}`);
    }

    const data = await response.json();
    console.log('Categoría creada:', data);

    // Guardamos el ID de la categoría recién creada para seleccionarla al volver
    if (data && data.category && data.category._id) {
      localStorage.setItem('lastCreatedCategoryId', data.category._id);
      localStorage.setItem('lastCreatedCategoryName', categoryName);
    }

    return true;
  } catch (error) {
    console.error('Error al crear categoría:', error);
    return false;
  }
};
