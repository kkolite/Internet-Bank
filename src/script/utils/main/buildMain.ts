import config from '../../data/config';
import enAccount from '../../data/lang/account/en';
import ruAccount from '../../data/lang/account/ru';
import enAdmin from '../../data/lang/admin/en';
import ruAdmin from '../../data/lang/admin/ru';
import { TLang, TPageLang } from '../../data/servicesType';
import { EAccountLinks, EMethod, EPages } from '../../data/types';
import { userFetch } from '../../fetch/userFetch';
import { buildAdmin } from '../admin/buildAdmin';
import { listenAdmin } from '../admin/listenAdmin';
import { load } from '../load';

const textByLangsData: TPageLang = {
  [EPages.ACCOUNT]: {
    en: enAccount,
    ru: ruAccount,
  },
  [EPages.ADMIN]: {
    en: enAdmin,
    ru: ruAdmin,
  },
};
class BuildMain {
  about() {
    const main = document.querySelector('.main-container');
    const aboutHead = document.querySelector('.header__nav-about');
    const body = document.querySelector('.main');
    const isEnglish = config.lang === 'en';
    if (!main || !aboutHead || !body) return;

    body.classList.remove('main-auth');

    aboutHead.classList.add('header__nav_active');

    main.innerHTML = ``;
    main.className = 'main-container container';

    const about = document.createElement('div');
    about.classList.add('about');
    about.innerHTML = `<h2 class="about__h">${
      isEnglish ? 'RS Bank - clone of Internet Bank' : 'RS Bank - клон Интернет-Банка'
    }</h2>
    <p class="about__text">${
      isEnglish
        ? `Our RS School 2022Q3 final project is a clone of the Internet bank. 
    Today, almost all financial transactions can be performed remotely via the Internet. 
    So we decided to create bank web-application`
        : `Наш проект - клон интернет-банка. На сегодняшний день практически все 
    финаносвые операции можно выполнить удаленно через интернет. 
    Мы решили создать свое веб-приложение банка.`
    }</p>
    <section class="about__highlights about__section">
        <h3 class="about__highlights-h">${isEnglish ? 'Opportunities' : 'Возможности'}</h3>
        <ul>
            <li class="high_one">${
              isEnglish
                ? 'Authorization (incl. registration, password reset and two-factor authentication)'
                : 'Авторизация (в т.ч. регистрация, сброс пароля и двухэтапная верификация)'
            }</li>
            <li class="high_two">${
              isEnglish
                ? 'User Panel (info update, account delete and etc.)'
                : 'Личный кабинет (изменение данных, удаление аккаунта и т.д.)'
            }</li>
            <li class="high_three">${
              isEnglish ? 'Admin Panel (bank management)' : 'Кабинет админа (управление банком)'
            }</li>
            <li class="high_four">${
              isEnglish
                ? 'Bank Services (accounts, money exchage, money transfers between clients and etc.)'
                : 'Банковские услуги (счета, обмен валюты, перевод между клиентами и т.д.)'
            }</li>
            <li class="high_five">${
              isEnglish
                ? 'Other Services (Netflix, Booking, Orange and etc.)'
                : 'Прочие услуги (Netflix, Booking, Orange и др.)'
            }</li>
            <li class="high_six">${isEnglish ? 'Financial Quiz' : 'Викторина по финансовой грамотности'}</li>
            <li class="high_seven">${isEnglish ? 'Card Constructor' : 'Конструктор дизайна карточки'}</li>
            <li class="high_eight">${isEnglish ? 'Stocks market' : 'Биржа акций'}</li>
            <li class="high_nine">${isEnglish ? 'Statistics' : 'Статистика'}</li>
            <li class="high_ten">${isEnglish ? 'Day/Night Mode' : 'Дневная/Ночная темы'}</li>
            <li class="high_eleven">${isEnglish ? 'Languages: RU and EN' : 'Языки: русский и английский'}</li>
        </ul>
    </section>
    <section class="about__stack about__section">
        <h3 class="about__stack_h">${isEnglish ? 'Stack' : 'Стэк'}</h3>
        <ul>
            <li class="stack_one">Front-end: HTML5, SCSS, TypeScript</li>
            <li class="stack_two">Back-end: Node.js / Express (WebSocket, JWT, NodeEmailer, etc.)</li>
            <li class="stack_three">Database: Mongo DB (Mongoose)</li>
            <li class="stack_four">API: Currency (API Ninjas), DOMtoImage (HCTI API)</li>
        </ul>
    </section>
    <section class="about__authors about__section">
        <h3 class="about__authors-h">${isEnglish ? 'Authors' : 'Авторы'}</h3>
        <div class="about__egor about__author-container">
            <img src="https://media.licdn.com/dms/image/D4D03AQFZ1H3nzIJK_A/profile-displayphoto-shrink_400_400/0/1670695287244?e=1680739200&v=beta&t=74kmj5qkEgQFssMxYMIBcvOFBLtZ1oiACYBJP7yUfWA" alt="egor-photo" class="about__author-photo">
            <div class="about__author-info">
                <p class="about__author-name egor">${isEnglish ? 'Egor Litavar' : 'Егор Литавор'}</p>
                <small class="about__author-resp egor-resp">Back-end, Authorization, Statistics, Stocks, Card Creator</small>
                <p class="about__author-text egor-text">${
                  isEnglish
                    ? `23 yo, Minsk. Have Air Traffic Controller diploma.
                Likes to work on interesting and challenging projects.
                 RS School student since spring 2022.`
                    : `23 года, Минск. Есть диплом авиадиспетчера. Любит работать над интересными и сложными проектами. Студент RS School с весны 2022 года.`
                }</p>
            </div>
        </div>
        <div class="about__andrei about__author-container">
            <img src="https://avatars.githubusercontent.com/u/96068842?v=4" alt="andrei-photo" class="about__author-photo">
            <div class="about__author-info">
                <p class="about__author-name andrei">${isEnglish ? 'Andrei Shamanouski' : 'Andrei Shamanouski'}</p>
                <small class="about__author-resp andrei-resp">User and Admin Panels, Day/Night Mode, Financial Quiz</small>
                <p class="about__author-text andrei-text">${
                  isEnglish
                    ? `Lorem ipsum dolor sit amet, consectetur 
                adipiscing elit, sed do eiusmod tempor incididunt ut labore et 
                dolore magna aliqua.`
                    : `Lorem ipsum dolor sit amet, consectetur 
                adipiscing elit, sed do eiusmod tempor incididunt ut labore et 
                dolore magna aliqua.`
                }</p>
            </div>
        </div>
        <div class="about__evgeniya about__author-container">
            <img src="https://avatars.githubusercontent.com/u/93492831?v=4" alt="evgeniya-photo" class="about__author-photo">
            <div class="about__author-info">
                <p class="about__author-name evgeniya">${isEnglish ? 'Yevheniia Miniukova' : 'Yevheniia Miniukova'}</p>
                <small class="about__author-resp evgeniya-resp">Services, RU/EN Lang</small>
                <p class="about__author-text evgeniya-text">${
                  isEnglish
                    ? `From Kharkiv, has a degree in finance, worked for four years in the accounting department of the bank. RS School student since summer 2022.`
                    : `Родом из Харькова, имеет высшее финансовое образование, четыре года работала в бухгалтерии банка. Студент RS School с лета 2022 года.`
                }</p>
            </div>
        </div>
    </section>`;
    main.appendChild(about);
  }

