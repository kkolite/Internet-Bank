import { TOperationInputData } from '../models';

export const OPERATION_INPUT_DATA: TOperationInputData = {
  sum: [
    {
      name: 'sum',
      inputType: 'number',
      regex: `^\\d+(\\.\\d\\d)?$`,
      placeholder: '10.00',
      hint: {
        en: 'sum must be more than 0.00',
        ru: 'сумма должна быть больше 0.00',
      },
      labelText: {
        en: 'Sum',
        ru: 'Сумма',
      },
    },
  ],
  1: [
    {
      name: 'card',
      inputType: 'text',
      maxLeng: 19,
      regex: `\\d{4}\\s\\d{4}\\s\\d{4}\\s\\d{4}`,
      placeholder: '0000 0000 0000 0000',
      hint: {
        en: 'enter 16 digits',
        ru: 'введите 16 цифр',
      },
      labelText: {
        en: 'Card number to refill',
        ru: 'Номер карты для пополнения',
      },
    },
    {
      name: 'currency',
      inputType: 'select',
      optionDefalt: {
        en: 'Currency to withdraw',
        ru: 'Валюта для списания',
      },
      placeholder: '',
      hint: {
        en: '',
        ru: '',
      },
      labelText: {
        en: 'Card currency to withdraw',
        ru: 'Валюта карточки для списания',
      },
    },
  ],
  2: [
    {
      name: 'account',
      inputType: 'select',
      optionDefalt: {
        en: 'Account to withdraw',
        ru: 'Счет для списания',
      },
      placeholder: '',
      hint: {
        en: '',
        ru: '',
      },
      labelText: {
        en: 'Account number',
        ru: 'Номер счета',
      },
    },
    {
      name: 'account',
      inputType: 'select',
      optionDefalt: {
        en: 'Account to refill',
        ru: 'Счет для пополнения',
      },
      placeholder: '',
      hint: {
        en: '',
        ru: '',
      },
      labelText: {
        en: 'Account number',
        ru: 'Номер счета',
      },
    },
  ],
  5: [],
  6: [
    {
      name: 'card',
      inputType: 'text',
      maxLeng: 19,
      regex: `\\d{4}\\s\\d{4}\\s\\d{4}\\s\\d{4}`,
      placeholder: '0000 0000 0000 0000',
      hint: {
        en: 'enter 16 digits',
        ru: 'введите 16 цифр',
      },
      labelText: {
        en: 'Card number to refill',
        ru: 'Номер карты для пополнения',
      },
    },
  ],
  8: [
    {
      name: 'user',
      inputType: 'text',
      regex: `^.{2,}$`,
      placeholder: 'mikle123',
      hint: {
        en: 'enter username',
        ru: 'введите имя пользователя',
      },
      labelText: {
        en: 'Username for receiving funds',
        ru: 'Имя пользователя для получения средств',
      },
    },
  ],
  14: [
    {
      name: 'phone',
      inputType: 'text',
      regex: `^\\+\\d{9}\\d*`,
      placeholder: '+123456789',
      hint: {
        en: 'phone number must start with "+" and have minimum 9 digits',
        ru: 'номер телефона должен начинаться U+0063 "+" и содержать минимум 9 цифр',
      },
      labelText: {
        en: 'Phone number',
        ru: 'Номер телефона',
      },
    },
  ],
  15: [
    {
      name: 'contract',
      inputType: 'text',
      regex: `^\\d{9}\\d*`,
      placeholder: '123456789',
      hint: {
        en: 'contract number must have minimum 9 digits',
        ru: 'номер договора должен содержать минимум 9 цифр',
      },
      labelText: {
        en: 'Contract number',
        ru: 'Номер договора',
      },
    },
  ],
  16: [
    {
      name: 'contract',
      inputType: 'text',
      regex: `^\\d{9}\\d*`,
      placeholder: '123456789',
      hint: {
        en: 'contract number must have minimum 9 digits',
        ru: 'номер договора должен содержать минимум 9 цифр',
      },
      labelText: {
        en: 'Contract number',
        ru: 'Номер договора',
      },
    },
  ],
  17: [
    {
      name: 'account',
      inputType: 'text',
      regex: `^\\d{9}\\d*`,
      placeholder: '123456789',
      hint: {
        en: 'account number must have minimum 9 digits',
        ru: 'номер счета должен содержать минимум 9 цифр',
      },
      labelText: {
        en: 'Account number',
        ru: 'Номер счета',
      },
    },
  ],
  18: [
    {
      name: 'account',
      inputType: 'text',
      regex: `^\\d{9}\\d*`,
      placeholder: '123456789',
      hint: {
        en: 'account number must have minimum 9 digits',
        ru: 'номер счета должен содержать минимум 9 цифр',
      },
      labelText: {
        en: 'Account number',
        ru: 'Номер счета',
      },
    },
  ],
  19: [
    {
      name: 'account',
      inputType: 'text',
      regex: `^\\d{9}\\d*`,
      placeholder: '123456789',
      hint: {
        en: 'account number must have minimum 9 digits',
        ru: 'номер счета должен содержать минимум 9 цифр',
      },
      labelText: {
        en: 'Account number',
        ru: 'Номер счета',
      },
    },
  ],
  20: [
    {
      name: 'account',
      inputType: 'text',
      regex: `^\\d{9}\\d*`,
      placeholder: '123456789',
      hint: {
        en: 'account number must have minimum 9 digits',
        ru: 'номер счета должен содержать минимум 9 цифр',
      },
      labelText: {
        en: 'Account number',
        ru: 'Номер счета',
      },
    },
  ],
  21: [
    {
      name: 'account',
      inputType: 'text',
      regex: `^\\d{9}\\d*`,
      placeholder: '123456789',
      hint: {
        en: 'account number must have minimum 9 digits',
        ru: 'номер счета должен содержать минимум 9 цифр',
      },
      labelText: {
        en: 'Account number',
        ru: 'Номер счета',
      },
    },
  ],
  22: [
    {
      name: 'account',
      inputType: 'text',
      regex: `^\\d{9}\\d*`,
      placeholder: '123456789',
      hint: {
        en: 'account number must have minimum 9 digits',
        ru: 'номер счета должен содержать минимум 9 цифр',
      },
      labelText: {
        en: 'Account number',
        ru: 'Номер счета',
      },
    },
  ],
  23: [
    {
      name: 'account',
      inputType: 'text',
      regex: `^\\d{9}\\d*`,
      placeholder: '123456789',
      hint: {
        en: 'account number must have minimum 9 digits',
        ru: 'номер счета должен содержать минимум 9 цифр',
      },
      labelText: {
        en: 'Account number',
        ru: 'Номер счета',
      },
    },
  ],
  24: [
    {
      name: 'account',
      inputType: 'text',
      regex: `^\\d{9}\\d*`,
      placeholder: '123456789',
      hint: {
        en: 'account number must have minimum 9 digits',
        ru: 'номер счета должен содержать минимум 9 цифр',
      },
      labelText: {
        en: 'Account number',
        ru: 'Номер счета',
      },
    },
  ],
  25: [
    {
      name: 'account',
      inputType: 'text',
      regex: `^\\d{9}\\d*`,
      placeholder: '123456789',
      hint: {
        en: 'account number must have minimum 9 digits',
        ru: 'номер счета должен содержать минимум 9 цифр',
      },
      labelText: {
        en: 'Account number',
        ru: 'Номер счета',
      },
    },
  ],
  26: [
    {
      name: 'account',
      inputType: 'text',
      regex: `^\\d{9}\\d*`,
      placeholder: '123456789',
      hint: {
        en: 'account number must have minimum 9 digits',
        ru: 'номер счета должен содержать минимум 9 цифр',
      },
      labelText: {
        en: 'Account number',
        ru: 'Номер счета',
      },
    },
  ],
  27: [
    {
      name: 'account',
      inputType: 'text',
      regex: `^\\d{9}\\d*`,
      placeholder: '123456789',
      hint: {
        en: 'account number must have minimum 9 digits',
        ru: 'номер счета должен содержать минимум 9 цифр',
      },
      labelText: {
        en: 'Account number',
        ru: 'Номер счета',
      },
    },
  ],
  28: [
    {
      name: 'account',
      inputType: 'text',
      regex: `^\\d{9}\\d*`,
      placeholder: '123456789',
      hint: {
        en: 'account number must have minimum 9 digits',
        ru: 'номер счета должен содержать минимум 9 цифр',
      },
      labelText: {
        en: 'Account number',
        ru: 'Номер счета',
      },
    },
  ],
  29: [
    {
      name: 'account',
      inputType: 'text',
      regex: `^\\d{9}\\d*`,
      placeholder: '123456789',
      hint: {
        en: 'account number must have minimum 9 digits',
        ru: 'номер счета должен содержать минимум 9 цифр',
      },
      labelText: {
        en: 'Account number',
        ru: 'Номер счета',
      },
    },
  ],
};
