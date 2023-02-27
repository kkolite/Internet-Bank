import config from '../../data/config';
import { validate } from '../../utilities/validate';

class ValidateAuth {
  login() {
    const username = document.querySelector('.login__username-input');
    const password = document.querySelector('.login__password-input');

    if (!(username instanceof HTMLInputElement) || !(password instanceof HTMLInputElement)) return;

    return [validate(username, config.regex.username), validate(password, config.regex.password)].every((val) => val);
  }

  registrarion() {
    const username = document.querySelector('.reg__username-input');
    const email = document.querySelector('.reg__email-input');
    const password = document.querySelector('.reg__password-input');
    const repPassword = document.querySelector('.repeat-reg__password-input');

    if (
      !(username instanceof HTMLInputElement) ||
      !(password instanceof HTMLInputElement) ||
      !(email instanceof HTMLInputElement) ||
      !(repPassword instanceof HTMLInputElement)
    )
      return;

    return [
      validate(username, config.regex.username),
      validate(password, config.regex.password),
      validate(email, config.regex.email),
      repPassword.value === password.value,
    ].every((val) => val);
  }

  reset() {
    const username = document.querySelector('.reset__username-input');
    const email = document.querySelector('.reset__email-input');

    if (!(username instanceof HTMLInputElement) || !(email instanceof HTMLInputElement)) return;

    return [validate(username, config.regex.username), validate(email, config.regex.email)].every((val) => val);
  }
}

export const validateAuth = new ValidateAuth();
