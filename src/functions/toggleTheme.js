export const toggletheme = (node) => {
  const switchButton = document.querySelector("#switch")
  if (node.classList.contains("dark")) {
    node.classList.remove("dark");
    switchButton.classList.remove("switched");
  } else {
    node.classList.add("dark");
    switchButton.classList.add("switched");
  }
}