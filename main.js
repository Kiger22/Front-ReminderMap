import { createFooter } from './src/components/Footer/footer';
import { createHeader } from './src/components/Header/header';
import { createAsideMenu } from './src/components/MenuAsside/menuAside';
import { SwitchButton } from './src/components/SwitchButton/switchButton';
import { menuAsideI, menuAsideII } from './src/data/aside';
import { footerLogo, menuFooter, socialLinks } from './src/data/footer';
import { heaterLogo, menuItemsHeaderI, menuItemsHeaderII } from './src/data/header';
import { toggletheme } from './src/functions/toggleTheme';
import { heroPage } from './src/components/Hero/hero';
import './style.css'
import { NotificationReminder } from './src/components/ReminderNotification/reminderNotification';
import { createLoader } from './src/components/Loader/loader';

export const divApp = document.querySelector("#app");

createHeader(divApp, heaterLogo, menuItemsHeaderI, menuItemsHeaderII);

heroPage(divApp);

createAsideMenu(divApp, menuAsideI, menuAsideII);

createFooter(footerLogo, menuFooter, socialLinks);

SwitchButton();
const switchButton = document.querySelector("#switch")
const button = document.querySelector("button");
const fullpage = document.querySelector("body");
const aside = document.querySelector("aside");
const footer = document.querySelector("footer");
const header = document.querySelector("header");
const hero = document.querySelector(".hero");

switchButton.addEventListener("click", () => toggletheme(button));
switchButton.addEventListener("click", () => toggletheme(fullpage));
switchButton.addEventListener("click", () => toggletheme(divApp));
switchButton.addEventListener("click", () => toggletheme(aside));
switchButton.addEventListener("click", () => toggletheme(footer));
switchButton.addEventListener("click", () => toggletheme(header));
switchButton.addEventListener("click", () => toggletheme(hero));