import("./footer.css");
import { SwitchButton } from "../SwitchButton/switchButton";

export const createFooter = (logoSrc, menuItems, socialLinks) => {
  const footer = document.createElement("footer");
  footer.className = "footer";
  document.body.appendChild(footer);

  // Agregar el SwitchButton al footer
  const switchBtn = SwitchButton();
  footer.appendChild(switchBtn);

  // copyright
  const copyright = document.createElement("p");
  copyright.className = "copyright";
  copyright.textContent = "Created by ©kiger22"
  footer.appendChild(copyright);

  // socialLinks
  const socialSection = document.createElement("div");
  socialSection.className = "footer-social";
  socialLinks.forEach(link => {
    const a = document.createElement("a");
    a.href = link.href;
    const icon = document.createElement("img");
    icon.className = "social-icon";
    icon.src = link.src;
    a.appendChild(icon);
    socialSection.appendChild(a);
  });
  footer.appendChild(socialSection);

};



