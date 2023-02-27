import { buildAuth } from '../../pages/auth/buildAuth';
import { listenAdmin } from './listenAdmin';
import config from '../../data/config';
import yes from '../../../assets/img/icons/ok.svg';
import no from '../../../assets/img/icons/cancel.svg';
import { ETheme } from '../../data/types';
import { load } from '../../utilities/load';
import langs from '../../data/lang/admin/langs';

class BuildAdmin {
  async showUserList() {
    const admin = document.querySelector('.admin-container');
    const token = localStorage.getItem('token');
    if (!(admin instanceof HTMLElement) || !token) return;

    load(admin);

    const data = (
      await fetch(`${config.server}/admin/database`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    ).json();

    const currLangObj = langs[config.lang];

    data.then((result) => {
      admin.innerHTML = `<div class="admin__users">
        <h2 class="admin__title admin__users_title">${currLangObj[`admin__users_title`]}</h2>
        <p class="admin__instraction">${currLangObj['admin__instraction']}</p>
        <table class="admin__users_table">
        <thead><tr><th>#</th><th class="admin__users_name">${
          currLangObj['admin__users_name']
        }</th><th>Email</th><th class="admin__users_block">${currLangObj['admin__users_block']}</th></tr></thead>
        <tbody class="admin__users_tbody"></tbody>
        </table>
        <div class="admin__users_buttons">
          <button class="edit__button-create user-create">${currLangObj['edit__button-create']}</button>
          <button class="edit__button-cancel user-cancel">${currLangObj['edit__button-cancel']}</button>
        </div>
      </div>`;

      const tbody = <Element>document.querySelector('.admin__users_tbody');

      for (let i = 0; i < result.safeDatabase.length; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${i + 1}</td>
        <td class="admin__users_user">${result.safeDatabase[i].username}</td>
        <td>${result.safeDatabase[i].email}</td>
        <td>${
          result.safeDatabase[i].isBlock
            ? `<img src="${yes}" alt="ok" class="blocked">`
            : `<img src="${no}" alt="cancel" class="blocked">`
        }</td>`;

        tbody.appendChild(row);
      }

      const td = document.querySelectorAll('td');
      const th = document.querySelectorAll('th');

      if (config.theme === ETheme.dark) {
        td.forEach((el) => el.classList.add('table-dark'));
        th.forEach((el) => el.classList.add('table-dark'));
      }
      listenAdmin.showUserList();
    });
  }

  async showUserData(user: Element) {
    const admin = document.querySelector('.admin-container');
    const token = localStorage.getItem('token');
    if (!(admin instanceof HTMLElement) || !token) return;

    load(admin);
    const data = (
      await fetch(`${config.server}/admin/user?username=${user.textContent}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    ).json();

    const currLangObj = langs[config.lang];

    data.then((result) => {
      admin.innerHTML = `<div class="admin__user">
      <h2 class="admin__title admimn__user_name">${result.userConfig.username}</h2>
      <p class="admin__user_info"> E-mail: ${result.userConfig.email}</p>
      <p class="admin__user_info">
        <span class="admin__user_info-admin">${currLangObj['admin__user_info-admin']}</span>
        <span class="is-${result.userConfig.isAdmin ? 'yes' : 'no'}">${
        result.userConfig.isAdmin ? currLangObj['is-yes'] : currLangObj['is-no']
      }</span>
      </p>
      <p class="admin__user_info">
        <span class="admin__user_info-block">${currLangObj['admin__user_info-block']}</span>
        <span class="is-${result.userConfig.isBlock ? 'yes' : 'no'}">${
        result.userConfig.isBlock ? currLangObj['is-yes'] : currLangObj['is-no']
      }</span>
      </p>
      <h3 class="admin__user_operations-title">${currLangObj['admin__user_operations-title']}</h3>
      <table class="admin__user_operations">
        <thead><tr><th>#</th><th class="admin__user_date">${
          currLangObj['admin__user_date']
        }</th><th class="admin__user_operation">${
        currLangObj['admin__user_operation']
      }</th><th class="admin__user_money">${currLangObj['admin__user_money']}</th></tr></thead>
        <tbody class="admin__user_tbody"></tbody>
      </table>
      <div class="admin__user_buttons">
        <button class="admin__user_button-lock user-lock ${result.userConfig.isBlock ? 'locked' : 'unlocked'}">${
        result.userConfig.isBlock ? currLangObj['locked'] : currLangObj['unlocked']
      }</button>
        <button class="admin__user_button-remove">${currLangObj['admin__user_button-remove']}</button>
        <button class="admin__user_button-back">${currLangObj['admin__user_button-back']}</button>
      </div>
      <div class="account-container"></div>
      </div>`;

      const tbody = <Element>document.querySelector('.admin__user_tbody');

      for (let i = 0; i < result.userConfig.lastFive.length; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${i + 1}</td>
        <td>${result.userConfig.lastFive[i].date.slice(0, 10)}</td>
        <td>${result.userConfig.lastFive[i].operationID}</td>
        <td>${result.userConfig.lastFive[i].money.toFixed(2)}</td>`;

        tbody.appendChild(row);
      }

      const td = document.querySelectorAll('td');
      const th = document.querySelectorAll('th');

      if (config.theme === ETheme.dark) {
        td.forEach((el) => el.classList.add('table-dark'));
        th.forEach((el) => el.classList.add('table-dark'));
      }

      listenAdmin.showUserData();
    });
  }

  async showBankInfo() {
    const account = document.querySelector('.admin__information_account');
    const money = document.querySelector('.admin__information_money');
    if (!account || !money) return;

    const token = localStorage.getItem('token');

    const data = (
      await fetch(`${config.server}/admin/bank`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    ).json();

    data.then((result) => {
      account.innerHTML = result.bank.name;
      money.innerHTML = `$${(+result.bank.money).toFixed(2)}`;
    });
  }

  newUser() {
    const admin = document.querySelector('.admin-container');
    if (!admin) return;

    const currLangObj = langs[config.lang];

    admin.innerHTML = `<h2 class="admin__title admin__create_title">${currLangObj['admin__create_title']}</h2>
    <div class="auth__container auth__container-center"><div>`;

    buildAuth.registration();

    const container = document.querySelector('.auth__container');
    if (container) container.classList.add('auth__container-center');

    const button = document.querySelector('.reg__button-reg');
    if (button) button.innerHTML = currLangObj['reg__button-reg-create'];
    button?.classList.add('reg__button-reg-create');

    listenAdmin.registration();
  }

  deleteAccount() {
    const account = document.querySelector('.account-container');
    if (!account) return;

    const currLangObj = langs[config.lang];

    account.innerHTML = `<p class="admin__remove_question">${currLangObj['admin__remove_question']}</p>
      <div class="admin__remove">
        <input type="password" name="remove" id="rem-password" class="admin__remove-input">
      </div>
      <div class="admin__buttons">
        <button class="button-submit admin__remove_button-submit">${currLangObj['admin__remove_button-submit']}</button>
        <button class="button-cancel admin__remove_button-cancel">${currLangObj['admin__remove_button-cancel']}</button>
      </div>
      <p class="admin__notification"></p>`;
  }
}

export const buildAdmin = new BuildAdmin();
