import config from '../../data/config';
import { LANGS_ARR } from '../../data/constants';
import { ETheme } from '../../data/types';
import { createElem } from '../../utilities/payUtils';
import { switchLang } from '../../utilities/switchLang';
import langs from '../../data/lang/auth/langs';

let currentLang;

class BuildAuth {
  main() {
    const main = document.querySelector('.main-container');
    const body = document.querySelector('.main');
    const header = document.querySelector('header');
    currentLang = config.lang === 'en' ? langs.en : langs.ru;
    if (!main || !header || !body) return;

    header.classList.remove('header');
    header.innerHTML = '';

    body.classList.add('main-auth');

    main.className = 'container main-container';
    main.innerHTML = `<div class="auth">
		<h2 class="auth__h">${currentLang['auth__h']}</h2>
		<div class="auth__container"></div>`;

    const auth = document.querySelector('.auth');
    if (auth) {
      if (config.theme === ETheme.dark) auth.classList.add('auth-dark');
    }

    const langBlock = createElem('div', 'lang', main as HTMLElement);
    const langSelect = createElem('select', 'header__lang-select', langBlock) as HTMLSelectElement;
    LANGS_ARR.forEach((langStr) => {
      const langOptionElem = createElem('option', 'header__lang-option', langSelect, langStr) as HTMLOptionElement;
      langOptionElem.value = langStr;
      langOptionElem.selected = langStr === config.lang;
    });
    langSelect.oninput = () => switchLang(langSelect);
  }

  login() {
    const auth = document.querySelector('.auth__container');
    currentLang = config.lang === 'en' ? langs.en : langs.ru;
    if (!auth) return;

    this.removeClass(auth);
    auth.classList.add('login__container');
    auth.innerHTML = `<div class="login__username-container auth__block">
                    <label for="user" class="login__username-label">${currentLang['login__username-label']}</label>
                    <input type="text" name="" id="user" class="login__username-input auth__input">
                </div>
                <div class="login__password-container auth__block">
                    <label for="pass" class="login__password-label">${currentLang['login__password-label']}</label>
                    <input type="password" name="" id="pass" class="login__password-input auth__input">
                </div>
                <div class="login__button-container auth__button-container">
                    <button class="login__button-login auth__button">${currentLang['login__button-login']}</button>
                    <button class="login__button-anonim auth__button">${currentLang['login__button-anonim']}</button>
                </div>
                <p class="login__error auth__error"></p>
                <div class="login__links">
                    <p class="login__register">${currentLang['login__register']}</p>
                    <p class="login__reset">${currentLang['login__reset']}</p>
                </div>`;
  }

  registration() {
    const auth = document.querySelector('.auth__container');
    currentLang = config.lang === 'en' ? langs.en : langs.ru;
    if (!auth) return;

    this.removeClass(auth);
    auth.classList.add('reg__container');

    auth.innerHTML = `
                <div class="reg__username-container auth__block">
                    <label for="user" class="reg__username-label">${currentLang['reg__username-label']}</label>
                    <input type="text" name="" id="user" class="reg__username-input auth__input">
                </div>
                <div class="reg__email-container auth__block">
                    <label for="email" class="reg__email-label">${currentLang['reg__email-label']}</label>
                    <input type="email" name="" id="email" class="reg__email-input auth__input">
                </div>
                <div class="reg__password-container auth__block">
                    <label for="pass" class="reg__password-label">${currentLang['reg__password-label']}</label>
                    <input type="password" name="" id="pass" class="reg__password-input auth__input">
                </div>
                <div class="reg__repeat-password-container auth__block">
                    <label for="rep" class="repeat-reg__password-label">${currentLang['repeat-reg__password-label']}</label>
                    <input type="password" name="" id="rep" class="repeat-reg__password-input auth__input">
                </div>
								<div class="auth__button-container reg__button-container">
                	<button class="reg__button-reg auth__button">${currentLang['reg__button-reg']}</button>
                	<button class="reg__button-back auth__button">${currentLang['reg__button-back']}</button>
								</div>
                <p class="reg__error auth__error">${currentLang['reg__error']}</p>`;
  }

  afterRegistration() {
    const auth = document.querySelector('.auth__container');
    currentLang = config.lang === 'en' ? langs.en : langs.ru;
    if (!auth) return;

    this.removeClass(auth);
    auth.classList.add('after-reg__container');

    auth.innerHTML = `<p class="after-reg__text">${currentLang['after-reg__text']}</p>
            <p class="after-reg__code">Get pin fron server</p>
            <button class="after-reg__back auth__button">${currentLang['after-reg__back']}</button>`;
  }

  reset() {
    const auth = document.querySelector('.auth__container');
    currentLang = config.lang === 'en' ? langs.en : langs.ru;
    if (!auth) return;

    this.removeClass(auth);
    auth.classList.add('reset__container');

    auth.innerHTML = `<div class="reset__username-container auth__block">
                    <label for="user" class="reset__username-label">${currentLang['reset__username-label']}</label>
                    <input type="text" name="" id="user" class="reset__username-input auth__input">
                </div>
                <div class="reset__email-container auth__block">
                    <label for="email" class="reset__email-label">${currentLang['reset__email-label']}</label>
                    <input type="email" name="" id="email" class="reset__email-input auth__input">
                </div>
								<div class="auth__button-container">
                	<button class="reset__button-reset auth__button">${currentLang['reset__button-reset']}</button>
                	<button class="reset__button-back auth__button">${currentLang['reset__button-back']}</button>
								</div>
                <p class="reset__error auth__error"></p>`;
  }

  afterReset() {
    const auth = document.querySelector('.auth__container');
    currentLang = config.lang === 'en' ? langs.en : langs.ru;
    if (!auth) return;
    this.removeClass(auth);
    auth.classList.add('after-reset__container');
    auth.innerHTML = `<p class="after-reset__text">${currentLang['after-reset__text']}</p>
            <button class="after-reset__back auth__button">${currentLang['after-reset__back']}</button>`;
  }

  verify() {
    const auth = document.querySelector('.auth__container');
    currentLang = config.lang === 'en' ? langs.en : langs.ru;
    if (!auth) return;
    this.removeClass(auth);
    auth.classList.add('verify__container');

    auth.innerHTML = `<div class="verify__code-container auth__block">
                    <label for="cpde" class="verify__code-label">${currentLang['verify__code-label']}</label>
                    <input type="number" name="" id="code" class="verify__code-input auth__input">
                </div>
                <div class="verify__button-container auth__button-container">
                    <button class="verify__button-confirm auth__button">${currentLang['verify__button-confirm']}</button>
                    <button class="verify__button-back auth__button">${currentLang['verify__button-back']}</button>
                </div>
                <p class="verify__error auth__error"></p>`;
  }

  private removeClass(el: Element) {
    el.className = 'auth__container';
  }
}

export const buildAuth = new BuildAuth();
