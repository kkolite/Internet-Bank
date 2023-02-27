import config from '../../data/config';
import { IOperationRes, IStatistics } from '../../data/types';
import langs from '../../data/lang/statistics/langs';

let currentLang;

class BuildStatistics {
  operations(arr: IStatistics[], res: IOperationRes) {
    const main = document.querySelector('.main-container');
    currentLang = config.lang === 'en' ? langs.en : langs.ru;
    if (!main) return;

    main.innerHTML = '';
    main.className = 'main-container container';

    const container = document.createElement('div');
    container.classList.add('stat');

    const totalCount = document.createElement('p');
    totalCount.innerHTML = `
    <span class="stat__total-oper">${currentLang['stat__total-oper']}</span>
    <span>${arr.reduce((acc, el) => acc + el.count, 0)}</span>`;

    const totalMoney = document.createElement('p');
    totalMoney.innerHTML = `
    <span class="stat__total-money">${currentLang['stat__total-money']}</span>
    <span>$${arr.reduce((acc, el) => acc + el.money, 0).toFixed(2)}</span>`;

    const total = document.createElement('div');
    total.appendChild(totalCount);
    total.appendChild(totalMoney);

    arr.forEach((el) => {
      const operations = res.operations;
      if (!operations) return;
      currentLang = config.lang === 'en' ? langs.en : langs.ru;

      const operation = operations[el.operationID];

      const operationName = document.createElement('p');
      operationName.classList.add('stat__operation-p', 'stat__operation-name');
      operationName.textContent = config.lang === 'en' ? operation.name : operation.ruName;
      operationName.setAttribute('runame', operation.ruName);
      operationName.setAttribute('enname', operation.name);

      const operationCount = document.createElement('p');
      operationCount.classList.add('stat__operation-p');
      operationCount.innerHTML = `<span class="stat__operation-count">${currentLang['stat__operation-count']}</span>
      <span>${el.count}</span>`;

      const operationMoney = document.createElement('p');
      operationMoney.classList.add('stat__operation-p', 'stat__operation-money');
      operationMoney.innerHTML = `<span class="stat__operation-money-t">${currentLang['stat__operation-money-t']}</span>
      <span>$${el.money.toFixed(2)}</span>`;

      const operationContainer = document.createElement('div');
      operationContainer.classList.add('stat__operation');
      operationContainer.appendChild(operationName);
      operationContainer.appendChild(operationCount);
      operationContainer.appendChild(operationMoney);

      container.appendChild(operationContainer);
    });
    main.appendChild(total);
    main.appendChild(container);
  }
}

export const buildStatistics = new BuildStatistics();
