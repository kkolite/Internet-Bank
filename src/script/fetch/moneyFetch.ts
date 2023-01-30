import { ICommission, IMainRes, TMethod, TOperation } from "../data/types";
import Fetch from "./mainFetch";

class MoneyFetch extends Fetch {
    async changeMainMoney(money: number, operation: TOperation, token: string) {
        const path = '/money';
        const query = `?operation=${operation}`;
        const req = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({money})
        }
        const result: IMainRes = await this.mainFetch(req, path, query);
        return result;
    }

    async transfer(money: number, toUsername: string, token: string) {
        const path = '/money/transfer';
        const req = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                money,
                toUsername
            })
        }
        const result: IMainRes = await this.mainFetch(req, path);
        return result;
    }

    async moneyAccount(username: string, currency: string, method: TMethod, token: string, money?: number, operation?: TOperation,) {
        const path = '/money/account';
        const query = operation ? `?operation=${operation}` : '';
        if (operation && method !== 'PUT') {
            return;
        }
        const reqBody: any = {
            username,
            currency
        }
        if (money) {
            reqBody.money = money;
        }
        const req = {
            method: `${method}`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(reqBody)
        }
        const result: IMainRes = await this.mainFetch(req, path, query);
        return result;
    }

    async commission(money: number, operationID: number) {
        const path = '/money/commission';
        const req = {
            method: 'POST',
            body: JSON.stringify({
                money,
                operationID
            })
        }
        const result: IMainRes | ICommission = await this.mainFetch(req, path);
        return result;
    }

    async anonimExchange(money: number, currencyOne: string) {
        const path = '/money/exchange';
        const req = {
            method: 'POST',
            body: JSON.stringify({
                money,
                currencyOne
            })
        }
        const result: IMainRes = await this.mainFetch(req, path);
        return result;
    }

    async clientExchange(money: number, currencyOne: string, currencyTwo: string, token: string) {
        const path = '/money/exchange';
        const query = '?client=true';
        const req = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                money,
                currencyOne,
                currencyTwo
            })
        }
        const result: IMainRes = await this.mainFetch(req, path, query);
        return result;
    }
}

export const moneyFetch = new MoneyFetch();