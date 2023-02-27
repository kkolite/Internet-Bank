import { IMarketStocks } from '../../data/types';

export default function (data: IMarketStocks[]) {
  const market = document.querySelector('.stocks__market');
  const userList = document.querySelectorAll('.stocks__user-item');
  if (!(market instanceof HTMLElement)) return;

  data.forEach((stock) => {
    const item = market.querySelector(`.${stock.name.replaceAll(' ', '_')}`);
    if (!item) return;

    const price = item.querySelector('.stocks__market-price');
    const count = item.querySelector('.stocks__market-count');

    if (!(price instanceof HTMLElement) || !count) return;

    price.style.color = Number(price.textContent?.slice(1)) > stock.money ? 'red' : 'green';
    price.textContent = `$${stock.money.toFixed(3)}`;
    count.textContent = stock.number.toString();
  });

  userList.forEach((el) => {
    const stock = data.find((st) => el.id.replaceAll('_', ' ') === st.name);
    const profit = el.querySelector('.stock__user-profit');
    if (!stock || !(profit instanceof HTMLElement)) return;

    const benefit = stock.money - Number(profit.id);

    profit.textContent = `$${benefit.toFixed(3)}`;
    profit.style.color = benefit > 0 ? 'green' : 'red';
  });
}
