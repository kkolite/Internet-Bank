export default {
  server: 'http://127.0.0.1:3000',
  wss: 'ws://127.0.0.1:8000',
  currentUser: '',
  currentEmail: '',
  userMoney: 0,
  lang: 'en',
  page: '',
  theme: 'light',
  regex: {
    username: '^[a-zA-Z0-9]+$',
    password: '^[a-zA-Z0-9]{8,20}$',
    email: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
  },
};
