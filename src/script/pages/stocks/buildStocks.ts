import config from '../../data/config';
import langs from '../../data/lang/stock/langs';
import { IMarketStocks, IUserStocks } from '../../data/types';

let currentLang;

class BuildStock {
  main() {
    const main = document.querySelector('.main-container');
    if (!main) return;

    main.innerHTML = `<div class="stocks__container">
        <div class="stocks__user"></div>
        <div class="stocks__market"></div>
    </div>`;
  }

  buildUserList(userStocks: IUserStocks[], marketStocks: IMarketStocks[]) {
    const userList = document.querySelector('.stocks__user');
    currentLang = config.lang === 'en' ? langs.en : langs.ru;

    if (!userList) return;

    if (!userStocks.length) {
      userList.innerHTML = `<h3 class="stocks__user-h">${currentLang['stocks__user-h']}</h3>
      <p class="stocks__user-empty">${currentLang['stocks__user-empty']}</p>`;
      return;
    }

    userList.innerHTML = `<h3 class="stocks__user-h">${currentLang['stocks__user-h']}</h3>
    <p class="stocks__user-header">
        <span class="stocks__user-header-name">${currentLang['stocks__user-header-name']}</span>
        <span class="stocks__user-header-count">${currentLang['stocks__user-header-count']}</span>
        <span class="stocks__user-header-profit">${currentLang['stocks__user-header-profit']}</span>
    </p>`;

    userStocks.forEach((el) => {
      const stock = marketStocks.find((stock) => el.name === stock.name);
      currentLang = config.lang === 'en' ? langs.en : langs.ru;
      if (!stock) return;

      const profit = stock.money - el.price;
      const div = document.createElement('div');
      div.classList.add('stocks__user-item', `${el.name.replaceAll(' ', '_')}`);
      div.id = `${el.name.replaceAll(' ', '_')}`;
      div.innerHTML = `<p class="stocks__user-name">${el.name}</p>
      <p class="stocks__user-count">${el.number}</p>
      <p class="stock__user-profit" id="${el.price.toFixed(3)}" style="color:${
        profit > 0 ? 'green' : 'red'
      }">$${profit.toFixed(3)}</p>
      <div class="stocks__user-controls">
          <button class="item__minus">-</button>
          <input type="number" name="" id="" class="item__value" max="${el.number}" min="1" value="1">
          <button class="item__plus">+</button>
      </div>
      <div class="stocks__user-payment">
          <button class="stocks__user-button stocks__button">${currentLang['stocks__user-button']}</button>
          <p class="stocks__user-status">${currentLang['stocks__user-status']}</p>
      </div>`;

      userList.appendChild(div);
    });
  }

  buildMarketList(marketStocks: IMarketStocks[]) {
    const marketList = document.querySelector('.stocks__market');
    currentLang = config.lang === 'en' ? langs.en : langs.ru;
    if (!marketList) return;

    marketList.innerHTML = `<h3 class="stocks__market-h">${currentLang['stocks__market-h']}</h3>
    <p class="stocks__market-header">
        <span class="stocks__market-header-name">${currentLang['stocks__market-header-name']}</span>
        <span class="stocks__market-header-count">${currentLang['stocks__market-header-count']}</span>
        <span class="stocks__market-header-price">${currentLang['stocks__market-header-price']}</span>
    </p>`;

    marketStocks.forEach((el) => {
      currentLang = config.lang === 'en' ? langs.en : langs.ru;
      const div = document.createElement('div');
      div.classList.add('stocks__market-item', `${el.name.replaceAll(' ', '_')}`);
      div.id = `${el.name.replaceAll(' ', '_')}`;
      div.innerHTML = `<p class="stocks__market-name">${el.name}</p>
      <p class="stocks__market-count">${el.number}</p>
      <p class="stocks__market-price">$${el.money.toFixed(3)}</p>
      <div class="stocks__market-controls">
          <button class="item__minus">-</button>
          <input type="number" name="" id="" class="item__value" max="${el.number}" min="1" value="1">
          <button class="item__plus">+</button>
      </div>
      <div class="stocks__market-payment">
        <button class="stocks__market-button stocks__button">${currentLang['stocks__market-button']}</button>
        <p class="stocks__market-status">${currentLang['stocks__market-status']}<p>
      </div>`;

      marketList.appendChild(div);
    });
  }
}

export default new BuildStock();
