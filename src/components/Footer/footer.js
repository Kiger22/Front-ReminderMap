import("./footer.css");


export const createFooter = (logoSrc, menuItems, socialLinks) => {

  const footer = document.createElement("footer");
  footer.className = "footer";
  document.body.appendChild(footer);

  // logoSrc
  const logoSection = document.createElement("div");
  logoSection.className = "footer-logo";
  footer.appendChild(logoSection);
  const logoImg = document.createElement("img");
  logoImg.src = logoSrc;
  logoSection.appendChild(logoImg);


  // menuItems
  if (!menuItems) {
    const menuSection = document.createElement("div");
    menuSection.className = "footer-menu";
    menuItems.forEach(item => {
      const link = document.createElement("a");
      link.href = item.href;
      link.innerText = item.text;
      menuSection.appendChild(link);
    });
    footer.appendChild(menuSection);
  }

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



