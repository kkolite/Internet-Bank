import config from '../data/config';
import { EPages } from '../data/types';

class PushState {
  login() {
    history.pushState({}, '', '/login');
    config.page = EPages.AUTH;
  }

  about() {
    history.pushState({}, '', '/about');
    config.page = EPages.ABOUT;
  }

  cardCreator() {
    history.pushState({}, '', '/card');
    config.page = EPages.CARD_CREATOR;
  }

  quiz() {
    history.pushState({}, '', '/quiz');
    config.page = EPages.QUIZ;
  }

  statistic() {
    history.pushState({}, '', '/statistics');
    config.page = EPages.STATISTICS;
  }

  stocks() {
    history.pushState({}, '', '/stocks');
    config.page = EPages.STOCKS;
  }

  services(service?: string) {
    history.pushState({}, '', `${service ? `/services/${service}` : '/services'}`);
    config.page = EPages.SERVICES;
  }

  account(page?: string) {
    history.pushState({}, '', `${page ? `/account/${page.replaceAll(' ', '_')}` : '/account'}`);
    config.page = EPages.ACCOUNT;
  }

  admin() {
    history.pushState({}, '', '/admin');
    config.page = EPages.ADMIN;
  }
}

export default new PushState();
