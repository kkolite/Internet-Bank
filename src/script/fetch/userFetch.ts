import config from '../data/config';
import { EMethod, IAfterReg, IMainRes, IOperationRes, IUserInfo, IVerify } from '../data/types';
import Fetch from './mainFetch';

class UserFetch extends Fetch {
  async regictration(username: string, password: string, email: string) {
    const path = '/action/registration';
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        email,
      }),
    };
    const result: IAfterReg = await this.mainFetch(req, path);
    return result;
  }

  async login(username: string, password: string) {
    const path = '/action/login';
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    };
    const result: IMainRes = await this.mainFetch(req, path);
    return result;
  }

  async verify(username: string, code: number) {
    const path = '/action/verify';
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        code,
      }),
    };
    const result: IVerify = await this.mainFetch(req, path);
    return result;
  }

  async reset(username: string, email: string) {
    const path = '/action/reset';
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
      }),
    };
    const result: IMainRes = await this.mainFetch(req, path);
    return result;
  }

  async isOurUser(username: string) {
    const path = '/action/check';
    const query = `?username=${username}`;
    const req = {
      method: 'GET',
    };
    const result: IMainRes = await this.mainFetch(req, path, query);
    return result;
  }

  async user(method: EMethod, token: string, username?: string, email?: string, password?: string) {
    const path = '/user';
    const req: any = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    if (method === EMethod.PUT) {
      req.body = JSON.stringify({
        username: username,
        currentPassword: password,
        email: email,
        password: password,
      });
    }
    if (method === EMethod.DELETE) {
      req.body = JSON.stringify({
        password: password,
      });
    }
    const result: IUserInfo = await this.mainFetch(req, path);
    return result;
  }

  async changePassword(token: string, password?: string, currentPassword?: string) {
    const path = '/user';
    const req = {
      method: EMethod.PUT,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: currentPassword,
        password: password,
      }),
    };
    const result: IUserInfo = await this.mainFetch(req, path);
    return result;
  }

  async saveCard(link: string, token: string) {
    const path = '/user/card';
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        link,
      }),
    };
    const result: IMainRes = await this.mainFetch(req, path);
    return result;
  }

  async services() {
    const path = '/action/services';
    const req = {
      method: 'GET',
    };
    const result: IOperationRes = await this.mainFetch(req, path);
    return result;
  }

  async checkPassword(element: HTMLInputElement, token: string) {
    const password = element.value;

    const data = await fetch(`${config.server}/action/login`, {
      method: EMethod.POST,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: config.currentUser,
        password: password,
      }),
    });

    return data.json();
  }
}

export const userFetch = new UserFetch();
