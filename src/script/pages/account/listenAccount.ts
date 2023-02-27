import { validate } from '../../utilities/validate';
import config from '../../data/config';
import { buildAuth } from '../auth/buildAuth';
import { createAuth } from '../auth/createAuth';
import { buildAccount } from './buildAccount';
import { userFetch } from '../../fetch/userFetch';
import { EMethod, ETheme } from '../../data/types';
import { moneyFetch } from '../../fetch/moneyFetch';
import langs from '../../data/lang/account/langs';
import pushState from '../../router/pushState';

class ListenAccount {
  main() {
    const tbody = document.querySelector('.account__operations_tbody');
    const trs = tbody?.querySelectorAll('tr');
    const buttonOperation = document.querySelector('.account__operations_button');
    const buttonOperations = document.querySelector('.account__alloperations_button');
    const token = localStorage.getItem('token');
    let id: number;
    let money: number;

    if (!buttonOperation || !buttonOperations || !token) return;

    buttonOperations.addEventListener('click', () => {
      const note = document.querySelector('.account__operations_process');
      if (!note) return;

      const currLangObj = langs[config.lang];

      note.innerHTML = currLangObj['connect-server'];
      fetch(`${config.server}/user/last`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then((result) => {
        result.json().then((res) => {
          if (res.success) {
            note.innerHTML = currLangObj['success'];
            setTimeout(() => (note.textContent = currLangObj['account__operations_process']), 4000);
          }
        });
      });
    });

    buttonOperation.addEventListener('click', () => {
      const note = document.querySelector('.account__operation_process');
      if (!note) return;

      const currLangObj = langs[config.lang];

      if (buttonOperation.classList.contains('account__operations_button-active')) {
        note.innerHTML = currLangObj['connect-server'];
        fetch(`${config.server}/money/check`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            money: money,
            operationID: id,
            email: config.currentEmail,
          }),
        }).then((result) => {
          result.json().then((res) => {
            if (res.success) {
              note.innerHTML = currLangObj['success'];
              setTimeout(() => {
                note.textContent = currLangObj['account__operation_process'];
                if (trs)
                  trs.forEach(
                    (tr) => (tr.style.backgroundColor = `${config.theme === ETheme.dark ? '#090909' : '#fffffc'}`)
                  );

                buttonOperation.classList.remove('account__operations_button-active');
              }, 4000);
            }
          });
        });
      }
    });

    if (trs) {
      trs.forEach((tr) => {
        tr.addEventListener('click', () => {
          const note = document.querySelector('.account__operation_process');
          if (!note) return;

          const currLangObj = langs[config.lang];
          note.innerHTML = currLangObj['ready_to_send'];
          trs.forEach((tr) => (tr.style.backgroundColor = `${config.theme === ETheme.dark ? '#090909' : '#fffffc'}`));
          tr.style.backgroundColor = 'grey';
          const tds = tr.querySelectorAll('td');
          if (!tds) return;
          id = +tds[2].innerHTML;
          money = +tds[3].innerHTML;
          buttonOperation.classList.add('account__operations_button-active');
        });
      });
    }
  }

  editAccount() {
    const accountName = document.querySelector('.account__link_name');
    const refreshName = document.getElementById('edit-user');
    const refreshEmail = document.getElementById('edit-email');
    const refreshPass = document.getElementById('edit-password');
    const refreshEPass = document.getElementById('email-password');
    const buttonSubmit = document.querySelector('.account__edit_button-submit');
    const buttonEmail = document.querySelector('.account__email_button-submit');
    const note = document.querySelector('.account__notification');
    const enote = document.querySelector('.account__notification_email');
    const token = localStorage.getItem('token');
    if (
      !token ||
      !accountName ||
      !buttonSubmit ||
      !buttonEmail ||
      !note ||
      !enote ||
      !(refreshName instanceof HTMLInputElement) ||
      !(refreshEmail instanceof HTMLInputElement) ||
      !(refreshEPass instanceof HTMLInputElement) ||
      !(refreshPass instanceof HTMLInputElement)
    )
      return;

    let valName: boolean;
    let valEmail: boolean;

    buttonEmail.addEventListener('click', async () => {
      valEmail = validate(refreshEmail, config.regex.email);
      const email = refreshEmail.value;

      if (!valEmail || !token) return;

      const currLangObj = langs[config.lang];

      enote.textContent = currLangObj['connect-server'];
      userFetch.user(EMethod.PUT, token, config.currentUser, email, refreshEPass.value).then((rez) => {
        if (rez.success) {
          config.currentEmail = email;
          enote.innerHTML = currLangObj['note-login-success'];
          refreshEPass.value = '';
        } else {
          enote.innerHTML = currLangObj['note-incorr-passw'];
          refreshEPass.value = '';
        }
      });
      setTimeout(() => (enote.textContent = currLangObj['ready_to_edit']), 4000);
    });

    buttonSubmit.addEventListener('click', async () => {
      valName = validate(refreshName, config.regex.username);
      const name = refreshName.value;

      if (!valName || !token) return;

      const currLangObj = langs[config.lang];

      note.textContent = currLangObj['connect-server'];
      userFetch.user(EMethod.PUT, token, name, config.currentEmail, refreshPass.value).then((rez) => {
        if (rez.success) {
          config.currentUser = name;
          note.innerHTML = currLangObj['note-login-success'];
          accountName.innerHTML = name;
          refreshPass.value = '';
        } else {
          note.innerHTML = currLangObj['something-wrong'];
          refreshPass.value = '';
        }
      });
      setTimeout(() => (note.textContent = currLangObj['ready_to_edit']), 4000);
    });
  }

  editPassword() {
    const oldPass = document.getElementById('password-oldpass');
    const newPass = document.getElementById('password-newpass');
    const confirmPass = document.getElementById('password-confirmpass');
    const buttonSubmit = document.querySelector('.account__password_button-submit');
    const note = document.querySelector('.account__notification_password');

    if (
      !note ||
      !buttonSubmit ||
      !(oldPass instanceof HTMLInputElement) ||
      !(newPass instanceof HTMLInputElement) ||
      !(confirmPass instanceof HTMLInputElement)
    )
      return;

    let valName: boolean;
    let valEmail: boolean;

    oldPass.addEventListener('blur', () => {
      valName = validate(oldPass, config.regex.password);
    });

    newPass.addEventListener('blur', () => {
      valEmail = validate(newPass, config.regex.password);
    });

    confirmPass.addEventListener('blur', () => {
      valEmail = validate(confirmPass, config.regex.password);
    });

    const token = localStorage.getItem('token');

    const currLangObj = langs[config.lang];

    buttonSubmit.addEventListener('click', async () => {
      const oldPassword = oldPass.value;
      const newPassword = newPass.value;
      const confirmPassword = confirmPass.value;
      if (!oldPassword || !newPassword || !confirmPassword || !token) return;

      if (newPassword !== confirmPassword) {
        note.innerHTML = currLangObj['note-diff-passw'];
        return;
      }
      note.textContent = currLangObj['connect-server'];

      userFetch.changePassword(token, newPassword, oldPassword).then((rez) => {
        if (rez.success) {
          note.innerHTML = currLangObj['note-passw-success'];
        } else note.innerHTML = currLangObj['note-incorr-passw'];
      });
      setTimeout(() => (note.textContent = currLangObj['ready_to_edit']), 4000);
    });
  }

  deleteAccount() {
    const buttonSubmit = document.querySelector('.account__remove_button-submit');
    const password = document.getElementById('remove-password');
    const note = document.querySelector('.account__notification');

    const token = localStorage.getItem('token');

    if (!token || !note || !buttonSubmit || !(password instanceof HTMLInputElement)) return;

    const currLangObj = langs[config.lang];

    buttonSubmit.addEventListener('click', async () => {
      const passwordValue: string = password.value;

      userFetch.checkPassword(password, token).then((rez) => {
        if (rez.success) {
          userFetch.user(EMethod.DELETE, token, undefined, undefined, passwordValue).then((rez) => {
            if (rez.success) {
              buildAuth.main();
              createAuth.login();
              pushState.login();
            }
          });
        } else note.innerHTML = currLangObj['note-incorr-passw'];
      });
    });
  }

  clarifyAccount() {
    const buttonSubmit = document.querySelector('.account__clarify_button-submit');
    if (!buttonSubmit) return;

    buttonSubmit.addEventListener('click', () => {
      buildAccount.deleteAccount();
      listenAccount.deleteAccount();
    });
  }

  currency() {
    const create = document.querySelector('.account__currency_operations-create');
    const del = document.querySelector('.account__currency_operations-delete');
    const createRadio = document.querySelector('.create-currency');
    const delRadio = document.querySelector('.delete-currency');

    if (!create || !del || !createRadio || !delRadio) return;

    create.addEventListener('click', () => {
      createRadio.classList.add('create-currency-active');
      delRadio.classList.remove('delete-currency-active');
      buildAccount.createCurrency();
      listenAccount.createCurrency();
    });

    del.addEventListener('click', () => {
      createRadio.classList.remove('create-currency-active');
      delRadio.classList.add('delete-currency-active');
      buildAccount.deleteCurrency();
      listenAccount.deleteCurrency();
    });
  }

  createCurrency() {
    const buttonSubmit = document.querySelector('.account__currency_button-submit');
    const currency = document.getElementById('account__currency_create-select');
    const note = document.querySelector('.account__notification');

    if (!note || !buttonSubmit || !(currency instanceof HTMLSelectElement)) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const currLangObj = langs[config.lang];

    buttonSubmit.addEventListener('click', async () => {
      note.textContent = currLangObj['connect-server'];
      const data = await moneyFetch.moneyAccount(EMethod.POST, config.currentUser, currency.value, token);

      if (!data.success) {
        note.innerHTML = `${currLangObj['already-have-start']} ${currency.value} ${currLangObj['already-have-end']}`;
      } else {
        note.innerHTML = currLangObj['success'];
        buildAccount.updateCurrency();
      }
      setTimeout(() => (note.textContent = currLangObj['ready_to']), 3000);
    });
  }

  deleteCurrency() {
    const buttonSubmit = document.querySelector('.account__currency_button-submit');
    const currency = document.getElementById('account__currency_delete-select');
    const note = document.querySelector('.account__notification');

    if (!note || !buttonSubmit || !(currency instanceof HTMLSelectElement)) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const currLangObj = langs[config.lang];

    buttonSubmit.addEventListener('click', async () => {
      note.textContent = currLangObj['connect-server'];
      const data = await moneyFetch.moneyAccount(EMethod.DELETE, config.currentUser, currency.value, token);

      if (!data.success) {
        note.innerHTML = `${currLangObj['dont-have-start']} ${currency.value} ${currLangObj['dont-have-end']}`;
      } else {
        note.innerHTML = currLangObj['success'];
        buildAccount.updateCurrency();
      }
      setTimeout(() => (note.textContent = currLangObj['ready_to']), 3000);
    });
  }
}

export const listenAccount = new ListenAccount();
