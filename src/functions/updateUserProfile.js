import { api } from '../api/api';
import { AlertNotification } from '../components/AlertNotification/notification';
import { closeSettingsForm } from '../components/SettingForm/settingsForm';
import { createUserHeader } from '../components/UserHeader/userHeader';

export const updateUserProfile = async (formData, openSettingsCallback) => {
  const DEFAULT_AVATAR_PATH = './assets/user-circle-svgrepo-com.svg';

  try {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');

    if (!token) {
      AlertNotification('Error', 'Sesión expirada. Por favor, inicie sesión nuevamente');
      return false;
    }

    // Si no hay avatar en el formData, añadimos el avatar por defecto
    if (!formData.has('avatar')) {
      const currentAvatar = localStorage.getItem('avatar') || DEFAULT_AVATAR_PATH;
      formData.append('avatar', currentAvatar);
    }

    const response = await api({
      endpoint: `users/${userId}`,
      method: 'PUT',
      body: formData,
      token: token,
      isFormData: true
    });

    if (response.success) {
      // Actualizamos localStorage con los nuevos datos
      const userData = response.user;
      localStorage.setItem('name', userData.name || '');
      localStorage.setItem('email', userData.email || '');
      localStorage.setItem('avatar', userData.avatar || DEFAULT_AVATAR_PATH);
      localStorage.setItem('myHouseLocation', userData.myHouseLocation || '');
      localStorage.setItem('myWorkLocation', userData.myWorkLocation || '');

      // Actualizamos la UI
      updateUIElements({
        ...userData,
        avatar: userData.avatar || DEFAULT_AVATAR_PATH
      });

      // Actualizamos el header específicamente
      const userHeaderContainer = document.getElementById('user-header');
      if (userHeaderContainer) {
        userHeaderContainer.innerHTML = ''; // Limpiamos el contenido actual
        createUserHeader(
          userHeaderContainer,
          userData.avatar || DEFAULT_AVATAR_PATH,
          './assets/setting-1-svgrepo-com.svg',
          openSettingsCallback
        );
      }

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
  const userHeaderContainer = document.getElementById('user-header');
  if (userHeaderContainer) {
    const avatarImg = userHeaderContainer.querySelector('.avatar-img-header');
    if (avatarImg) {
      avatarImg.src = userData.avatar || DEFAULT_AVATAR_PATH;
    }
  }
};






