export const isElementInViewport = el => {
  const rect = el.getBoundingClientRect();

  let top = false;
  let right = false;
  let bottom = false;
  let left = false;

  if (rect.top <= 0) top = rect.top;
  if (rect.left <= 0) left = rect.left;

  if (rect.right >= (window.innerWidth || document.documentElement.clientWidth))
    right = rect.right - document.documentElement.clientWidth;
  if (
    rect.bottom >= (window.innerHeight || document.documentElement.clientHeight)
  )
    bottom = rect.bottom - document.documentElement.clientHeight;

  return [top, right, bottom, left];
};
export const correctOverflow = element => {
  if (element) {
    let overflowArray = isElementInViewport(element);
    if (overflowArray) {
      if (overflowArray[0]) {
        // overflows top
        element.style.top = "calc(50% + " + (overflowArray[0] + 48) + "px)";
      } else if (overflowArray[2]) {
        // overflows bottom
        element.style.top = "calc(50% - " + (overflowArray[2] + 48) + "px)";
      }

      if (overflowArray[1]) {
        // overflows right
        element.style.right = "calc(100% + 8px)";
        element.style.left = "auto";
      } else if (overflowArray[3]) {
        // overflows left
        element.style.left = "100% + 8px";
        element.style.right = "auto";
      }
    }
  }
};
