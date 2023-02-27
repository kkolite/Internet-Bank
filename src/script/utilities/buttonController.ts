class ButtonController {
  able(list: NodeListOf<HTMLButtonElement>) {
    list.forEach((button) => {
      button.disabled = false;
      button.classList.remove('button__disabled');
    });
  }

  disable(list: NodeListOf<HTMLButtonElement>) {
    list.forEach((button) => {
      button.disabled = true;
      button.classList.add('button__disabled');
    });
  }
}

export default new ButtonController();
