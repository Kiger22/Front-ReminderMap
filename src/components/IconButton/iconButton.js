import('./iconButton.css');

export const createSvgButton = (node, svgPath, clickHandler, tooltipText) => {

  const img = document.createElement('img');
  img.classList.add('svg-icon');
  img.src = svgPath;

  if (tooltipText) {
    img.setAttribute('aria-label', tooltipText);
  }

  node.appendChild(img);

  if (typeof clickHandler === 'function') {
    img.addEventListener('click', clickHandler);
  }

};