  account() {
    const main = document.querySelector('.main-container');
    const account = document.querySelector('.header__nav-account');
    if (!main || !account) return;

    const currLangObj = textByLangsData[EPages.ACCOUNT][config.lang];

    account.classList.add('header__nav_active');
    main.innerHTML = `<ul class="account__list">
      <li class="account__list-item account__list-main account__list-item_active"><span class="account__link_main">${EAccountLinks.account}</span> (${config.currentUser})</li>
      <li class="account__list-item account__list-edit">${EAccountLinks.edit}</li>
      <li class="account__list-item account__list-currency">${EAccountLinks.currency}</li>
      <li class="account__list-item account__list-delete">${EAccountLinks.delete}</li>
    </ul>
    <div class="account-container">
      <p class="account__description">${currLangObj['account__description']}</p>
      <div class="account__main-container">
        <div class="account__main-item">
          <h3 class="account__ttl user-creditcard">${currLangObj['user-creditcard']}</h3>
          <div class="account__cards"></div>
        </div>
        <div class="account__main-item">
          <h3 class="account__ttl user-lastoperations">${currLangObj['user-lastoperations']}</h3>
          <table class="account__operations_table">
            <thead>
              <tr>
                <th>#</th>
                <th class="account__operations_date">${currLangObj['account__operations_date']}</th>
                <th class="account__operations_opId">${currLangObj['account__operations_opId']}</th>
                <th class="account__operations_money">${currLangObj['account__operations_money']}</th>
              </tr>
            </thead>
            <tbody class="account__operations_tbody"></tbody>
          </table>
        </div>        
      </div>      
    </div>`;
  }

  admin() {
    const main = document.querySelector('.main-container');
    const admin = document.querySelector('.header__nav-admin');
    if (!main || !admin) return;

    const currLangObj = textByLangsData[EPages.ADMIN][config.lang];

    admin.classList.add('header__nav_active');
    main.innerHTML = `<div class="admin-container">
      <h2 class="admin__title admin__title-main">${currLangObj['admin__title-main']}</h2>
      <div class="admin__information_bank">
        <h3 class="admin__information_title bank_title">${currLangObj['bank_title']}</h3>
        <p class="admin__information_detail">
          <span class="admin__information_bank-account">${currLangObj['admin__information_bank-account']}</span> <span class="admin__information_account get-info">${currLangObj['get-info']}</span></p>
        <p class="admin__information_detail"><span class="admin__information_bank-money">${currLangObj['admin__information_bank-money']}</span> <span class="admin__information_money get-info">${currLangObj['get-info']}</span></p>
      </div>
      <h3 class="admin__information_title users_title">${currLangObj['users_title']}</h3>
      <button class="admin__information_button">${currLangObj['admin__information_button']}</button>
    </div>`;

    buildAdmin.showBankInfo();
    listenAdmin.showBankInfo();
  }
}

export const buildMain = new BuildMain();
