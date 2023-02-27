import config from '../../data/config';
import { EMethod, EPages, ETheme } from '../../data/types';
import { userFetch } from '../../fetch/userFetch';
import { buildAuth } from '../auth/buildAuth';
import { createAuth } from '../auth/createAuth';
import { renderPayment } from '../payment/renderPayment';
import { createStatistics } from '../statistics/createStatistics';
import { transition } from '../../utilities/transition';
import { createMain } from './createMain';
import createStocks from '../stocks/createStocks';
import pushState from '../../router/pushState';
import moon from '../../../assets/img/icons/moon.svg';
import sun from '../../../assets/img/icons/carbon_sun.svg';
import { switchLang } from '../../utilities/switchLang';

class ListenHeader {
  async updateInfo() {
    const money = document.querySelector('.header__money');
    const token = localStorage.getItem('token');
    if (!token || !money) return;
    const result = await userFetch.user(EMethod.GET, token);
    if (result.userConfig?.isBlock) return;
    if (!result.userConfig?.email || !result.userConfig.username || !result.userConfig.money) return;
    config.currentEmail = result.userConfig.email;
    config.currentUser = result.userConfig.username;

    const currMoney = result.userConfig.money;
    localStorage.setItem('money', `${currMoney}`);
    money.textContent = `$${Number(currMoney).toFixed(2)}`;
    return true;
  }

  removeActiveClass() {
    const nav = document.querySelectorAll('.header__nav-item');
    nav.forEach((el) => el.classList.remove('header__nav_active'));
  }

  main() {
    const logo = document.querySelector('.header__logo');
    const nav = document.querySelectorAll('.header__nav-item');
    const main = document.querySelector('.main');
    const login = document.querySelector('.header__login');
    const page = document.querySelector('.page');
    const burger = document.querySelector('.header__burger');
    const closeBurger = document.querySelector('.header__burger-close');
    const theme = document.querySelector('.header__switch_theme');
    const switchTheme = document.querySelector('.header__theme');

    if (
      !burger ||
      !closeBurger ||
      !logo ||
      !login ||
      !(main instanceof HTMLElement) ||
      !(page instanceof HTMLElement) ||
      !theme ||
      !switchTheme
    )
      return;

    theme.addEventListener('click', () => {
      if (config.theme === ETheme.light) config.theme = ETheme.dark;
      else config.theme = ETheme.light;

      localStorage.setItem('time', config.theme);

      const body = document.querySelector('.page');
      const header = document.querySelector('.header');
      const footerLogo = document.querySelector('.footer__logo');
      const author = document.querySelector('.footer__authors');
      const backTxt = document.querySelector('.back__text');

      if (backTxt) backTxt.classList.toggle('page-dark');
      if (body) body.classList.toggle('page-dark');
      if (footerLogo) footerLogo.classList.toggle('footer__logo-dark');
      if (author) author.classList.toggle('footer__authors-dark');
      if (header) {
        if (header.classList.contains('page-dark')) {
          header.classList.remove('page-dark');
        } else header.classList.add('page-dark');
      }

      const td = document.querySelectorAll('td');
      const th = document.querySelectorAll('th');

      td.forEach((el) => el.classList.toggle('table-dark'));
      th.forEach((el) => el.classList.toggle('table-dark'));

      const blur = document.querySelector('.card__blur');
      const brightness = document.querySelector('.card__brightness');

      const nav = document.querySelector('.header__nav');
      if (!nav || !header) return;
      if (config.theme === ETheme.dark) {
        theme.innerHTML = `<img src="${sun}" alt="moon" class="header__theme header__theme-dark">`;
        nav.classList.add('page-dark');
        header.classList.add('page-dark');
      } else {
        theme.innerHTML = `<img src="${moon}" alt="moon" class="header__theme">`;
        nav.classList.remove('page-dark');
        header.classList.remove('page-dark');
      }

      if (!blur || !brightness) return;

      if (config.theme === ETheme.dark) {
        blur.classList.add('page-dark');
        brightness.classList.add('page-dark');
      } else {
        blur.classList.remove('page-dark');
        brightness.classList.remove('page-dark');
      }
    });

    burger.addEventListener('click', () => {
      const nav = document.querySelector('.header__nav');
      if (!nav) return;

      nav.classList.add('header__nav_burger');

      if (config.theme === ETheme.dark) {
        nav.classList.add('page-dark');
      } else {
        nav.classList.remove('page-dark');
      }
    });

    closeBurger.addEventListener('click', () => {
      const nav = document.querySelector('.header__nav');
      if (!nav) return;

      nav.classList.remove('header__nav_burger');
    });

    logo.addEventListener('click', async () => {
      if (config.loading) return;
      this.removeActiveClass();
      transition(main, createMain.about);
      await this.updateInfo();
      pushState.about();
    });

    login.addEventListener('click', () => {
      if (config.loading) return;
      localStorage.removeItem('token');
      transition(page, () => {
        buildAuth.main();
        createAuth.login();
      });
      pushState.login();
    });

    nav.forEach((el) => {
      el.addEventListener('click', async () => {
        const nav = document.querySelector('.header__nav');
        if (config.loading || !nav) return;

        nav.classList.remove('header__nav_burger');

        config.loading = true;
        this.removeActiveClass();
        el.classList.add('header__nav_active');
        if (el.id === EPages.STATISTICS) {
          await createStatistics.operations();
          pushState.statistic();
        }

        if (el.id === EPages.CARD_CREATOR) {
          transition(main, createMain.cardCreater);
          pushState.cardCreator();
        }

        if (el.id === EPages.ABOUT) {
          transition(main, createMain.about);
          pushState.about();
        }

        if (el.id === EPages.ACCOUNT) {
          transition(main, createMain.account);
          pushState.account();
        }

        if (el.id === EPages.STOCKS) {
          await createStocks.main();
          pushState.stocks();
        }

        if (el.id === EPages.ADMIN) {
          transition(main, createMain.admin);
          pushState.admin();
        }

        if (el.id === EPages.SERVICES) {
          transition(main, renderPayment.renderPaymentsPage.bind(renderPayment));
          pushState.services();
        }

        if (el.id === EPages.QUIZ) {
          transition(main, createMain.quiz);
          pushState.quiz();
        }

        config.loading = false;
        await this.updateInfo();
      });
    });

    const langSelect = page.querySelector('.header__lang-select') as HTMLSelectElement;
    if (!langSelect) return;
    Array.from(langSelect.options).forEach((optionElem) => {
      optionElem.selected = optionElem.value === config.lang;
    });
    langSelect.oninput = () => switchLang(langSelect);
  }

  log() {
    this.main();
  }

  anonim() {
    this.main();
  }
}

export const listenHeader = new ListenHeader();
