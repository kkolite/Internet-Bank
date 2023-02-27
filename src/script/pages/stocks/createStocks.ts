import stocksFetch from '../../fetch/stocksFetch';
import { load } from '../../utilities/load';
import { transition } from '../../utilities/transition';
import buildStocks from './buildStocks';
import listenStocks from './listenStocks';

class CreateStocks {
  async main() {
    const main = document.querySelector('.main-container');
    const token = localStorage.getItem('token');
    if (!(main instanceof HTMLElement) || !token) return;

    window.scrollTo(0, 0);
    load(main);
    await stocksFetch.getData(token).then((result) => {
      transition(main, () => {
        buildStocks.main();

        buildStocks.buildUserList(result.userStocks, result.stocks);
        listenStocks.user();

        buildStocks.buildMarketList(result.stocks);
        listenStocks.market();
      });
    });
  }

  async user() {
    const token = localStorage.getItem('token');
    if (!token) return;

    await stocksFetch.getData(token).then((result) => {
      buildStocks.buildUserList(result.userStocks, result.stocks);
      listenStocks.user();
    });
  }
}

export default new CreateStocks();
