import { statFetch } from '../../fetch/statistickFetch';
import { userFetch } from '../../fetch/userFetch';
import { buildStatistics } from './buildStatistics';
import { load } from '../../utilities/load';
import { transition } from '../../utilities/transition';

class CreateStatistics {
  async operations() {
    const main = document.querySelector('.main-container');
    if (!(main instanceof HTMLElement)) return;

    load(main);
    const operations = await userFetch.services();
    const data = await statFetch.operations();
    const stats = data.result;
    if (!stats) return;
    transition(main, () => {
      buildStatistics.operations(stats, operations);
      window.scrollTo(0, 0);
    });
  }
}

export const createStatistics = new CreateStatistics();