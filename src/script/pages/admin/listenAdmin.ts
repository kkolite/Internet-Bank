import config from '../../data/config';
import { EMethod } from '../../data/types';
import { adminFetch } from '../../fetch/adminFetch';
import { userFetch } from '../../fetch/userFetch';
import { buildMain } from '../../pages/main/buildMain';
import { buildAdmin } from './buildAdmin';
import { validate } from '../../utilities/validate';
import { validateAuth } from '../../pages/auth/verifyAuth';
import langs from '../../data/lang/admin/langs';

class ListenAdmin {
  showBankInfo() {
    const button = document.querySelector('.admin__information_button');

    if (!button) return;

    button.addEventListener('click', buildAdmin.showUserList);
  }

  showUserList() {
    const users = document.querySelectorAll('.admin__users_user');
    const create = document.querySelector('.user-create');
    const back = document.querySelector('.user-cancel');

    if (!users || !create || !back) return;

    users.forEach((user) => {
      user.addEventListener('click', async () => {
        buildAdmin.showUserData(user);
      });
    });

    create.addEventListener('click', buildAdmin.newUser);
    back.addEventListener('click', buildMain.admin);
  }

  lockUser(locked: boolean) {
    const lock = document.querySelector('.user-lock');
    const name = document.querySelector('.admimn__user_name');
    const token = localStorage.getItem('token');

    if (!lock || !name || !token) return;

    lock.addEventListener('click', async () => {
      const data = adminFetch.user(EMethod.PUT, token, name.innerHTML, undefined, undefined, locked);

      data.then((result) => {
        if (result.success) {
          buildAdmin.showUserData(name);
        }
      });
    });
  }

  deleteAccount() {
    const account = document.querySelector('.account-container');
    const username = document.querySelector('.admimn__user_name');
    const token = localStorage.getItem('token');
    const submit = document.querySelector('.admin__remove_button-submit');
    const cancel = document.querySelector('.admin__remove_button-cancel');
    const password = document.getElementById('rem-password');
    const note = document.querySelector('.admin__notification');

    if (!(password instanceof HTMLInputElement) || !account || !username || !token || !submit || !cancel || !note)
      return;

    cancel.addEventListener('click', () => (account.innerHTML = ''));

    const currLangObj = langs[config.lang];

    submit.addEventListener('click', () => {
      userFetch.checkPassword(password, token).then((rez) => {
        if (rez.success) {
          adminFetch.user(EMethod.DELETE, token, username.innerHTML).then((rez) => {
            if (rez.success) {
              buildAdmin.showUserList();
              this.showUserList();
            }
          });
        } else note.innerHTML = currLangObj['note-incorr-passw'];
      });
    });
  }

  showUserData() {
    const del = document.querySelector('.admin__user_button-remove');
    const back = document.querySelector('.admin__user_button-back');
    const lockButton = document.querySelector('.user-lock');
    if (!del || !back || !lockButton) return;

    del.addEventListener('click', () => {
      buildAdmin.deleteAccount();
      listenAdmin.deleteAccount();
    });

    back.addEventListener('click', () => {
      buildAdmin.showUserList();
      this.showUserList();
    });

    const currLangObj = langs[config.lang];

    if (lockButton.textContent === currLangObj['unlocked']) {
      this.lockUser(true);
    } else this.lockUser(false);
  }

  registration() {
    const note = document.querySelector('.reg__error');
    const auth = document.querySelector('.auth__container');
    const back = document.querySelector('.reg__button-back');
    const reg = document.querySelector('.reg__button-reg');
    const username = document.querySelector('.reg__username-input');
    const email = document.querySelector('.reg__email-input');
    const password = document.querySelector('.reg__password-input');
    const repPassword = document.querySelector('.repeat-reg__password-input');

    if (
      !note ||
      !(auth instanceof HTMLElement) ||
      !back ||
      !(reg instanceof HTMLElement) ||
      !(username instanceof HTMLInputElement) ||
      !(password instanceof HTMLInputElement) ||
      !(repPassword instanceof HTMLInputElement) ||
      !(email instanceof HTMLInputElement)
    )
      return;

    username.focus();

    username.addEventListener('blur', () => {
      validate(username, config.regex.username);
    });

    password.addEventListener('blur', () => {
      validate(password, config.regex.password);
    });

    repPassword.addEventListener('blur', () => {
      repPassword.classList.remove('invalid');
      if (repPassword.value !== password.value) {
        repPassword.classList.add('invalid');
      }
    });

    email.addEventListener('blur', () => {
      validate(email, config.regex.email);
    });

    back.addEventListener('click', () => {
      buildAdmin.showUserList();
      this.showUserList();
    });

    reg.addEventListener('click', async () => {
      if (!validateAuth.registrarion()) return;

      const currLangObj = langs[config.lang];

      await userFetch.regictration(username.value, password.value, email.value).then((result) => {
        if (result.success) {
          note.classList.remove('unsuccess');
          note.classList.add('success');
          note.innerHTML = `${currLangObj['create-succ']} Pin: ${result.pinCode}`;
          username.value = '';
          email.value = '';
          password.value = '';
          repPassword.value = '';
          setTimeout(() => {
            note.classList.remove('success');
            note.innerHTML = currLangObj['reg__error'];
          }, 5000);
          return;
        }

        note.classList.add('unsuccess');
        note.innerHTML = currLangObj['create-no'];
      });
    });
  }
}

export const listenAdmin = new ListenAdmin();
