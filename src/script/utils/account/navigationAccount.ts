import { buildAccount } from './buildAccount';
import { listenAccount } from './listenAccount';

export function navigationAccount() {
  const nav = document.querySelectorAll('.account__list-item');

  if (!nav) return;

  nav.forEach((item) => {
    item.addEventListener('click', () => {
      if (item.textContent === 'Edit account') {
        buildAccount.editAccount();
        listenAccount.editAccount();
        return;
      }

      if (item.textContent === 'Edit password') {
        buildAccount.editPassword();
        listenAccount.editPassword();
        return;
      }

      if (item.textContent === 'Delete account') {
        buildAccount.clarifyAccount();
        listenAccount.clarifyAccount();
        return;
      }

      if (item.textContent === 'Currency') {
        buildAccount.currency();
        listenAccount.currency();
        return;
      }

      if (item.textContent === 'Last operations') {
        buildAccount.showLastOperations();
        //listenAccount.currency();
        return;
      }
    });
  });
}
