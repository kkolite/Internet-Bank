import config from '../../data/config';
import {
  FOREIGN_CURRENCY,
  ID_CURRENCY_COMMON_EXCHANGE,
  ID_REFILL_SERVICE,
  ID_REMOVE_SERVICE,
  ID_TRANSFER_SERVICE,
  INDEX_START_BANK_SERVICES,
  INDEX_START_SERVICES,
  MAIN_CURRENCY,
  OPERATION_INPUT_DATA,
} from '../../data/constants';
import { TElemsForUpdateText, TInputData, TPaymentDetails, TServiceDetails } from '../../data/models';
import { createElem } from '../../utilities/payUtils/createElem';
import { validate } from '../../utilities/validate';
import { modalPayment } from './modalPayment';
import { renderPayment } from './renderPayment';
import { transition } from '../../utilities/transition';
import { userFetch } from '../../fetch/userFetch';
import { EMethod, ETheme, IExchangeRate } from '../../data/types';
import pushState from '../../router/pushState';
import { load } from '../../utilities/load';
import langs from '../../data/lang/payment/langs';
import { moneyFetch } from '../../fetch/moneyFetch';

class RenderPaymentDetails {
  main = document.querySelector('.main-container') as HTMLElement;
  elemsForUpdatingText: TElemsForUpdateText = {};
  currentOperationData: TServiceDetails | null = null;
  canPay = false;

  async renderPayment(operationId: number): Promise<void> {
    load(this.main);
    this.canPay = false;

    if (!renderPayment.canRenderPage) {
      await renderPayment.saveServicesResponse.call(renderPayment);
    }

    const isAnonim = !localStorage.getItem('token');

    const toRenderPayment = renderPayment.checkServiceIdForUserStatus(isAnonim, operationId);
    if (!toRenderPayment) {
      transition(this.main, renderPayment.renderPaymentsPage.bind(renderPayment));
    }

    this.currentOperationData = renderPayment.getOparationData(operationId);
    if (!this.currentOperationData) return;

    const currLangObj = langs[config.lang];

    this.main.innerHTML = '';
    this.main.className = 'container main-container';
    window.scrollTo(0, 0);
    const operation = createElem('div', 'operation', this.main);

    const backBtnBlock = createElem('div', 'operation__back back', operation);
    const backBtn = createElem('button', 'back__btn', backBtnBlock);
    createElem('div', 'back__arrow', backBtn);
    if (config.theme === ETheme.dark) {
      createElem('div', 'back__text page-dark', backBtn, currLangObj.back__text);
    } else {
      createElem('div', 'back__text', backBtn, currLangObj.back__text);
    }
    backBtn.onclick = () => this.backToAllServices();

    const operationInfo = createElem('div', 'operation__info', operation);

    const operationImgBlock = createElem('div', 'operation__img', operationInfo);
    const logo = this.currentOperationData.logo;
    if (logo) {
      operationImgBlock.style.backgroundColor = 'transparent';
      operationImgBlock.style.backgroundImage = `url(${logo})`;
    }

    const operationMain = createElem('div', 'operation__main', operationInfo);
    const operationName = createElem('p', 'operation__title', operationMain);
    this.elemsForUpdatingText.title = operationName;

    const operationCategory = createElem('p', 'operation__category', operationMain);
    createElem('span', 'operation__category-text', operationCategory, currLangObj['operation__category-text']);
    const categotyTxt = this.currentOperationData.category[config.lang];
    const categotyType = createElem('span', 'operation__category-type', operationCategory, categotyTxt);
    this.elemsForUpdatingText[`category_${operationId}`] = categotyType;

    const operationBlock = createElem('div', 'operation__block', operation);
    this.renderService(operationId, operationBlock);

    if (operationId === INDEX_START_BANK_SERVICES || operationId === ID_CURRENCY_COMMON_EXCHANGE) {
      this.renderExchRates(operationBlock);
    }

    this.updatePaymentText();
  }

