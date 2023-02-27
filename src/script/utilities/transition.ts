export function transition(el: HTMLElement, func: () => void) {
  el.style.opacity = '0';
  setTimeout(() => {
    func();
    el.style.opacity = '1';
  }, 200);
}
