import { AlertNotification } from "../components/AlertNotification/notification";
import { createLoginForm } from "../components/LoginForm/login";
import { placePage } from "../pages/AddPlace/place";
import { categoryPage } from "../pages/AddPlaceCategory/category";
import { calendarPage } from "../pages/CalendarPage/calendar";
import { favoritesPlacesPage } from "../pages/FavoritesPlaces/favoritesPlaces";
import { remindersPage } from "../pages/RemindersList/remindersList";
import { todayPage } from "../pages/TodayList/today";

export const menuAsideI = [
  //! Hoy
  {
    title: 'Hoy',
    icon: './assets/calendar-today-svgrepo-com.svg',
    link: '#today',
    action: () => {
      const authToken = localStorage.getItem('authToken');
      // Validamos que haya un token de autenticación
      if (!authToken) {
        AlertNotification('Debes ser usuario', 'Inicia Seccion', () => {
          createLoginForm();
        });
        return;
      } else {
        const hero = document.querySelector('.hero-container');
        todayPage(hero);
      }
    }
  },
  //! Calendario
  {
    title: 'Calendario',
    icon: './assets/calendar-month-svgrepo-com.svg',
    link: '#cal',
    action: () => {
      const authToken = localStorage.getItem('authToken');
      // Validamos que haya un token de autenticación
      if (!authToken) {
        AlertNotification('Debes ser usuario', 'Inicia Seccion', () => {
          createLoginForm();
        });
        return;
      } else {
        const hero = document.querySelector('.hero-container');
        calendarPage(hero);
      }
    }
  }, {},
  //! Mis Recordatorios
  {
    title: 'Mis Recordatorios',
    icon: './assets/calendar-alert-svgrepo-com.svg',
    link: '/reminders',
    action: () => {
      const authToken = localStorage.getItem('authToken');
      // Validamos que haya un token de autenticación
      if (!authToken) {
        AlertNotification('Debes ser usuario', 'Inicia Seccion', () => {
          createLoginForm();
        });
        return;
      } else {
        const hero = document.querySelector('.hero-container');
        remindersPage(hero);
      }
    }
  },
  //! Mis Lugares
  {
    title: 'Lugares Frecuentes',
    icon: './assets/gps-svgrepo-com.svg',
    link: '#listFavoritesIcon',
    action: () => {
      const authToken = localStorage.getItem('authToken');
      // Validamos que haya un token de autenticación
      if (!authToken) {
        AlertNotification('Debes ser usuario', 'Inicia Seccion', () => {
          createLoginForm();
        });
        return;
      } else {
        const hero = document.querySelector('.hero-container');
        favoritesPlacesPage(hero);
      }
    }
  }
];

export const menuAsideII = [
  //! Añadir Lugar
  {
    title: 'Añadir Lugar',
    icon: './assets/home-svgrepo-com.svg',
    link: 'myPlacesList',
    action: () => {
      const authToken = localStorage.getItem('authToken');
      // Validamos que haya un token de autenticación
      if (!authToken) {
        AlertNotification('Debes ser usuario', 'Inicia Seccion', () => {
          createLoginForm();
        });
        return;
      } else {
        const hero = document.querySelector('.hero-container');
        placePage(hero);
      }
    }
  },
  //! Crear Categoria
  {
    title: 'Crear Categoria',
    icon: './assets/book-svgrepo-com.svg',
    link: '#listCategories',
    action: () => {
      const authToken = localStorage.getItem('authToken');
      // Validamos que haya un token de autenticación
      if (!authToken) {
        AlertNotification('Debes ser usuario', 'Inicia Seccion', () => {
          createLoginForm();
        });
        return;
      } else {
        const hero = document.querySelector('.hero-container');
        categoryPage(hero);
      }
    }
  }
];