  renderService(operationId: number, operationContainer: HTMLElement): void {
    const payDetails = createElem('div', 'operation__details');
    const payForm = createElem('form', 'operation__form form-paym', payDetails) as HTMLFormElement;
    payForm.name = `${operationId}`;

    this.renderInput('sum', payForm);
    this.renderInput(`${operationId}`, payForm);

    const currLang = langs[config.lang];

    if (!localStorage.getItem('token')) {
      const isCommissExchange = operationId === INDEX_START_BANK_SERVICES;
      const commissionClassName = isCommissExchange ? 'operation__commission-exch' : 'operation__commission';
      const comissionText = currLang[commissionClassName];

      createElem('div', commissionClassName, payDetails, comissionText);
    } else if (operationId !== INDEX_START_BANK_SERVICES && operationId !== ID_REFILL_SERVICE) {
      const btnPay = createElem('button', 'form-paym__btn btn-colored unable', payDetails, currLang['form-paym__btn']);
      this.elemsForUpdatingText.btnPay = btnPay;
      btnPay.onclick = (e) => this.pay(e, payForm, operationId);
    }

    if (
      operationId !== ID_CURRENCY_COMMON_EXCHANGE &&
      operationId !== ID_REMOVE_SERVICE &&
      operationId !== ID_TRANSFER_SERVICE
    ) {
      const btnText = currLang[`form-paym__btn-card`];
      const btnPayByCard = createElem('button', 'form-paym__btn-card btn-colored unable', payDetails, btnText);
      this.elemsForUpdatingText.btnPayCard = btnPayByCard;
      btnPayByCard.onclick = (e) => this.payByCard(e, payForm, operationId);
    }

    operationContainer.append(payDetails);
  }

  pay(e: Event, payForm: HTMLFormElement, operationId: number): void {
    e.preventDefault();
    if (!this.canPay) return;
    const formElemsArr = Array.from(payForm.elements);
    const sumInput = formElemsArr.find((elem) => elem.id.split('_')[0] === 'sum');
    const operationSum = +(sumInput as HTMLInputElement).value;
    const paymentDetails: TPaymentDetails = { operationSum, operationId };

    this.saveSelectElemsToDetails(paymentDetails, formElemsArr);

    const userNameInput = formElemsArr.find((elem) => (elem as HTMLInputElement).name === 'user');
    if (userNameInput) {
      paymentDetails.userTo = (userNameInput as HTMLInputElement).value;
    }
    this.renderAnonimPayment(paymentDetails, false, true);
  }

  payByCard(e: Event, payForm: HTMLFormElement, operationId: number): void {
    e.preventDefault();
    if (!this.canPay) return;
    const formElemsArr = Array.from(payForm.elements);
    const sumInput = formElemsArr.find((elem) => elem.id.split('_')[0] === 'sum');
    const operationSum = +(sumInput as HTMLInputElement).value;
    const isAnonim = !localStorage.getItem('token');
    const paymentDetails: TPaymentDetails = { operationSum, operationId };

    this.saveSelectElemsToDetails(paymentDetails, formElemsArr);
    this.renderAnonimPayment(paymentDetails, isAnonim);
  }

  checkInputsValidity(payForm: HTMLFormElement): void {
    this.checkBtnsAbility(false);
    const formElemsArr = Array.from(payForm.elements);

    const canPay = formElemsArr.every((inputEl) => {
      const inputId = inputEl.id.split('_');
      if (!inputId.length) return true;

      if (inputId[0] === 'sum' && +(inputEl as HTMLInputElement).value <= 0) {
        if (!inputEl.classList.contains('invalid')) {
          inputEl.classList.add('invalid');
        }
        return false;
      } else if ((+inputId[0] === 1 || +inputId[0] === 2) && inputEl instanceof HTMLSelectElement) {
        return !!(inputEl as HTMLSelectElement).selectedIndex;
      } else {
        if ((+inputId[0] === 1 || +inputId[0] === 6) && (inputEl as HTMLInputElement).name === 'card') {
          modalPayment.maskCardNumber.call(inputEl);
        }

        const inputPattern = (inputEl as HTMLInputElement).pattern;
        if (!inputPattern) return true;

        return validate(inputEl as HTMLInputElement, inputPattern);
      }
    });

    const userNameInput = payForm.user as HTMLInputElement;
    if (userNameInput && userNameInput.value) {
      this.checkUserInput(userNameInput, canPay);
      return;
    }

    this.canPay = canPay;

    const selectElemsArr = formElemsArr.filter((inputEl) => {
      return inputEl instanceof HTMLSelectElement;
    });
    if (selectElemsArr.length > 1) {
      this.checkOptions(selectElemsArr as HTMLSelectElement[]);
    }

    this.checkBtnsAbility(this.canPay);
  }

  updatePaymentText(): void {
    if (!this.currentOperationData) return;

    Object.keys(this.elemsForUpdatingText).forEach((key) => {
      const [elemType, operationId, inputIdx] = key.split('_');
      const elem = this.elemsForUpdatingText[key];

      switch (elemType) {
        case 'title':
          {
            const keyForText = config.lang === 'en' ? 'name' : 'ruName';
            elem.textContent = this.currentOperationData?.[keyForText] || '';
          }
          break;
        case 'input':
          if (+operationId < INDEX_START_SERVICES) break;
          elem.title = OPERATION_INPUT_DATA[operationId][+inputIdx].hint[config.lang];
          break;
        case 'label':
          elem.textContent = OPERATION_INPUT_DATA[operationId][+inputIdx].labelText[config.lang];
          break;
        case 'category':
          if (!this.currentOperationData) break;
          elem.textContent = this.currentOperationData.category[config.lang];
          break;
        default:
          break;
      }
    });
  }

