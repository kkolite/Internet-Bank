import config from '../../data/config';
import langs from '../../data/lang/about/langs';
import accLangs from '../../data/lang/account/langs';
import adminLangs from '../../data/lang/admin/langs';
import { buildAdmin } from '../admin/buildAdmin';
import { listenAdmin } from '../admin/listenAdmin';

let currentLang;

class BuildMain {
  about() {
    const main = document.querySelector('.main-container');
    const aboutHead = document.querySelector('.header__nav-about');
    const body = document.querySelector('.main');
    currentLang = config.lang === 'en' ? langs.en : langs.ru;
    if (!main || !aboutHead || !body) return;

    body.classList.remove('main-auth');

    aboutHead.classList.add('header__nav_active');

    main.innerHTML = ``;
    main.className = 'main-container container';

    const about = document.createElement('div');
    about.classList.add('about');
    about.innerHTML = `<h2 class="about__h">${currentLang['about__h']}</h2>
    <p class="about__text">${currentLang['about__text']}</p>
    <section class="about__highlights about__section">
        <h3 class="about__highlights-h">${currentLang['about__highlights-h']}</h3>
        <ul>
            <li class="high_one">${currentLang['high_one']}</li>
            <li class="high_two">${currentLang['high_two']}</li>
            <li class="high_three">${currentLang['high_three']}</li>
            <li class="high_four">${currentLang['high_four']}</li>
            <li class="high_five">${currentLang['high_five']}</li>
            <li class="high_six">${currentLang['high_six']}</li>
            <li class="high_seven">${currentLang['high_seven']}</li>
            <li class="high_eight">${currentLang['high_eight']}</li>
            <li class="high_nine">${currentLang['high_nine']}</li>
            <li class="high_ten">${currentLang['high_ten']}</li>
            <li class="high_eleven">${currentLang['high_eleven']}</li>
        </ul>
    </section>
    <section class="about__stack about__section">
        <h3 class="about__stack_h">${currentLang['about__stack_h']}</h3>
        <ul>
            <li class="stack_one">Front-end: HTML5, SCSS, TypeScript</li>
            <li class="stack_two">Back-end: Node.js / Express (WebSocket, JWT, Nodemailer, etc.)</li>
            <li class="stack_three">Database: Mongo DB (Mongoose)</li>
            <li class="stack_four">API: Currency (API Ninjas), DOMtoImage (HCTI API)</li>
        </ul>
    </section>
    <section class="about__authors about__section">
        <h3 class="about__authors-h">${currentLang['about__authors-h']}</h3>
        <div class="about__egor about__author-container">
            <img src="https://media.licdn.com/dms/image/D4D03AQFZ1H3nzIJK_A/profile-displayphoto-shrink_400_400/0/1670695287244?e=1680739200&v=beta&t=74kmj5qkEgQFssMxYMIBcvOFBLtZ1oiACYBJP7yUfWA" alt="egor-photo" class="about__author-photo">
            <div class="about__author-info">
                <p class="about__author-name egor">${currentLang['egor']}</p>
                <small class="about__author-resp egor-resp">Back-end, Authorization, Statistics, Stocks, Card Creator</small>
                <p class="about__author-text egor-text">${currentLang['egor-text']}</p>
            </div>
        </div>
        <div class="about__andrei about__author-container">
            <img src="https://avatars.githubusercontent.com/u/96068842?v=4" alt="andrei-photo" class="about__author-photo">
            <div class="about__author-info">
                <p class="about__author-name andrei">${currentLang['andrei']}</p>
                <small class="about__author-resp andrei-resp">User and Admin Panels, Day/Night Mode, Financial Quiz</small>
                <p class="about__author-text andrei-text">${currentLang['andrei-text']}</p>
            </div>
        </div>
        <div class="about__evgeniya about__author-container">
            <img src="https://avatars.githubusercontent.com/u/93492831?v=4" alt="evgeniya-photo" class="about__author-photo">
            <div class="about__author-info">
                <p class="about__author-name evgeniya">${currentLang['evgeniya']}</p>
                <small class="about__author-resp evgeniya-resp">Services, RU/EN Lang</small>
                <p class="about__author-text evgeniya-text">${currentLang['evgeniya-text']}</p>
            </div>
        </div>
    </section>`;
    main.appendChild(about);
  }

