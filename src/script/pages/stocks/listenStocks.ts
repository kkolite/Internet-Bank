import config from '../../data/config';
import { EOperation } from '../../data/types';
import stocksFetch from '../../fetch/stocksFetch';
import buttonController from '../../utilities/buttonController';
import { listenHeader } from '../main/listenHeader';
import createStocks from './createStocks';

class ListenStocks {
  market() {
    const marketList = document.querySelectorAll('.stocks__market-item');

    marketList.forEach((stock) => {
      const counter = stock.querySelector('.stocks__market-count');
      const button = stock.querySelector('.stocks__market-button');
      const minus = stock.querySelector('.item__minus');
      const plus = stock.querySelector('.item__plus');
      const input = stock.querySelector('.item__value');

      if (!counter || !button || !minus || !plus || !(input instanceof HTMLInputElement)) return;

      input.addEventListener('blur', () => {
        if (input.value > input.max) input.value = input.max;
        if (input.value < input.min) input.value = input.min;
      });

      input.addEventListener('input', () => {
        if (input.value.length > 3) input.value = input.max;
      });

      minus.addEventListener('click', () => {
        if (input.value === input.min) return;
        input.value = `${Number(input.value) - 1}`;
      });

      plus.addEventListener('click', () => {
        if (input.value === input.max) return;
        input.value = `${Number(input.value) + 1}`;
      });

      button.addEventListener('click', async () => {
        const isEnglish = config.lang === 'en';
        const token = localStorage.getItem('token');
        if (!token) return;

        const stockName = stock.id.replaceAll('_', ' ');
        const value = Number(input.value);

        const status = stock.querySelector('.stocks__market-status');
        const buttonList = document.querySelectorAll('.stocks__button') as NodeListOf<HTMLButtonElement>;
        if (!status) return;

        status.textContent = isEnglish ? 'Deal...' : 'Сделка...';
        buttonController.disable(buttonList);

        const result = await stocksFetch.buyOrSell(token, EOperation.ADD, stockName, value);
        status.textContent = isEnglish ? result.message : result.success ? 'Успех!' : 'Ошибка';
        buttonController.able(buttonList);

        setTimeout(() => {
          status.textContent = isEnglish ? 'Ready to deal' : 'Открыто';
        }, 3000);

        if (result.success) {
          await createStocks.user();
          await listenHeader.updateInfo();
        }
      });
    });
  }

  user() {
    const userList = document.querySelectorAll('.stocks__user-item');

    userList.forEach((stock) => {
      const counter = stock.querySelector('.stocks__user-count');
      const button = stock.querySelector('.stocks__user-button');
      const minus = stock.querySelector('.item__minus');
      const plus = stock.querySelector('.item__plus');
      const input = stock.querySelector('.item__value');

      if (!counter || !button || !minus || !plus || !(input instanceof HTMLInputElement)) return;

      input.addEventListener('blur', () => {
        if (input.value > input.max) input.value = input.max;
        if (input.value < input.min) input.value = input.min;
      });

      input.addEventListener('input', () => {
        if (input.value.length > 3) input.value = input.max;
      });

      minus.addEventListener('click', () => {
        if (input.value === input.min) return;
        input.value = `${Number(input.value) - 1}`;
      });

      plus.addEventListener('click', () => {
        if (input.value === input.max) return;
        input.value = `${Number(input.value) + 1}`;
      });

      button.addEventListener('click', async () => {
        const isEnglish = config.lang === 'en';
        const token = localStorage.getItem('token');
        if (!token) return;

        const stockName = stock.id.replaceAll('_', ' ');
        const value = Number(input.value);

        const status = stock.querySelector('.stocks__user-status');
        const buttonList = document.querySelectorAll('.stocks__button') as NodeListOf<HTMLButtonElement>;
        if (!status) return;

        status.textContent = isEnglish ? 'Deal...' : 'Сделка...';
        buttonController.disable(buttonList);

        const result = await stocksFetch.buyOrSell(token, EOperation.REMOVE, stockName, value);
        status.textContent = isEnglish ? result.message : result.success ? 'Успех!' : 'Ошибка';
        buttonController.able(buttonList);

        setTimeout(() => {
          status.textContent = isEnglish ? 'Ready to deal' : 'Открыто';
        }, 3000);

        if (result.success) {
          await createStocks.user();
          await listenHeader.updateInfo();
        }
      });
    });
  }
}

export default new ListenStocks();
