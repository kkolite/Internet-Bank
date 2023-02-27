import config from '../../data/config';
import langs from '../../data/lang/account/langs';
import { EMethod, ETheme } from '../../data/types';
import { userFetch } from '../../fetch/userFetch';
import pushState from '../../router/pushState';
import { load } from '../../utilities/load';
import { buildMain } from '../main/buildMain';
import { renderPaymentDetails } from '../payment/renderPaymentDetails';
import { listenAccount } from './listenAccount';

class BuildAccount {
  async main() {
    buildMain.account();
    const cards = document.querySelector('.account__cards');
    const token = localStorage.getItem('token');

    if (!cards || !token) return;

    const data = userFetch.user(EMethod.GET, token);
    data.then((rez) => {
      if (rez.userConfig?.cards) {
        for (let i = 0; i < rez.userConfig?.cards.length; i++) {
          const element = document.createElement('img');
          element.classList.add('account__cards_card');
          element.setAttribute('src', rez.userConfig?.cards[i]);
          element.setAttribute('alt', 'card');

          cards.appendChild(element);
        }
      }
    });

    const tbody = <HTMLElement>document.querySelector('.account__operations_tbody');
    tbody.style.position = 'relative';
    load(tbody);

    const loading = document.querySelector('.load');
    if (!(loading instanceof HTMLElement)) return;
    loading.style.height = '100px';
    loading.style.width = '100%';
    loading.style.position = 'absolute';
    loading.style.top = '20px';
    loading.style.left = '50%';
    loading.style.transform = 'translateX(-50%)';

    const operations = await userFetch.user(EMethod.GET, token);
    if (!operations.userConfig) return;

    tbody.innerHTML = '';
    for (let i = 0; i < operations.userConfig.lastFive.length; i++) {
      const row = document.createElement('tr');
      row.classList.add('cursor');
      row.innerHTML = `<td>${i + 1}</td>
      <td>${operations.userConfig.lastFive[i].date.slice(0, 10)}</td>
      <td>${operations.userConfig.lastFive[i].operationID}</td>
      <td>${operations.userConfig.lastFive[i].money.toFixed(2)}</td>`;

      tbody.appendChild(row);
    }

    const currLangObj = langs[config.lang];

    if (!operations.userConfig.lastFive.length) {
      const table = document.querySelector('.account__operations_table');
      if (!table) return;

      table.innerHTML = `<p class="table-empty">${currLangObj['table-empty']}</p>`;
    }

    const td = document.querySelectorAll('td');
    const th = document.querySelectorAll('th');

    if (config.theme === ETheme.dark) {
      td.forEach((el) => el.classList.add('table-dark'));
      th.forEach((el) => el.classList.add('table-dark'));
    }

    listenAccount.main();
  }

  editAccount() {
    const account = document.querySelector('.account-container');
    if (!account) return;

    const currLangObj = langs[config.lang];

    account.innerHTML = `<div id="account__edit">
        <h2 class="account__edit_title">${currLangObj['account__edit_title']}</h2>
        <div id="account__edit_username">
          <label for="user" class="account__edit_username-label">${currLangObj['account__edit_username-label']}</label>
          <input type="text" name="user" id="edit-user" class="account__edit_username-input" value="${config.currentUser}">
        </div>
        <div id="account__edit_password">
          <label for="password" class="account__edit_password-label">${currLangObj['account__edit_password-label']}</label>
          <input type="password" name="password" id="edit-password" class="account__edit_password-input">
        </div>
        <div class="account__buttons">
          <button class="account__edit_button-submit button-submit">${currLangObj['account__edit_button-submit']}</button>
        </div>
        <p class="account__notification ready_to_edit">${currLangObj['ready_to_edit']}</p>
      </div>

      <div id="account__email">
        <h2 class="account__email_title">${currLangObj['account__email_title']}</h2>
        <div id="account__edit_email">
          <label for="email" class="account__edit_email-label">${currLangObj['account__edit_email-label']}</label>
          <input type="email" name="email" id="edit-email" class="account__edit_email-input" value="${config.currentEmail}">
        </div>
        <div id="account__email_password">
          <label for="epassword" class="account__email_password-label">${currLangObj['account__email_password-label']}</label>
          <input type="password" name="epassword" id="email-password" class="account__email_password-input">
        </div>
        <div class="account__buttons">
          <button class="account__email_button-submit button-submit">${currLangObj['account__email_button-submit']}</button>
        </div>
        <p class="account__notification_email ready_to_edit">${currLangObj['ready_to_edit']}</p>
      </div>

      <div id="account__password">
      <h2 class="account__password_title">${currLangObj['account__password_title']}</h2>
      <div id="account__password_oldpassword">
        <label for="oldpass" class="account__password_oldpassword-label">${currLangObj['account__password_oldpassword-label']}</label>
        <input type="password" name="oldpass" id="password-oldpass" class="account__password_oldpassword-input">
      </div>
      <div id="account__password_newpassword">
        <label for="newpass" class="account__password_newpassword-label">${currLangObj['account__password_newpassword-label']}</label>
        <input type="password" name="newpass" id="password-newpass" class="account__password_newpassword-input">
      </div>
      <div id="account__password_confirmpassword">
        <label for="confirmpass" class="account__password_confirmpassword-label">${currLangObj['account__password_confirmpassword-label']}</label>
        <input type="password" name="confirmpass" id="password-confirmpass" class="account__password_confirmpassword-input">
      </div>
      <div class="account__buttons">
        <button class="account__password_button-submit button-submit">${currLangObj['account__password_button-submit']}</button>
      </div>
      <p class="account__notification_password ready_to_edit">${currLangObj['ready_to_edit']}</p>
      </div>`;
  }

