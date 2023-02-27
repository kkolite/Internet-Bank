import { IGetStatistics } from '../data/types';
import Fetch from './mainFetch';

class StatistickFetch extends Fetch {
  async operations() {
    const path = '/statistics';
    const req = {
      method: 'GET',
    };
    const result: IGetStatistics = await this.mainFetch(req, path);
    return result;
  }
}

export const statFetch = new StatistickFetch();
