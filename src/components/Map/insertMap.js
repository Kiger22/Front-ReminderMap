import("./insertMap.css");

export const insertMap = (node, Src) => {

  const iframe = document.createElement('iframe');
  iframe.className = "iframe_map";
  iframe.allowFullscreen = true;
  iframe.src = Src;
  node.appendChild(iframe);

}
