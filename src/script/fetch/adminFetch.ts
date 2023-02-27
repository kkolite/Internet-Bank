import { IMainRes, IBank, IUserDatabase, IUserInfo, EMethod, EAdminInfo } from '../data/types';
import Fetch from './mainFetch';

class AdminFetch extends Fetch {
  async check(token: string) {
    const path = '/admin';
    const req = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const result: IMainRes = await this.mainFetch(req, path);
    return result;
  }

  async getInfo(token: string, info: EAdminInfo, bankname?: string) {
    const path = `/admin/${info}`;
    const query = bankname ? `?bankname=${bankname}` : '';
    const req = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const result: IBank | IUserDatabase | IMainRes = await this.mainFetch(req, path, query);
    return result;
  }

  async user(method: EMethod, token: string, username: string, password?: string, email?: string, isBlock?: boolean) {
    const path = '/admin/user';
    const query = method === EMethod.GET ? `?username=${username}` : '';
    const req: any = {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    if (method === EMethod.POST) {
      req.body = {
        username,
        password,
        email,
      };
    }
    if (method === EMethod.PUT) {
      req.body = JSON.stringify({
        username: username,
        isBlock: isBlock,
      });
    }
    if (method === EMethod.DELETE) {
      req.body = JSON.stringify({
        username: username,
      });
    }
    const result: IMainRes | IUserInfo = await this.mainFetch(req, path, query);
    return result;
  }
}

export const adminFetch = new AdminFetch();
