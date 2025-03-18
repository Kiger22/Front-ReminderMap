import { api } from '../api/api';
import { AlertNotification } from '../components/AlertNotification/notification';
import { closeSettingsForm } from '../components/SettingForm/settingsForm';

export const updateUserProfile = async (formData) => {
  try {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');

    const response = await api({
      endpoint: `users/${userId}`,
      method: 'PUT',
      body: formData,
      token: token,
      isFormData: true // Añadimos esta bandera para manejar FormData correctamente
    });

    if (response.success) {
      // Actualizamos localStorage con los nuevos datos
      const userData = response.user;
      localStorage.setItem('name', userData.name || '');
      localStorage.setItem('email', userData.email || '');
      localStorage.setItem('avatar', userData.avatar || '');
      localStorage.setItem('myHouseLocation', userData.myHouseLocation || '');
      localStorage.setItem('myWorkLocation', userData.myWorkLocation || '');

      // Actualizamos la UI
      updateUIElements(userData);

      AlertNotification('Éxito', 'Datos actualizados correctamente');
      closeSettingsForm();
      return true;
    } else {
      throw new Error(response.message || 'Error al actualizar el perfil');
    }
  } catch (error) {
    console.error('Error al actualizar:', error);
    AlertNotification('Error', 'No se pudieron actualizar los datos');
    return false;
  }
};

// Función auxiliar para actualizar elementos de la UI
const updateUIElements = (userData) => {
  // Actualizar el título del header
  const titleHeader = document.getElementById('title-header');
  if (titleHeader && userData.name) {
    titleHeader.textContent = `¡Bienvenido, ${userData.name}!`;
  }

  // Actualizar el avatar en el header
  if (userData.avatar) {
    const userHeaderContainer = document.getElementById('user-header');
    if (userHeaderContainer) {
      const avatarImg = userHeaderContainer.querySelector('.avatar-img-header');
      if (avatarImg) {
        avatarImg.src = userData.avatar;
      }
    }
  }
};
