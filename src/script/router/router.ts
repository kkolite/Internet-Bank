import config from '../data/config';
import { EAccountLinks, EMethod, EPages, ETheme } from '../data/types';
import { adminFetch } from '../fetch/adminFetch';
import { userFetch } from '../fetch/userFetch';
import { openWebSocket } from '../fetch/webSocket';
import { buildAccount } from '../pages/account/buildAccount';
import { listenAccount } from '../pages/account/listenAccount';
import { navigationAccount } from '../pages/account/navigationAccount';
import { buildAuth } from '../pages/auth/buildAuth';
import { createAuth } from '../pages/auth/createAuth';
import { createMain } from '../pages/main/createMain';
import { listenHeader } from '../pages/main/listenHeader';
import { renderPayment } from '../pages/payment/renderPayment';
import { renderPaymentDetails } from '../pages/payment/renderPaymentDetails';
import { buildQuiz } from '../pages/quiz/buildQuiz';
import { createStatistics } from '../pages/statistics/createStatistics';
import createStocks from '../pages/stocks/createStocks';
import { switchTheme } from '../utilities/theme';
import { transition } from '../utilities/transition';
import pushState from './pushState';

class Router {
  popstate() {
    window.addEventListener('popstate', async () => {
      const route = window.location.pathname.split('/');
      const page = route[route.length - 1];
      const popup = document.querySelector('.popup');
      if (popup) popup.remove();
      listenHeader.removeActiveClass();

      const isHeader = document.querySelector('.header__up');
      if (!isHeader && page !== EPages.AUTH) {
        createMain.header();
      }

      switch (page) {
        case EPages.ABOUT:
          this.about();
          break;
        case EPages.ACCOUNT:
          this.account();
          break;
        case EPages.ADMIN:
          this.admin();
          break;
        case EPages.AUTH:
          this.login();
          break;
        case EPages.CARD_CREATOR:
          this.cardCreator();
          break;
        case EPages.QUIZ:
          this.quiz();
          break;
        case EPages.SERVICES:
          this.services();
          break;
        case EPages.STATISTICS:
          this.statistic();
          break;
        case EPages.STOCKS:
          this.stocks();
          break;
        default:
          this.defaultWay();
      }
      await listenHeader.updateInfo();
    });
  }

  async page() {
    if (!localStorage.getItem('time')) {
      const time = new Date().getHours();
      config.theme = `${time < 22 && time > 5 ? ETheme.light : ETheme.dark}`;
    } else {
      const data = localStorage.getItem('time');
      if (data) config.theme = data;
    }

    switchTheme();
    listenHeader.removeActiveClass();

    const body = document.querySelector('.page');
    if (!(body instanceof HTMLElement)) return;

    const route = window.location.pathname.split('/');
    const page = route[route.length - 1];

    if (page !== EPages.AUTH && page !== '' && page !== 'index.html') {
      createMain.header();
      //listenHeader.updateInfo();
    }

    const token = localStorage.getItem('token');

    if (page === '' || page === 'index.html') {
      if (!token) {
        this.login();
        pushState.login();
        body.style.opacity = '1';
        return;
      }
      createMain.header();
      this.about();
      pushState.about();
      // Kostyl!
      const check = await listenHeader.updateInfo();

      if (!check) {
        this.login();
        pushState.login();
        body.style.opacity = '1';
        return;
      }
      body.style.opacity = '1';
      openWebSocket();
      return;
    }

    if (token) {
      const check = await listenHeader.updateInfo();

      if (!check) {
        this.login();
        pushState.login();
        body.style.opacity = '1';
        return;
      }
      openWebSocket();
    }

    switch (page) {
      case EPages.ABOUT:
        this.about();
        pushState.about();
        break;
      case EPages.ACCOUNT:
        if (this.account()) pushState.account();
        break;
      case EPages.ADMIN:
        this.admin();
        //pushState.admin();
        break;
      case EPages.AUTH:
        this.login();
        pushState.login();
        break;
      case EPages.CARD_CREATOR:
        this.cardCreator();
        //pushState.cardCreator();
        break;
      case EPages.QUIZ:
        this.quiz();
        pushState.quiz();
        break;
      case EPages.SERVICES:
        this.services();
        pushState.services();
        break;
      case EPages.STATISTICS:
        this.statistic();
        pushState.statistic();
        break;
      case EPages.STOCKS:
        this.stocks();
        //pushState.stocks();
        break;
      default:
        this.defaultWay();
    }
    setTimeout(() => {
      body.style.opacity = '1';
    }, 0);
  }

