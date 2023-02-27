import { buildAccount } from './buildAccount';
import { listenAccount } from './listenAccount';
import pushState from '../../router/pushState';
import { EAccountLinks } from '../../data/types';

export function navigationAccount() {
  const nav = document.querySelectorAll('.account__list-item');

  if (!nav) return;

  nav.forEach((item) => {
    item.addEventListener('click', () => {
      nav.forEach((el) => el.classList.remove('account__list-item_active'));
      item.classList.add('account__list-item_active');

      if (item.classList.contains('account__list-edit')) {
        buildAccount.editAccount();
        listenAccount.editAccount();
        listenAccount.editPassword();
        pushState.account(EAccountLinks.edit);
        return;
      }

      if (item.classList.contains('account__list-delete')) {
        buildAccount.clarifyAccount();
        listenAccount.clarifyAccount();
        pushState.account(EAccountLinks.delete);
        return;
      }

      if (item.classList.contains('account__list-currency')) {
        buildAccount.currency();
        listenAccount.currency();
        pushState.account(EAccountLinks.currency);
        return;
      }

      if (item.classList.contains('account__list-main')) {
        buildAccount.main();
        navigationAccount();
        pushState.account();
        return;
      }
    });
  });
}