  account() {
    const main = document.querySelector('.main-container');
    const account = document.querySelector('.header__nav-account');
    if (!main || !account) return;

    currentLang = config.lang === 'en' ? accLangs.en : accLangs.ru;

    account.classList.add('header__nav_active');
    main.innerHTML = `<ul class="account__list">
      <li class="account__list-item account__list-main account__list-item_active"><span class="account__link_main">${currentLang['account__link_main']}</span> (<span class="account__link_name">${config.currentUser}</span>)</li>
      <li class="account__list-item account__list-edit">${currentLang['account__list-edit']}</li>
      <li class="account__list-item account__list-currency">${currentLang['account__list-currency']}</li>
      <li class="account__list-item account__list-delete">${currentLang['account__list-delete']}</li>
    </ul>
    <div class="account-container">
      <p class="account__description">${currentLang['account__description']}</p>
      <div class="account__main-container">
        <div class="account__main-item">
          <h3 class="account__ttl user-creditcard">${currentLang['user-creditcard']}</h3>
          <div class="account__cards"></div>
        </div>
        <div class="account__main-item">
          <h3 class="account__ttl user-lastoperations">${currentLang['user-lastoperations']}</h3>
          <table class="account__operations_table">
            <thead>
              <tr>
                <th>#</th>
                <th class="account__operations_date">${currentLang['account__operations_date']}</th>
                <th class="account__operations_opId">${currentLang['account__operations_opId']}</th>
                <th class="account__operations_money">${currentLang['account__operations_money']}</th>
              </tr>
            </thead>
            <tbody class="account__operations_tbody"></tbody>
          </table>
          <div class="account__operations_container">
            <h4 class="account__op_title">${currentLang['account__op_title']}</h4>
            <button class="account__operations_button">${currentLang['account__operations_button']}</button>
            <p class="account__operation_process">${currentLang['account__operation_process']}</p>
          </div>
          <div>
            <h4 class="account__ops_title">${currentLang['account__ops_title']}</h4>
            <button class="account__alloperations_button">${currentLang['account__alloperations_button']}</button>
            <p class="account__operations_process">${currentLang['account__operations_process']}</p>
          </div>
        </div>        
      </div>      
    </div>`;
  }

  admin() {
    const main = document.querySelector('.main-container');
    const admin = document.querySelector('.header__nav-admin');
    if (!main || !admin) return;

    currentLang = config.lang === 'en' ? adminLangs.en : adminLangs.ru;

    admin.classList.add('header__nav_active');
    main.innerHTML = `<div class="admin-container">
      <h2 class="admin__title admin__title-main">${currentLang['admin__title-main']}</h2>
      <div class="admin__information_bank">
        <h3 class="admin__information_title bank_title">${currentLang['bank_title']}</h3>
        <p class="admin__information_detail">
          <span class="admin__information_bank-account">${currentLang['admin__information_bank-account']}</span> <span class="admin__information_account get-info">${currentLang['get-info']}</span></p>
        <p class="admin__information_detail"><span class="admin__information_bank-money">${currentLang['admin__information_bank-money']}</span> <span class="admin__information_money get-info">${currentLang['get-info']}</span></p>
      </div>
      <h3 class="admin__information_title users_title">${currentLang['users_title']}</h3>
      <button class="admin__information_button">${currentLang['admin__information_button']}</button>
    </div>`;

    buildAdmin.showBankInfo();
    listenAdmin.showBankInfo();
  }
}

export const buildMain = new BuildMain();
