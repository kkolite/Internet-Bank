import config from '../../data/config';
import { userFetch } from '../../fetch/userFetch';
import { load } from '../../utilities/load';
import { createMain } from '../main/createMain';
import { transition } from '../../utilities/transition';
import { validate } from '../../utilities/validate';
import { createAuth } from './createAuth';
import { validateAuth } from './verifyAuth';

class ListenAuth {
  private backToLogin(back: Element, auth: HTMLElement) {
    back.addEventListener('click', () => {
      transition(auth, createAuth.login);
    });
  }

  login() {
    const register = document.querySelector('.login__register');
    const reset = document.querySelector('.login__reset');
    const auth = document.querySelector('.auth__container');
    const login = document.querySelector('.login__button-login');
    const anonim = document.querySelector('.login__button-anonim');
    const username = document.querySelector('.login__username-input');
    const password = document.querySelector('.login__password-input');
    const page = document.querySelector('.page');

    if (
      !reset ||
      !register ||
      !(auth instanceof HTMLElement) ||
      !(page instanceof HTMLElement) ||
      !(login instanceof HTMLElement) ||
      !anonim ||
      !(username instanceof HTMLInputElement) ||
      !(password instanceof HTMLInputElement)
    )
      return;

    username.focus();

    username.addEventListener('blur', () => {
      validate(username, config.regex.username);
    });

    password.addEventListener('blur', () => {
      validate(password, config.regex.password);
    });

    reset.addEventListener('click', () => {
      transition(auth, createAuth.reset);
    });

    register.addEventListener('click', () => {
      transition(auth, createAuth.registration);
    });

    anonim.addEventListener('click', () => {
      transition(page, createMain.afterLogin);
    });

    login.addEventListener('click', async () => {
      const currUsername = username.value;
      if (!validateAuth.login()) return;
      load(auth);

      await userFetch.login(username.value, password.value).then((result) => {
        if (result.success) {
          transition(auth, createAuth.verify);
          config.currentUser = currUsername;
          return;
        }

        transition(auth, () => {
          createAuth.login();
          const errorLabel = document.querySelector('.login__error');
          const username = document.querySelector('.login__username-input');
          const isEnglish = config.lang === 'en';
          if (!errorLabel || !(username instanceof HTMLInputElement)) return;

          errorLabel.textContent = isEnglish ? result.message : 'Ошибка! Неверно введенные данные';
          username.value = currUsername;
        });
      });
    });

    document.addEventListener('keyup', (e) => {
      if (e.code !== 'Enter') return;
      const reset = document.querySelector('.reset__button-reset');
      const login = document.querySelector('.login__button-login');
      const reg = document.querySelector('.reg__button-reg');
      const verify = document.querySelector('.verify__button-confirm');

      if (reset instanceof HTMLElement) reset.click();
      if (login instanceof HTMLElement) login.click();
      if (reg instanceof HTMLElement) reg.click();
      if (verify instanceof HTMLElement) verify.click();
    });
  }

  reset() {
    const auth = document.querySelector('.auth__container');
    const back = document.querySelector('.reset__button-back');
    const reset = document.querySelector('.reset__button-reset');
    const username = document.querySelector('.reset__username-input');
    const email = document.querySelector('.reset__email-input');

    if (
      !(auth instanceof HTMLElement) ||
      !back ||
      !(reset instanceof HTMLElement) ||
      !(username instanceof HTMLInputElement) ||
      !(email instanceof HTMLInputElement)
    )
      return;

    username.focus();

    username.addEventListener('blur', () => {
      validate(username, config.regex.username);
    });

    email.addEventListener('blur', () => {
      validate(email, config.regex.email);
    });

    this.backToLogin(back, auth);

    reset.addEventListener('click', async () => {
      if (!validateAuth.reset()) return;
      load(auth);
      await userFetch.reset(username.value, email.value).then((result) => {
        if (result.success) {
          transition(auth, createAuth.afterReset);
          return;
        }

        transition(auth, () => {
          createAuth.reset();
          const errorLabel = document.querySelector('.reset__error');
          const isEnglish = config.lang === 'en';
          if (!errorLabel) return;

          errorLabel.textContent = isEnglish ? result.message : 'Ошибка! Неверно введенные данные';
        });
      });
    });
  }

  afterReset() {
    const auth = document.querySelector('.auth__container');
    const back = document.querySelector('.after-reset__back');

    if (!(auth instanceof HTMLElement) || !back) return;

    this.backToLogin(back, auth);
  }

  registration() {
    const auth = document.querySelector('.auth__container');
    const back = document.querySelector('.reg__button-back');
    const reg = document.querySelector('.reg__button-reg');
    const username = document.querySelector('.reg__username-input');
    const email = document.querySelector('.reg__email-input');
    const password = document.querySelector('.reg__password-input');
    const repPassword = document.querySelector('.repeat-reg__password-input');

    if (
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

    this.backToLogin(back, auth);

    reg.addEventListener('click', async () => {
      if (!validateAuth.registrarion()) return;
      load(auth);
      await userFetch.regictration(username.value, password.value, email.value).then((result) => {
        if (result.success) {
          transition(auth, () => {
            createAuth.afterRegistration();
            const code = document.querySelector('.after-reg__code');
            if (!code) return;
            code.textContent = `${result.pinCode}`;
          });
          return;
        }

        transition(auth, () => {
          createAuth.registration();
          const errorLabel = document.querySelector('.reg__error');
          const isEnglish = config.lang === 'en';
          if (!errorLabel) return;

          errorLabel.textContent = isEnglish ? result.message : 'Ошибка! Такой пользователь уже существует';
        });
      });
    });
  }

  afterRegistration() {
    const auth = document.querySelector('.auth__container');
    const back = document.querySelector('.after-reg__back');

    if (!(auth instanceof HTMLElement) || !back) return;

    this.backToLogin(back, auth);
  }

  verify() {
    const auth = document.querySelector('.auth__container');
    const page = document.querySelector('.page');
    const back = document.querySelector('.verify__button-back');
    const confirm = document.querySelector('.verify__button-confirm');
    const input = document.querySelector('.verify__code-input');

    if (
      !(auth instanceof HTMLElement) ||
      !(input instanceof HTMLInputElement) ||
      !(page instanceof HTMLElement) ||
      !back ||
      !(confirm instanceof HTMLElement)
    )
      return;

    input.focus();
    this.backToLogin(back, auth);

    confirm.addEventListener('click', async () => {
      if (!input.value.length) return;
      load(auth);
      await userFetch.verify(config.currentUser, +input.value).then((result) => {
        const isEnglish = config.lang === 'en';
        if (result.success) {
          if (result.userConfig?.isBlock) {
            transition(auth, () => {
              createAuth.verify();
              const errorLabel = document.querySelector('.verify__error');
              if (!errorLabel) return;

              errorLabel.textContent = `${
                isEnglish ? 'You are blocked. Please, contact with us.' : 'Вы заблокирвоаны. Свяжитесь с нами.'
              }`;
            });
          }
          if (result.token && result.userConfig?.money) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('money', `${result.userConfig.money}`);
            localStorage.setItem('username', result.userConfig.username);
          }
          transition(page, createMain.afterLogin);
          return;
        }

        transition(auth, () => {
          createAuth.verify();
          const errorLabel = document.querySelector('.verify__error');
          if (!errorLabel) return;

          errorLabel.textContent = isEnglish ? result.message : 'Неверный код!';
        });
      });
    });
  }
}

export const listenAuth = new ListenAuth();
