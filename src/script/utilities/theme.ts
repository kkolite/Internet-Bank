import config from '../data/config';
import { ETheme } from '../data/types';

export function switchTheme() {
  const body = document.querySelector('.page');
  const header = document.querySelector('.header');
  const footerLogo = document.querySelector('.footer__logo');
  const author = document.querySelector('.footer__authors');
  const backTxt = document.querySelector('.back__text');
  const td = document.querySelectorAll('td');
  const th = document.querySelectorAll('th');
  const nav = document.querySelector('.header__nav');

  if (config.theme === ETheme.dark) {
    if (backTxt) backTxt.classList.add('page-dark');
    if (body) body.classList.add('page-dark');
    if (footerLogo) footerLogo.classList.add('footer__logo-dark');
    if (author) author.classList.add('footer__authors-dark');
    if (header) header.classList.add('page-dark');
    if (nav) nav.classList.add('page-dark');

    td.forEach((el) => el.classList.add('table-dark'));
    th.forEach((el) => el.classList.add('table-dark'));
  } else {
    if (backTxt) backTxt.classList.remove('page-dark');
    if (body) body.classList.remove('page-dark');
    if (footerLogo) footerLogo.classList.remove('footer__logo-dark');
    if (author) author.classList.remove('footer__authors-dark');
    if (header) header.classList.remove('page-dark');
    if (nav) nav.classList.remove('page-dark');

    td.forEach((el) => el.classList.remove('table-dark'));
    th.forEach((el) => el.classList.remove('table-dark'));
  }
}
