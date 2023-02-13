import moon from '../../../assets/img/icons/moon.svg';
import config from '../../data/config';

class BuildHeader {
  anonimHeader() {
    const header = document.querySelector('header');
    const main = document.querySelector('.main');
    const isEnglish = config.lang === 'en';
    if (!header || !(main instanceof HTMLElement)) return;

    //if (document.documentElement.clientWidth > 767) main.style.marginLeft = '230px';

    header.classList.add('header');
    header.innerHTML = `<div class="header__up">
        <h1 class="header__logo">RS Bank</h1>
    </div>
    <button class="header__burger">${isEnglish ? 'Menu' : 'Меню'}</button>
    <nav class="header__nav">
        <ul class="header__ul">
            <li class="header__nav-item header__nav-about" id="about">${isEnglish ? 'About' : 'О Проекте'}</li>
            <li class="header__nav-item header__nav-services" id="services">${isEnglish ? 'Services' : 'Услуги'}</li>
            <li class="header__nav-item header__nav-quiz" id="quiz">${isEnglish ? 'Quiz' : 'Квиз'}</li>
            <li class="header__nav-item header__nav-stat" id="statistics">${
              isEnglish ? 'Statistics' : 'Статистика'
            }</li>
        </ul>
        <button class="header__burger-close">&#10006;</button>
    </nav>
    <div class="header__down">
        <div class="header__login">${isEnglish ? 'Log In' : 'Войти'}</div>
        <div class="header__switch_theme">
          <img src="${moon}" alt="moon" class="header__theme">
        </div>
    </div>`;
  }

  logHeader() {
    this.anonimHeader();
    const list = document.querySelector('.header__ul');
    const logout = document.querySelector('.header__login');
    const headerUp = document.querySelector('.header__up');
    const isEnglish = config.lang === 'en';
    if (!list || !logout || !headerUp) return;

    logout.textContent = isEnglish ? 'Log Out' : 'Выйти';
    logout.classList.add('header__logout');

    const account = document.createElement('li');
    account.classList.add('header__nav-item');
    account.classList.add('header__nav-account');
    account.textContent = isEnglish ? 'Account' : 'Аккаунт';
    account.id = 'account';

    const cardCreator = document.createElement('li');
    cardCreator.classList.add('header__nav-item');
    cardCreator.classList.add('header__nav-card');
    cardCreator.textContent = isEnglish ? 'Card Creator' : 'Создать карточку';
    cardCreator.id = 'card';

    const stocks = document.createElement('li');
    stocks.classList.add('header__nav-item');
    stocks.classList.add('header__nav-stocks');
    stocks.textContent = isEnglish ? 'Stocks' : 'Акции';
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
    const isEnglish = config.lang === 'en';
    if (!list) return;

    const admin = document.createElement('li');
    admin.classList.add('header__nav-item');
    admin.classList.add('header__nav-admin');
    admin.textContent = isEnglish ? 'Administration' : 'Админка';
    admin.id = 'admin';

    list.appendChild(admin);
  }
}

export const buildHeader = new BuildHeader();
