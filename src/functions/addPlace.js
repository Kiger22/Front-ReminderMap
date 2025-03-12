import { api } from "../api/api";
import { AlertNotification } from "../components/AlertNotification/notification";
import { goToHomePage } from "./goHomePage";

export const addPlace = async () => {
  try {

    // Obtenemos el ID del usuario
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');
    console.log('userID', userId, 'Token de autenticación:', authToken);

    // Validamos que haya un ID de usuario
    if (!userId) {
      throw new Error('No hay ID de usuario');
    }

    // Validamos que el formato de userId sea un ObjectID válido
    const isValidObjectId = /^[a-f\d]{24}$/i.test(userId);
    if (!isValidObjectId) {
      throw new Error('El ID de usuario no tiene un formato válido de ObjectID');
    }

    // Validamos que haya un token de autenticación
    if (!authToken) {
      throw new Error('No hay token de autenticación');
    }

    // Obtenemos los datos del formulario
    const placeName = document.getElementById("place-name").value;
    const placeCategory = document.getElementById("place-category").value;
    const placeDescription = document.getElementById("place-description").value;
    const placeLocation = document.getElementById("location").value;

    // Validamos que los datos no estén vacíos
    if (!placeName || !placeCategory || !placeDescription || !placeLocation) {
      throw new Error('Todos los campos son obligatorios');
    }

    const placeBody = {
      name: placeName,
      category: placeCategory,
      description: placeDescription,
      location: placeLocation,
    };
    console.log('Datos del formulario:', placeBody);

    // Llama a la API para crear el lugar
    const response = await api({
      endpoint: '/places',
      method: 'POST',
      body: placeBody,
    });
    console.log('Respuesta de la API:', response);

    // Validamos la respuesta de la API
    if (response) {
      console.log('Lugar creado:', response);
      AlertNotification('Lugar creado', 'El lugar se ha creado correctamente', () => {
        // Limpiamos los campos del formulario
        document.getElementById("place-name").value = '';
        document.getElementById("place-category").value = '';
        document.getElementById("place-description").value = '';
        document.getElementById("location").value = '';
      }, false);
    }

  }
  catch (error) {
    console.error('Error al crear el lugar:', error);
    AlertNotification('Error al crear el lugar', error.message, () => { });
  }
};