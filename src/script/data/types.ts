export enum EPages {
  ADMIN = 'admin',
  AUTH = 'login',
  ABOUT = 'about',
  SERVICES = 'services',
  STOCKS = 'stocks',
  ACCOUNT = 'account',
  QUIZ = 'quiz',
  STATISTICS = 'statistics',
  CARD_CREATOR = 'card',
}

export enum EOperation {
  ADD = 'add',
  REMOVE = 'remove',
}

export enum EMethod {
  POST = 'POST',
  GET = 'GET',
  DELETE = 'DELETE',
  PUT = 'PUT',
}

export enum EAdminInfo {
  DATABASE = 'database',
  BANK = 'bank',
}

export interface IMainRes {
  success: boolean;
  message: string;
}

export interface IAfterReg extends IMainRes {
  pinCode?: number;
}

export interface IUserConfig {
  username: string;
  money?: number;
  email?: string;
  isAdmin: boolean;
  isBlock: boolean;
}

export interface IUser extends IUserConfig {
  lastFive: {
    operationID: number;
    money: number;
    date: string;
  }[];
  accounts: ICurrency[];
  cards: string[];
}

export interface ICurrency {
  currency: string;
  money: number;
  _id: string;
}

export interface IVerify extends IMainRes {
  token?: string;
  userConfig?: IUserConfig;
}

export interface IUserInfo extends IMainRes {
  userConfig?: IUser;
}

export interface ICommission extends IMainRes {
  moneyPay: number;
  commission: number;
}

export interface IBankAccount {
  bankname: string;
  money: number;
}

export interface IBank extends IMainRes {
  bank: IBankAccount;
}

export interface IUserDatabase extends IMainRes {
  database: IUserConfig[];
}

export interface IStatistics {
  operationID: number;
  count: number;
  money: number;
}

export interface IGetStatistics extends IMainRes {
  result?: IStatistics[];
}

export interface IOperation {
  name: string;
  ruName: string;
  category: string;
  logo?: string;
}

export interface IOperationList {
  [index: number]: IOperation;
}

export interface IOperationRes extends IMainRes {
  operations?: IOperationList;
}

export interface IUserStocks {
  name: string;
  number: number;
  price: number;
}

export interface IMarketStocks {
  name: string;
  number: number;
  money: number;
}

export interface IGetStocks extends IMainRes {
  stocks: IMarketStocks[];
  userStocks: IUserStocks[];
}

export enum EAccountLinks {
  edit = 'edit',
  changePassword = 'Change password',
  delete = 'delete',
  currency = 'currency',
  account = 'Account',
}

export enum ETheme {
  dark = 'dark',
  light = 'light',
}

export interface IQuiz {
  id: number;
  question: IQuestion;
  answers: IAnswers;
  desc: IQuestion;
}

export interface IQuestion {
  ru: string;
  en: string;
}

export interface IAnswers {
  ru: string[];
  en: string[];
}

export interface IExchangeRate {
  currency_pair: string;
  exchange_rate: number;
}

export enum ECurrency {
  USD = 'USD',
  EUR = 'EUR',
  BYN = 'BYN',
  UAH = 'UAH',
}
