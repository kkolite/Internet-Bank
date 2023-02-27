import cardFetch from '../../fetch/cardFetch';
import { userFetch } from '../../fetch/userFetch';
import { buildCard } from './buildCard';
import cardConfig from './cardConfig';

class ListenCard {
  main() {
    const cardSelect = document.querySelector('.card__select');
    const cardName = document.querySelector('.card__name');
    const cardColor = document.querySelector('.card__color');
    const cardText = document.querySelector('.card__text');
    const cardLink = document.querySelector('.card__link');
    const cardBlur = document.querySelector('.card__blur');
    const cardBrightness = document.querySelector('.card__brightness');
    const cardButton = document.querySelector('.card__button');
    const cardCreate = document.querySelector('.card__create');

    if (
      !(cardSelect instanceof HTMLSelectElement) ||
      !(cardName instanceof HTMLInputElement) ||
      !(cardColor instanceof HTMLInputElement) ||
      !(cardText instanceof HTMLInputElement) ||
      !(cardLink instanceof HTMLInputElement) ||
      !(cardBlur instanceof HTMLInputElement) ||
      !(cardBrightness instanceof HTMLInputElement) ||
      !cardButton ||
      !cardCreate
    )
      return;

    cardName.addEventListener('blur', () => {
      if (!cardName.value.length) cardName.classList.add('invalid');
    });

    cardButton.addEventListener('click', (e) => {
      e.preventDefault();
      cardConfig.system = cardSelect.value;
      cardConfig.name = cardName.value;
      cardConfig.color = cardColor.value;
      cardConfig.text = cardText.value;
      cardConfig.link = cardLink.value;
      cardConfig.blur = +cardBlur.value;
      cardConfig.brightness = +cardBrightness.value;
      if (cardName.value.length) {
        const cardPrev = document.querySelector('.card__prev');
        if (!cardPrev) return;
        cardConfig.code = buildCard.card();
        cardPrev.innerHTML = cardConfig.code;
      }
    });

    cardCreate.addEventListener('click', async (e) => {
      e.preventDefault();
      if (cardName.value.length) {
        const token = localStorage.getItem('token');
        if (!token) return;

        const link = await cardFetch();
        window.open(link);
        await userFetch.saveCard(link, token);
      }
    });
  }
}

export const listenCard = new ListenCard();
