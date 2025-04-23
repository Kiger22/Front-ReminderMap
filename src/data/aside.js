import { AlertNotification } from "../components/AlertNotification/notification";
import { createLoginForm } from "../components/LoginForm/login";
import { placePage } from "../pages/AddPlace/place";
import { categoryPage } from "../pages/AddCategory/category";
import { calendarPage } from "../pages/CalendarPage/calendar";
import { frequentPlacesPage } from "../pages/FrecuentPlaces/frequentPlaces";
import { remindersPage } from "../pages/RemindersList/remindersList";
import { todayPage } from "../pages/TodayList/today";
import { categoriesPage } from "../pages/CategoriesPage/categoriesPage";

export const menuAsideI = [
  // Recordatorios de Hoy
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
  // Ver Calendario
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
  },
  // Mis Recordatorios
  {
    title: 'Recordatorios',
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
];

export const menuAsideII = [
  // Mis Lugares Frecuentes
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
        frequentPlacesPage(hero);
      }
    }
  },
  // Añadir Lugar
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
  }, {},
  // Ver Categorias
  {
    title: 'Mis Categorias',
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
        categoriesPage(hero);
      }
    }
  },
  // Crear Categoria
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
