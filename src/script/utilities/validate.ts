export function validate(el: HTMLInputElement, rgx: string) {
  const value = el.value;
  const regex = new RegExp(rgx);
  if (value.length === 0 || !value.match(regex)) {
    el.classList.add('invalid');
    return false;
  }
  el.classList.remove('invalid');
  return true;
}
