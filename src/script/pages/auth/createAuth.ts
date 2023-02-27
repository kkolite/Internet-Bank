import { buildAuth } from './buildAuth';
import { listenAuth } from './listenAuth';

class CreateAuth {
  login() {
    buildAuth.login();
    listenAuth.login();
  }

  reset() {
    buildAuth.reset();
    listenAuth.reset();
  }

  registration() {
    buildAuth.registration();
    listenAuth.registration();
  }

  verify() {
    buildAuth.verify();
    listenAuth.verify();
  }

  afterRegistration() {
    buildAuth.afterRegistration();
    listenAuth.afterRegistration();
  }

  afterReset() {
    buildAuth.afterReset();
    listenAuth.afterReset();
  }
}

export const createAuth = new CreateAuth();
