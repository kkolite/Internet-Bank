import { EOperation, IGetStocks, IMainRes } from '../data/types';
import Fetch from './mainFetch';

class StocksFetch extends Fetch {
  async getData(token: string) {
    const path = '/stocks';
    const req = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const result: IGetStocks = await this.mainFetch(req, path);
    return result;
  }

  async buyOrSell(token: string, operation: EOperation, stockName: string, number: number) {
    const path = '/stocks';
    const query = `?operation=${operation}`;
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stockName,
        number,
      }),
    };
    const result: IMainRes = await this.mainFetch(req, path, query);
    return result;
  }
}

export default new StocksFetch();
