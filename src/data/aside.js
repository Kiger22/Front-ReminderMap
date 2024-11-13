import { placePage } from "../pages/AddPlace/place";
import { categoryPage } from "../pages/AddPlaceCategory/category";
import { calendarPage } from "../pages/CalendarPage/calendar";
import { favoritesPlacesPage } from "../pages/FavoritesPlaces/favoritesPlaces";
import { remindersPage } from "../pages/RemindersList/remindersList";
import { todayPage } from "../pages/TodayList/today";

export const menuAsideI = [
  {
    title: 'Hoy',
    icon: './assets/calendar-today-svgrepo-com.svg',
    link: '#today',
    action: () => {
      const hero = document.querySelector('.hero-container');
      todayPage(hero);
    }
  },
  {
    title: 'Calendario',
    icon: './assets/calendar-month-svgrepo-com.svg',
    link: '#cal',
    action: () => {
      const hero = document.querySelector('.hero-container');
      calendarPage(hero);
    }
  },
  {
    title: 'Recordatorios',
    icon: './assets/calendar-alert-svgrepo-com.svg',
    link: '/reminders',
    action: () => {
      const hero = document.querySelector('.hero-container');
      remindersPage(hero);
    }
  },
  {
    title: 'Lugares Favoritos',
    icon: './assets/gps-svgrepo-com.svg',
    link: '#listFavoritesIcon',
    action: () => {
      const hero = document.querySelector('.hero-container');
      favoritesPlacesPage(hero);
    }
  }
];

export const menuAsideII = [
  {
    title: 'Mis Lugares',
    icon: './public/assets/home-svgrepo-com.svg',
    link: 'myPlacesList',
    action: () => {
      const hero = document.querySelector('.hero-container');
      placePage(hero);
    }
  },
  {
    title: 'Agregar Categorias',
    icon: './assets/book-svgrepo-com.svg',
    link: '#listCategories',
    action: () => {
      const hero = document.querySelector('.hero-container');
      categoryPage(hero);
    }
  }
];