  clarifyAccount() {
    const account = document.querySelector('.account-container');
    if (!account) return;

    const currLangObj = langs[config.lang];

    account.innerHTML = `<p class="account__clarify_question">${currLangObj['account__clarify_question']}</p>
      <div class="account__buttons">
        <button class="account__clarify_button-submit button-submit">${currLangObj['account__clarify_button-submit']}</button>
      </div>`;
  }

  deleteAccount() {
    const account = document.querySelector('.account-container');
    if (!account) return;

    const currLangObj = langs[config.lang];

    account.innerHTML = `<p class="account__remove_question">${currLangObj['account__remove_question']}</p>
      <div class="account__remove">
        <input type="password" name="remove" id="remove-password" class="account__remove-input">
      </div>
      <div class="account__buttons">
        <button class="account__remove_button-submit button-submit">${currLangObj['account__remove_button-submit']}</button>
        <button class="account__remove_button-cancel button-cancel">${currLangObj['account__remove_button-cancel']}</button>
      </div>
      <p class="account__notification del__notification"></p>`;
  }

  currency() {
    const account = document.querySelector('.account-container');
    if (!account) return;

    const currLangObj = langs[config.lang];

    account.innerHTML = `<h4 class="account__currency_title">${currLangObj['account__currency_title']}</h4>
    <div class="account__currency_operations">
      <div class="account__currency_operations-create"><span class="create-currency"></span><span class="create-currency-text">${currLangObj['create-currency-text']}</span></div>
      <div class="account__currency_operations-delete"><span class="delete-currency"></span><span class="delete-currency-text">${currLangObj['delete-currency-text']}</span></div>
    </div>
    <div class="account__currency">
      <div class="account__buttons">
      </div>
    </div>
    <div class="account__currency_current"></div>`;
    this.updateCurrency();
  }

  updateCurrency() {
    const currencyAccount = document.querySelector('.account__currency_current');
    const token = localStorage.getItem('token');
    if (!(currencyAccount instanceof HTMLElement) || !token) return;

    currencyAccount.style.height = '100px';
    load(currencyAccount);

    const currLangObj = langs[config.lang];

    const loading = document.querySelector('.load');
    if (!(loading instanceof HTMLElement)) return;
    loading.style.height = '100px';

    userFetch.user(EMethod.GET, token).then((res) => {
      if (!res.userConfig) return;
      currencyAccount.innerHTML = '';
      currencyAccount.style.height = '';

      const header = document.createElement('h4');
      header.textContent = currLangObj['account__currency_current-h'];
      header.classList.add('account__currency_current-h');
      currencyAccount.appendChild(header);

      if (!res.userConfig.accounts.length) return;
      for (let i = 0; i < res.userConfig.accounts.length; i++) {
        const elem = document.createElement('p');
        elem.classList.add('account__currency_current-p');
        elem.innerHTML = `${res.userConfig.accounts[i].currency}: ${res.userConfig.accounts[i].money.toFixed(2)}`;
        currencyAccount.appendChild(elem);
      }

      const button = document.createElement('button');
      button.classList.add('account__currency-button');
      button.textContent = currLangObj['account__currency-button'];
      button.onclick = () => {
        const account = document.querySelector('.header__nav-account');
        const services = document.querySelector('.header__nav-services');
        if (!account || !services) return;

        account.classList.remove('header__nav_active');
        services.classList.add('header__nav_active');
        renderPaymentDetails.renderPayment(2);
        pushState.services('2');
      };
      currencyAccount.appendChild(button);
    });
  }

  createCurrency() {
    const account = document.querySelector('.account__currency');
    if (!account) return;

    const currLangObj = langs[config.lang];

    account.innerHTML = `<div id="account__currency_create">
      <div id="account__currency_create-container">
        <label class="account__currency_create-label">${currLangObj['account__currency_create-label']}</label>
        
        <select id="account__currency_create-select" class="account__currency_create-input">
          <option value="EUR" selected>EUR</option>
          <option value="GBP">GBP</option>
          <option value="BYN">BYN</option>
          <option value="UAH">UAH</option>
        </select>
      </div>
      <div class="account__buttons">
        <button class="account__currency_button-submit button-submit">${currLangObj['account__currency_button-submit']}</button>
      </div>
      <p class="account__notification ready_to">${currLangObj['ready_to']}</p>
      </div>`;
  }

  deleteCurrency() {
    const account = document.querySelector('.account__currency');
    if (!account) return;

    const currLangObj = langs[config.lang];

    account.innerHTML = `<div id="account__currency_delete">
      <div id="account__currency_delete-container">
        <label class="account__currency_delete-label">${currLangObj['account__currency_delete-label']}</label>
          
        <select id="account__currency_delete-select" class="account__currency_delete-input">
          <option value="EUR" selected>EUR</option>
          <option value="GBP">GBP</option>
          <option value="BYN">BYN</option>
          <option value="UAH">UAH</option>
        </select>
      </div>
      <div class="account__buttons">
        <button class="account__currency_button-submit button-submit">${currLangObj['account__currency_button-submit']}</button>
      </div>
      <p class="account__notification ready_to">${currLangObj['ready_to']}</p>
      </div>`;
  }
}

export const buildAccount = new BuildAccount();
