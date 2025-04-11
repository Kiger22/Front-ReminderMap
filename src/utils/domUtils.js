const waitForElement = (selector, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const interval = 100;
    let elapsedTime = 0;

    const checkElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
      } else if (elapsedTime >= timeout) {
        reject(new Error(`El elemento con el selector '${selector}' no se encontró en el tiempo especificado.`));
      } else {
        elapsedTime += interval;
        setTimeout(checkElement, interval);
      }
    };

    checkElement();
  });
};

export const hideElement = (selector) => {
  waitForElement(selector)
    .then((element) => {
      element.style.display = 'none';
    })
    .catch((error) => {
      console.warn(error.message);
    });
};