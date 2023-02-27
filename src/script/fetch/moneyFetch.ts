import { ECurrency, EMethod, EOperation, ICommission, IExchangeRate, IMainRes } from '../data/types';
import Fetch from './mainFetch';

class MoneyFetch extends Fetch {
  async changeMainMoney(money: number, operation: EOperation, token: string, operationID: number) {
    const path = '/securemoney';
    const query = `?operation=${operation}`;
    const req = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ money, operationID }),
    };
    const result: IMainRes = await this.mainFetch(req, path, query);
    return result;
  }

  async transfer(money: number, toUsername: string, token: string) {
    const path = '/securemoney/transfer';
    const req = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        money,
        toUsername,
      }),
    };
    const result: IMainRes = await this.mainFetch(req, path);
    return result;
  }

  async moneyAccount(
    method: EMethod,
    username: string,
    currency: string,
    token: string,
    money?: number,
    operation?: EOperation
  ) {
    const path = '/securemoney/account';
    const query = operation ? `?operation=${operation}` : '';
    if (operation && method !== EMethod.PUT) {
      return {
        message: 'What operation?',
        success: false,
      };
    }
    const reqBody: any = {
      username,
      currency,
    };
    if (money) {
      reqBody.money = money;
    }
    const req = {
      method: `${method}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    };
    const result: IMainRes = await this.mainFetch(req, path, query);
    return result;
  }

  async commission(money: number, operationID: number) {
    const path = '/money/commission';
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        money,
        operationID,
      }),
    };
    const result: IMainRes | ICommission = await this.mainFetch(req, path);
    return result;
  }

  async anonimExchange(money: number, currencyOne: string, isClient?: boolean) {
    const path = '/money/exchange';
    const query = isClient ? '?client=true' : '';
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        money,
        currencyOne,
      }),
    };
    const result: IMainRes = await this.mainFetch(req, path, query);
    return result;
  }

  async clientExchange(money: number, currencyOne: string, currencyTwo: string, token: string) {
    const path = '/money/exchange';
    const query = '?client=true';
    const req = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        money,
        currencyOne,
        currencyTwo,
      }),
    };
    const result: IMainRes = await this.mainFetch(req, path, query);
    return result;
  }

  async sendCheckToEmail(money: number, operationID: number, email: string) {
    const path = '/money/check';
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        money,
        operationID,
        email,
      }),
    };
    const result: IMainRes = await this.mainFetch(req, path);
    return result;
  }

  async tryPayByCard(card: string) {
    const path = '/money/card';
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        card,
      }),
    };
    const result: IMainRes = await this.mainFetch(req, path);
    return result;
  }

  async exchangeRate(curr1: string = ECurrency.USD, curr2: string) {
    const res = await fetch(`https://api.api-ninjas.com/v1/exchangerate?pair=${curr1}_${curr2}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': 'w/DFGJ+sVb1SJ5tXWPlwNQ==D3zKc1k0KkSNzLvV',
      },
    });
    const data: IExchangeRate = await res.json();
    return data;
  }
}

export const moneyFetch = new MoneyFetch();
