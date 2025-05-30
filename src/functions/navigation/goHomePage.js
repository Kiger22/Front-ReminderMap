import { divApp } from "../../../main";
import { heroPage } from "../../components/Hero/hero";
import { pageTransition } from "../navigation/pageTransition";

export const goToHomePage = () => {
  history.pushState({}, '', '/');
  const currentPage = document.querySelector('.hero-container');
  pageTransition(currentPage, () => heroPage(divApp));
};
