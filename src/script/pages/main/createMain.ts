import { adminFetch } from '../../fetch/adminFetch';
import { openWebSocket } from '../../fetch/webSocket';
import pushState from '../../router/pushState';
import { buildAccount } from '../account/buildAccount';
import { navigationAccount } from '../account/navigationAccount';
import { buildCard } from '../cardCreator/buildCard';
import { listenCard } from '../cardCreator/listenCard';
import { buildQuiz } from '../quiz/buildQuiz';
import { buildHeader } from './buildHeader';
import { buildMain } from './buildMain';
import { listenHeader } from './listenHeader';

class CreateMain {
  header() {
    const token = localStorage.getItem('token');
    if (token) {
      buildHeader.logHeader();
      listenHeader.log();
      let isAsmin: boolean;
      const data = adminFetch.check(token);
      data.then((res) => {
        isAsmin = res.success;
        if (!isAsmin) return;
        buildHeader.adminHeader();
        listenHeader.log();
        const headerAbout = document.querySelector('.header__nav-about');
        if (headerAbout) headerAbout.classList.add('header__nav_active');
      });
      return;
    }

    buildHeader.anonimHeader();
    listenHeader.anonim();
  }

  afterLogin() {
    createMain.header();
    buildMain.about();
    pushState.about();

    openWebSocket();
  }

  about() {
    window.scrollTo(0, 0);
    buildMain.about();
  }

  cardCreater() {
    window.scrollTo(0, 0);
    buildCard.main();
    listenCard.main();
  }

  account() {
    window.scrollTo(0, 0);
    buildAccount.main();
    navigationAccount();
  }

  admin() {
    window.scrollTo(0, 0);
    buildMain.admin();
  }

  quiz() {
    buildQuiz.main();
  }
}

export const createMain = new CreateMain();
