import config from '../data/config';
import { IMarketStocks } from '../data/types';
import updateStocks from '../pages/stocks/updateStocks';

export function openWebSocket() {
  const socket = new WebSocket(`${config.wss}`);
  const checkConnection = setInterval(() => {
    const state = socket.readyState;
    if (state !== 3) return;

    clearInterval(checkConnection);
    openWebSocket();
  }, 10000);

  socket.onopen = () => {
    const key = localStorage.getItem('token') || 'anonim';
    socket.send(key);
  };

  socket.onmessage = (e) => {
    const data: IMarketStocks[] = JSON.parse(e.data);
    updateStocks(data);
  };
}