  renderAnonimPayment(paymentDetails: TPaymentDetails, isAnonim: boolean, isNotCard?: boolean): void {
    modalPayment.renderModalPayment(paymentDetails, isAnonim, !!isNotCard);
  }

  backToAllServices(): void {
    const main = document.querySelector('.main') as HTMLElement;
    transition(main, renderPayment.renderPaymentsPage.bind(renderPayment));
    pushState.services();
  }

  renderInput(inputType: string, formElem: HTMLFormElement): void {
    const inputsData = OPERATION_INPUT_DATA[inputType];

    inputsData.forEach((inputData, i) => {
      const dataBlock = createElem('div', 'operation__form-block form-data');
      const dataLabel = createElem('label', 'form-data__label form-paym__label', dataBlock) as HTMLLabelElement;
      if (inputType === 'sum' && formElem.name !== '2') {
        createElem('div', 'operation__currency', dataBlock) as HTMLLabelElement;
      }

      const tagElemName = inputData.inputType === 'select' ? 'select' : 'input';
      const dataInput = createElem(tagElemName, 'form-paym__input', dataBlock);
      const inputId = `${inputType}_${i}`;
      dataInput.id = dataLabel.htmlFor = inputId;

      if (inputData.inputType === 'select') {
        (dataInput as HTMLSelectElement).name = `${i}`;
        this.renderOptions(inputData, dataInput as HTMLSelectElement);
      } else {
        const inpType = inputData.inputType;
        (dataInput as HTMLInputElement).type = inpType;
        (dataInput as HTMLInputElement).required = true;
        (dataInput as HTMLInputElement).placeholder = inputData.placeholder;
        (dataInput as HTMLInputElement).name = inputData.name;
        const pattern = inputData.regex;
        if (pattern) {
          (dataInput as HTMLInputElement).pattern = pattern;
        }
        const maxLeng = inputData.maxLeng;
        if (maxLeng) {
          (dataInput as HTMLInputElement).maxLength = maxLeng;
        }
      }

      this.elemsForUpdatingText[`input_${inputId}`] = dataInput;
      this.elemsForUpdatingText[`label_${inputId}`] = dataLabel;

      dataInput.addEventListener('input', () => this.checkInputsValidity(formElem));

      if (inputData.name === 'user') {
        dataInput.addEventListener('blur', () => this.checkInputsValidity(formElem));
      }

      formElem.append(dataBlock);
    });
  }

  renderOptions(inputData: TInputData, selectElem: HTMLSelectElement): void {
    const isAnonimExchange = inputData.name === 'currency';

    const optionDefaultText = inputData.optionDefalt;
    if (optionDefaultText) {
      this.renderOption(optionDefaultText[config.lang], selectElem, isAnonimExchange, true);
    }

    if (isAnonimExchange) {
      FOREIGN_CURRENCY.forEach((currency) => {
        this.renderOption(currency, selectElem, isAnonimExchange);
      });
    } else {
      this.renderOption(MAIN_CURRENCY, selectElem, isAnonimExchange);

      const token = localStorage.getItem('token') || '';

      userFetch.user(EMethod.GET, token).then((resp) => {
        resp.userConfig?.accounts.forEach((userCurrencyAcc) => {
          this.renderOption(userCurrencyAcc.currency, selectElem, isAnonimExchange);
        });
      });
    }
  }

  renderOption(currency: string, selectElem: HTMLSelectElement, isAnonimExchange: boolean, isDefault?: boolean): void {
    const option = createElem('option', `form-paym__option`, selectElem) as HTMLOptionElement;
    let clasName: string;

    if (isDefault) {
      clasName = isAnonimExchange ? `option-default-anonim` : `option-default-${selectElem.id}`;
      option.disabled = true;
    } else {
      clasName = isAnonimExchange ? `option-anonim_${currency}` : `option_${currency}`;
      option.value = currency;
    }

    option.classList.add(`${clasName}`);
    option.textContent = langs[config.lang][clasName];
  }

  checkOptions(selectElemsArr: HTMLSelectElement[]): void {
    selectElemsArr.forEach((selectEl) => {
      const selectedOption = (selectEl as HTMLSelectElement).value;
      const idxSelectEl = +(selectEl as HTMLSelectElement).name;
      const otherSelectElemsArr = selectElemsArr.filter((selectElem) => {
        return +(selectElem as HTMLSelectElement).name !== idxSelectEl;
      });

      otherSelectElemsArr.forEach((otherSelectElem) => {
        const optionsArr = Array.from((otherSelectElem as HTMLSelectElement).options);
        optionsArr.forEach((optionElem, i) => {
          if (!i) return;
          optionElem.disabled = optionElem.value === selectedOption;
        });
      });
    });
  }