  private defaultWay() {
    const route = window.location.pathname.split('/');
    const page = route[route.length - 1];
    const parentPage = route[route.length - 2];
    if (parentPage === 'account') {
      this.accountExtra(page);
      config.page = EPages.ACCOUNT;
      return;
    }
    if (parentPage === 'services') {
      this.servicesExtra(page);
      config.page = EPages.SERVICES;
      return;
    }

    this.about();
    pushState.about();
  }

  private userCheck() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token! Need to login!');
      this.login();
      pushState.login();
    }

    return token;
  }

  private async isBlocked() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const user = await userFetch.user(EMethod.GET, token);
    return user.userConfig?.isBlock;
  }

  private async isAdmin() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.login();
      pushState.login();
      return false;
    }

    const result = await adminFetch.check(token);
    if (!result.success) {
      alert('You are not a admin!');
      this.about();
      pushState.about();
    }

    return result.success;
  }

  private login() {
    const main = document.querySelector('.main');
    const page = document.querySelector('.page');
    if (!(main instanceof HTMLElement) || !(page instanceof HTMLElement)) return;

    localStorage.removeItem('token');
    transition(page, () => {
      buildAuth.main();
      createAuth.login();
    });
    config.page = EPages.AUTH;
  }

  private about() {
    const main = document.querySelector('.main');
    if (!(main instanceof HTMLElement)) return;

    transition(main, createMain.about);
    this.addActiveClass('about');
    config.page = EPages.ABOUT;
  }

  private cardCreator() {
    const main = document.querySelector('.main');
    if (!(main instanceof HTMLElement) || !this.userCheck()) return;

    transition(main, createMain.cardCreater);
    this.addActiveClass('card');
    pushState.cardCreator();
    config.page = EPages.CARD_CREATOR;
  }

  private quiz() {
    buildQuiz.main();
    this.addActiveClass('quiz');
    config.page = EPages.QUIZ;
  }

  private async statistic() {
    await createStatistics.operations();
    this.addActiveClass('stat');
    config.page = EPages.STATISTICS;
  }

  private async stocks() {
    const main = document.querySelector('.main');
    if (!(main instanceof HTMLElement) || !this.userCheck()) return;

    await createStocks.main();
    this.addActiveClass('stocks');
    pushState.stocks();
    config.page = EPages.STOCKS;
  }

  private services() {
    const main = document.querySelector('.main');
    if (!(main instanceof HTMLElement)) return;

    transition(main, renderPayment.renderPaymentsPage.bind(renderPayment));
    this.addActiveClass('services');
    config.page = EPages.SERVICES;
  }

  private async servicesExtra(page: string) {
    const num = +page;
    if (!isNaN(num) && num > 0 && num < 30 && num !== 7 && num !== 11 && num !== 12 && num !== 13) {
      // я люблю костыли, а ты?
      await renderPaymentDetails.renderPayment(num);
      this.addActiveClass('services');
      return;
    }
    this.services();
    pushState.services();
  }

  private account() {
    const main = document.querySelector('.main');
    if (!(main instanceof HTMLElement) || !this.userCheck()) return;

    transition(main, createMain.account);
    this.addActiveClass('account');
    config.page = EPages.ACCOUNT;
    return true;
  }

  private accountExtra(page: string) {
    if (!this.userCheck()) return;
    createMain.account();

    const nav = document.querySelectorAll('.account__list-item');
    nav.forEach((el) => el.classList.remove('account__list-item_active'));
    const elem = Array.from(nav).find((el) => el.textContent === page.replaceAll('_', ' '));
    if (elem) elem.classList.add('account__list-item_active');

    switch (page) {
      case EAccountLinks.edit:
        buildAccount.editAccount();
        listenAccount.editAccount();
        listenAccount.editPassword();
        break;
      case EAccountLinks.currency:
        buildAccount.currency();
        listenAccount.currency();
        break;
      case EAccountLinks.delete:
        buildAccount.clarifyAccount();
        listenAccount.clarifyAccount();
        break;
      default:
        buildAccount.main();
        pushState.account();
        navigationAccount();
    }
    this.addActiveClass('account');
  }

  private admin() {
    const main = document.querySelector('.main');
    if (!(main instanceof HTMLElement) || !this.isAdmin()) return;

    transition(main, createMain.admin);
    this.addActiveClass('admin');
    pushState.admin();
    config.page = EPages.ADMIN;
  }

  private addActiveClass(page: string) {
    const headerItems = document.querySelectorAll('.header__nav-item');
    headerItems.forEach((el) => {
      el.classList.remove('header__nav_active');
    });
    const headerItem = document.querySelector(`.header__nav-${page}`);
    if (!headerItem) return;

    headerItem.classList.add('header__nav_active');
  }
}

export default new Router();
