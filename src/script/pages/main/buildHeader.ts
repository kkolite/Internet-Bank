import moon from '../../../assets/img/icons/moon.svg';
import sun from '../../../assets/img/icons/carbon_sun.svg';
import config from '../../data/config';
import { ETheme } from '../../data/types';
import langs from '../../data/lang/header/langs';

let curruntLang = langs.ru;

class BuildHeader {
  anonimHeader() {
    const header = document.querySelector('header');
    const main = document.querySelector('.main');
    curruntLang = config.lang === 'en' ? langs.en : langs.ru;
    if (!header || !(main instanceof HTMLElement)) return;

    header.classList.add('header');
    config.theme === ETheme.dark ? header.classList.add('page-dark') : header.classList.remove('page-dark');
    header.innerHTML = `<div class="header__up">
        <h1 class="header__logo">RS Bank</h1>
    </div>
    <button class="header__burger">${curruntLang['header__burger']}</button>
    <nav class="header__nav">
        <ul class="header__ul">
            <li class="header__nav-item header__nav-about" id="about">${curruntLang['header__nav-about']}</li>
            <li class="header__nav-item header__nav-services" id="services">${curruntLang['header__nav-services']}</li>
            <li class="header__nav-item header__nav-quiz" id="quiz">${curruntLang['header__nav-quiz']}</li>
            <li class="header__nav-item header__nav-stat" id="statistics">${curruntLang['header__nav-stat']}</li>
        </ul>
        <button class="header__burger-close">&#10006;</button>
    </nav>
    <div class="header__down">
        <div class="header__login">${curruntLang['header__login']}</div>
        <div  class="header__switch">
          <div class="header__switch_theme">
            <img src="${config.theme === ETheme.dark ? sun : moon}" alt="${
      config.theme === ETheme.dark ? 'sun' : 'moon'
    }" class="${config.theme === ETheme.dark ? 'header__theme header__theme-dark' : 'header__theme'}">
          </div>
          <div class="header__lang">
            <select class="header__lang-select">
              <option class="header__lang-option" value="en">en</option>
              <option class="header__lang-option" value="ru">ru</option>
            </select>
          </div>
        </div>
    </div>`;
  }

  logHeader() {
    this.anonimHeader();
    const list = document.querySelector('.header__ul');
    const logout = document.querySelector('.header__login');
    const headerUp = document.querySelector('.header__up');
    const curruntLang = config.lang === 'en' ? langs.en : langs.ru;
    if (!list || !logout || !headerUp) return;

    logout.textContent = curruntLang['header__logout'];
    logout.classList.add('header__logout');

    const account = document.createElement('li');
    account.classList.add('header__nav-item');
    account.classList.add('header__nav-account');
    account.textContent = curruntLang['header__nav-account'];
    account.id = 'account';

    const cardCreator = document.createElement('li');
    cardCreator.classList.add('header__nav-item');
    cardCreator.classList.add('header__nav-card');
    cardCreator.textContent = curruntLang['header__nav-card'];
    cardCreator.id = 'card';

    const stocks = document.createElement('li');
    stocks.classList.add('header__nav-item');
    stocks.classList.add('header__nav-stocks');
    stocks.textContent = curruntLang['header__nav-stocks'];
    stocks.id = 'stocks';

    const money = document.createElement('p');
    money.classList.add('header__money');
    const currMoney = localStorage.getItem('money');
    if (currMoney) {
      money.textContent = `$${Number(currMoney).toFixed(2)}`;
    }
    headerUp.appendChild(money);

    list.appendChild(stocks);
    list.appendChild(cardCreator);
    list.appendChild(account);
  }

  adminHeader() {
    this.logHeader();
    const list = document.querySelector('.header__ul');
    curruntLang = config.lang === 'en' ? langs.en : langs.ru;
    if (!list) return;

    const admin = document.createElement('li');
    admin.classList.add('header__nav-item');
    admin.classList.add('header__nav-admin');
    admin.textContent = curruntLang['header__nav-admin'];
    admin.id = 'admin';

    list.appendChild(admin);
  }
}

export const buildHeader = new BuildHeader();
