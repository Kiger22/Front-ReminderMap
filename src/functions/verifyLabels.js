export const verifyLabels = () => {
  const labels = document.querySelectorAll('label');
  labels.forEach(label => {
    const inputId = label.getAttribute('for');
    if (!document.getElementById(inputId)) {
      console.warn(`El label con "for=${inputId}" no tiene un campo input correspondiente.`);
    }
  });
};
verifyLabels();