  saveSelectElemsToDetails(paymentDetails: TPaymentDetails, formElemsArr: Element[]): void {
    const formSelectElemsArr = formElemsArr.filter((elem) => elem instanceof HTMLSelectElement);
    if (formSelectElemsArr.length) {
      const selectValuesArr = formSelectElemsArr.map((elem) => (elem as HTMLSelectElement).value);
      if (formSelectElemsArr.length === 2) {
        paymentDetails.currFrom = selectValuesArr[0];
        paymentDetails.currTo = selectValuesArr[1];
      } else {
        paymentDetails.currTo = selectValuesArr[0];
      }
    }
  }

  checkBtnsAbility(canPay: boolean): void {
    const btnsArr = [];
    const buttonPayCard = this.elemsForUpdatingText.btnPayCard;
    if (buttonPayCard) {
      btnsArr.push(buttonPayCard);
    }
    const buttonPay = this.elemsForUpdatingText.btnPay;
    if (buttonPay) {
      btnsArr.push(buttonPay);
    }

    btnsArr.forEach((btnElem) => {
      if (canPay) {
        btnElem.classList.remove('unable');
      } else {
        if (btnElem.classList.contains('unable')) return;
        btnElem.classList.add('unable');
      }
    });
  }

  checkUserInput(userNameInput: HTMLInputElement, canPay: boolean): void {
    const focusedElem = document.activeElement;
    const isUserInputFocused = focusedElem === userNameInput;

    if (isUserInputFocused || userNameInput.value === config.currentUser) {
      this.canPay = false;
      this.checkBtnsAbility(this.canPay);
      return;
    }

    userNameInput.disabled = true;
    userFetch.isOurUser(userNameInput.value).then((resp) => {
      userNameInput.disabled = false;
      this.canPay = canPay ? resp.success : canPay;

      this.checkBtnsAbility(this.canPay);
    });
  }

  renderExchRates(containerEl: HTMLElement): void {
    const ratesBlock = createElem('div', 'operation__exch-rates');

    load(ratesBlock);
    const loadingCircle = ratesBlock.querySelector('.load') as HTMLElement;
    loadingCircle.style.height = '400px';

    const allCurrencyArr = [MAIN_CURRENCY, ...FOREIGN_CURRENCY];
    const exchangeRatesPromisesArr = [];

    for (let i = 0; i < allCurrencyArr.length; i++) {
      const currencyFrom = allCurrencyArr[i];

      for (let j = i + 1; j < allCurrencyArr.length; j++) {
        const currencyTo = allCurrencyArr[j];
        exchangeRatesPromisesArr.push(moneyFetch.exchangeRate(currencyFrom, currencyTo));
      }
    }

    containerEl.append(ratesBlock);

    Promise.all(exchangeRatesPromisesArr).then((responsesArr) => {
      ratesBlock.innerHTML = '';
      const table = createElem('table', 'operation__exch-rates-table rates-table', ratesBlock);
      this.renderExchRatesTable(responsesArr, table);
    });
  }

  renderExchRatesTable(responsesArr: IExchangeRate[], table: HTMLElement): void {
    const currLangObj = langs[config.lang];

    const tableHead = createElem('thead', 'rates-table__head', table);
    const thCurrFrom = createElem('th', 'rates-table__th th-curr-from', tableHead, currLangObj['th-curr-from']);
    const thCurrTo = createElem('th', 'rates-table__th th-curr-to', tableHead, currLangObj['th-curr-to']);
    const thRate = createElem('th', 'rates-table__th th-rate', tableHead, currLangObj['th-rate']);

    if (config.theme === ETheme.dark) {
      thCurrFrom.classList.add('table-dark');
      thCurrTo.classList.add('table-dark');
      thRate.classList.add('table-dark');
    }

    responsesArr.forEach((ratesResp) => {
      const [currFrom, currTo] = ratesResp.currency_pair.split('_');

      const tableRow = createElem('tr', 'rates-table__tr', table);
      const tdCurrFrom = createElem('td', 'rates-table__td', tableRow, currFrom);
      const tdCurrTo = createElem('td', 'rates-table__td', tableRow, currTo);
      const tdRate = createElem('td', 'rates-table__td', tableRow, ratesResp.exchange_rate.toFixed(2));

      if (config.theme === ETheme.dark) {
        tdCurrFrom.classList.add('table-dark');
        tdCurrTo.classList.add('table-dark');
        tdRate.classList.add('table-dark');
      }
    });
  }
}

export const renderPaymentDetails = new RenderPaymentDetails();
