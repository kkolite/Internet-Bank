export default {
  server: 'https://internet-bank-server-production.up.railway.app',
  wss: 'wss://internet-bank-server-production.up.railway.app',
  //server: 'http://localhost:3000',
  //wss: 'ws://localhost:3000',
  currentUser: '',
  currentEmail: '',
  userMoney: 0,
  lang: 'en',
  page: '',
  theme: 'light',
  regex: {
    username: '^[a-zA-Z0-9]{2,20}$',
    password: '^[a-zA-Z0-9]{8,20}$',
    email: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
  },
  loading: false,
};
