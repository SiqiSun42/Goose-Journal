/*
  Sticker helpers.
  Stickers are stored separately from the journal body so writing stays clean.
*/

export function renderStickers({ layer, stickers, onMove, onRemove }) {
  layer.innerHTML = "";

  stickers.forEach((sticker) => {
    const button = document.createElement("button");
    button.className = "sticker";
    button.type = "button";
    button.textContent = sticker.emoji;
    button.style.left = `${sticker.x}px`;
    button.style.top = `${sticker.y}px`;
    button.style.fontSize = `${sticker.size || 30}px`;
    button.title = "Drag me. Double-click to remove.";

    makeDraggable(button, sticker, onMove);
    button.addEventListener("dblclick", () => onRemove(sticker.id));

    layer.appendChild(button);
  });
}

function makeDraggable(element, sticker, onMove) {
  let startX = 0;
  let startY = 0;
  let originalX = 0;
  let originalY = 0;

  element.addEventListener("pointerdown", (event) => {
    element.setPointerCapture(event.pointerId);
    element.classList.add("selected");
    startX = event.clientX;
    startY = event.clientY;
    originalX = sticker.x;
    originalY = sticker.y;
  });

  element.addEventListener("pointermove", (event) => {
    if (!element.hasPointerCapture(event.pointerId)) return;

    const nextX = originalX + event.clientX - startX;
    const nextY = originalY + event.clientY - startY;

    element.style.left = `${nextX}px`;
    element.style.top = `${nextY}px`;
    onMove(sticker.id, nextX, nextY, false);
  });

  element.addEventListener("pointerup", (event) => {
    if (element.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }
    element.classList.remove("selected");
    onMove(sticker.id, parseFloat(element.style.left), parseFloat(element.style.top), true);
  });
}
