import { calculateCommissionSum, createElem } from '../../utilities/payUtils/index';
import { renderPayment } from './renderPayment';
import invoiceCard from '../../../assets/img/payment-system/invoice.png';
import americanExpressCard from '../../../assets/img/payment-system/american-express.png';
import visaCard from '../../../assets/img/payment-system/visa.png';
import mastercardCard from '../../../assets/img/payment-system/mastercard.png';
import { EPaymSyst, TElemsForUpdateText, TPaymentDetails } from '../../data/models';
import { moneyFetch } from '../../fetch/moneyFetch';
import config from '../../data/config';
import { validate } from '../../utilities/validate';
import {
  COMMISSION_AMOUNT,
  COMMISSION_EXCHANGE_AMOUNT,
  ID_CURRENCY_COMMON_EXCHANGE,
  ID_CURRENCY_REFILL_SERVICE,
  ID_CURRENCY_SELL_SERVICE,
  ID_REFILL_SERVICE,
  ID_REMOVE_SERVICE,
  ID_TRANSFER_SERVICE,
  INDEX_START_BANK_SERVICES,
  MAIN_CURRENCY,
} from '../../data/constants';
import { load } from '../../utilities/load';
import { transition } from '../../utilities/transition';
import { listenHeader } from '../main/listenHeader';
import { EMethod, EOperation, ETheme, IMainRes } from '../../data/types';
import langs from '../../data/lang/modalPaym/langs';
import pushState from '../../router/pushState';

class ModalPayment {
  value?: string;
  canPay = false;
  btnConfirm: HTMLButtonElement | null = null;
  emailInputs: TElemsForUpdateText = {};

  renderModalPayment(paymentDetails: TPaymentDetails, isAnonim: boolean, isNotCard: boolean): void {
    const popup = createElem('div', 'popup', document.body);
    popup.addEventListener('click', (e) => this.closePopUp(e));

    document.body.style.overflow = 'hidden';

    const popupContent = createElem(
      'div',
      `${config.theme === ETheme.dark ? 'popup__content page-dark dark-border' : 'popup__content'}`,
      popup
    ) as HTMLElement;
    const form = createElem('form', 'form', popupContent) as HTMLFormElement;
    form.id = 'payment-form';

    if (!isNotCard) {
      form.innerHTML = this.modalPaymentTemplate();

      const cardDataValidThru = form.querySelector('#valid-thru') as HTMLInputElement;
      cardDataValidThru?.addEventListener('invalid', () => this.showValidity(cardDataValidThru));

      const cardNumberInput = form.querySelector('.card-number') as HTMLElement;
      this.emailInputs['card-number'] = cardNumberInput;
    }

    const currLangObj = langs[config.lang];

    const btnConfirmBlock = createElem('div', 'form__btn', form);
    const btnConfirmText = currLangObj['btn--col-3'];
    const btnConfirmClassName = 'btn btn--col-3 btn-colored unable';
    const btnConfirm = createElem('button', btnConfirmClassName, btnConfirmBlock, btnConfirmText) as HTMLButtonElement;
    btnConfirm.type = 'submit';
    this.btnConfirm = btnConfirm;
    this.checkInputsValidity(form);

    const { operationId, operationSum } = paymentDetails;

    switch (operationId) {
      case INDEX_START_BANK_SERVICES:
      case ID_CURRENCY_COMMON_EXCHANGE:
        form.onsubmit = (e) => this.currencyExchange(e, paymentDetails, popup);
        break;
      case ID_REFILL_SERVICE:
      case ID_REMOVE_SERVICE:
        form.onsubmit = (e) => this.changeMainAcc(e, paymentDetails, popup);
        break;
      case ID_TRANSFER_SERVICE:
        form.onsubmit = (e) => this.transferMoney(e, paymentDetails, popup);
        break;
      default:
        form.onsubmit = (e) => this.confirmPayment(e, paymentDetails, isAnonim, popup, !!isNotCard);
        break;
    }
    form.addEventListener('input', (e) => this.checkForm(e, form));

    this.renderEmailInput(form, isAnonim);

    if (isAnonim) {
      const commissionBlock = createElem('div', 'commis');
      createElem('span', 'commis__start', commissionBlock, currLangObj.commis__start);

      const isAnonimExchange = operationId === INDEX_START_BANK_SERVICES;
      const commisPercent = isAnonimExchange ? COMMISSION_EXCHANGE_AMOUNT : COMMISSION_AMOUNT;
      createElem('span', 'commis__sum', commissionBlock, `${calculateCommissionSum(operationSum, commisPercent)}`);

      createElem('span', 'commis__end', commissionBlock, currLangObj.commis__end);
      popupContent.prepend(commissionBlock);
    }
  }

  closePopUp(e: Event): void {
    const clickedElem = e.target as HTMLElement;
    if (clickedElem.classList.contains('popup')) {
      clickedElem.remove();
      document.body.style.overflow = 'auto';
    }
  }

  confirmPayment(
    e: Event,
    paymentDetails: TPaymentDetails,
    isAnonim: boolean,
    popup: HTMLElement,
    isNotCard: boolean
  ): void {
    e.preventDefault();
    if (!this.canPay) return;

    this.startLoadingModalPayment(popup);

    const cardNumberElem = this.emailInputs['card-number'] as HTMLInputElement;
    const cardNumber = cardNumberElem ? cardNumberElem.value : '';

    const { operationId, operationSum } = paymentDetails;

    if (isAnonim) {
      moneyFetch.tryPayByCard(cardNumber).then((payCardResp) => {
        if (!payCardResp.success) {
          this.modalInfoMessage(langs[config.lang].errorPayByCardMessage, popup);
          return;
        }

        moneyFetch.commission(operationSum, operationId).then((resp) => {
          this.checkResponseForEmailSending(resp, popup, operationSum, operationId);
        });
      });
      return;
    }

    if (isNotCard) {
      const token = localStorage.getItem('token');
      if (!token) return;

      moneyFetch.changeMainMoney(operationSum, EOperation.REMOVE, token, operationId).then((resp) => {
        this.checkResponseForEmailSending(resp, popup, operationSum, operationId);
      });
      return;
    }

    moneyFetch.tryPayByCard(cardNumber).then((payCardResp) => {
      this.checkResponseForEmailSending(payCardResp, popup, operationSum, operationId);
    });
  }

  checkForm(e: Event, formEl: HTMLFormElement): void {
    const currInput = e.target as HTMLInputElement;

    if (currInput.id === 'card-number') {
      this.maskCardNumber.call(currInput);
      this.changeImgPaymentSystem.call(currInput);
    }
    if (currInput.id === 'valid-thru') {
      this.maskCardDataValidThru.call(currInput);
    }

    if (currInput.maxLength === currInput.value.length) {
      const activeElIndex = Array.from(formEl.elements).findIndex((inputEl) => inputEl === document.activeElement);
      (formEl[activeElIndex + 1] as HTMLInputElement).focus();
    }

    this.checkInputsValidity(formEl);
  }

  showValidity(inputEl: HTMLInputElement): void {
    inputEl.setCustomValidity(langs[config.lang].cardDataValidity);
  }

  maskCardNumber(): void {
    if (this.value) {
      let val = this.value.replace(/[^0-9]/g, '');
      val = val !== '' ? val.match(/.{1,4}/g)?.join(' ') || '' : '';
      this.value = val;
    }
  }

  maskCardDataValidThru(): void {
    if (this.value) {
      let val = this.value.replace(/[^0-9]/g, '');
      val = val.length >= 2 ? `${val.slice(0, 2)}/${val.slice(2, 4)}` : val;
      this.value = val;
    }
  }

  changeImgPaymentSystem(): void {
    const cardDataImg = document.querySelector('.card-data__card-number img') as HTMLImageElement;
    const firstChar = this.value?.trim().slice(0, 1);
    const newImg = new Image();

    switch (firstChar) {
      case EPaymSyst.AmericanExpr:
        newImg.src = americanExpressCard;
        break;
      case EPaymSyst.Visa:
        newImg.src = visaCard;
        break;
      case EPaymSyst.Mastercard:
        newImg.src = mastercardCard;
        break;
      default:
        newImg.src = invoiceCard;
        break;
    }

    newImg.addEventListener('load', () => {
      cardDataImg.src = newImg.src;
    });
  }

  checkInputsValidity(payForm: HTMLFormElement): void {
    this.canPay = Array.from(payForm.elements).every((inputEl) => {
      if ((inputEl as HTMLInputElement).disabled) return true;

      const inputPattern = (inputEl as HTMLInputElement).pattern;
      if (!inputPattern) return true;

      const isCorrectValue = validate(inputEl as HTMLInputElement, inputPattern);
      return isCorrectValue;
    });

    if (!this.btnConfirm) return;

    if (this.canPay) {
      this.btnConfirm.classList.remove('unable');
    } else {
      if (!this.btnConfirm.classList.contains('unable')) {
        this.btnConfirm.classList.add('unable');
      }
    }
  }

  checkNeedEmailInput(checkboxInput: HTMLInputElement, emailInput: HTMLInputElement): void {
    emailInput.disabled = !checkboxInput.checked;
  }

  renderEmailInput(popupContent: HTMLElement, isAnonim: boolean): void {
    const currLangObj = langs[config.lang];

    const personalDetails = createElem('div', 'form__person-details');
    createElem('h2', 'form__title modal-personal', personalDetails, currLangObj['modal-personal']);

    const needEmailCheckboxBlock = createElem('div', 'form__email', personalDetails);
    const needEmailCheckbox = createElem('input', 'form__email-input', needEmailCheckboxBlock) as HTMLInputElement;
    needEmailCheckbox.type = 'checkbox';
    const needEmailCheckboxLabel = createElem(
      'label',
      'form__email-label',
      needEmailCheckboxBlock,
      currLangObj['form__email-label']
    ) as HTMLLabelElement;
    needEmailCheckbox.id = needEmailCheckboxLabel.htmlFor = 'need-email';
    this.emailInputs['checkbox-input'] = needEmailCheckbox;

    const emailInput = createElem('input', 'form__item input--payment', personalDetails) as HTMLInputElement;
    emailInput.name = emailInput.type = 'email';
    emailInput.placeholder = 'E-mail';
    emailInput.required = emailInput.disabled = true;
    emailInput.pattern = '.+@\\w+\\.\\w+';
    this.emailInputs['email-input'] = emailInput;

    if (!isAnonim) {
      emailInput.value = config.currentEmail;
    }

    needEmailCheckbox.addEventListener('input', () =>
      this.checkNeedEmailInput(needEmailCheckbox as HTMLInputElement, emailInput)
    );

    popupContent?.prepend(personalDetails);
  }

  modalPaymentTemplate(): string {
    const currLangObj = langs[config.lang];

    return `
      <div class="form__card-details">
        <h2 class="form__title modal-credit-card">${currLangObj['modal-credit-card']}</h2>
        <div class="form__data card-data">
          <div class="card-data__card-number">
            <img src=${invoiceCard} alt="credit-card" />
            <input
              id="card-number"
              name="card-number"
              class="input--payment"
              type="text"
              placeholder="0000 0000 0000 0000"
              required
              pattern="\\d{4}\\s\\d{4}\\s\\d{4}\\s\\d{4}"
              maxlength="19"
              title="${currLangObj.cardInputTitle}"
            />
          </div>
          <div class="card-data__info">
            <div class="card-data__valid-data">
              <label for="valid-thru" class="valid">${currLangObj['valid']}</label>
              <input
                id="valid-thru"
                class="input--payment"
                type="text"
                name="valid-thru"
                placeholder="10/23"
                required
                pattern="[0-1][0-2][\\/]\\d{2}"
                maxlength="5"
              />
            </div>
            <div class="card-data__valid-data">
              <label for="code-cvv" class="code-cvv">${currLangObj['code-cvv']}</label>
              <input
                id="code-cvv"
                class="input--payment"
                type="text"
                name="code-cvv"
                placeholder="000"
                required
                pattern="\\d{3}"
                maxlength="3"
                title="${currLangObj.cvvInputTitle}"
              />
            </div>
          </div>
        </div>
      </div>
  `;
  }

  modalInfoMessage(message: string, popup: HTMLElement): void {
    const popupMessage = createElem('div', 'popup popup-message', document.body);
    const popupMessageContent = createElem('div', 'popup-message__content', popupMessage);
    createElem('div', 'popup-message__message-info', popupMessageContent, message);

    popup.remove();

    listenHeader.updateInfo().then(() => {
      const main = document.querySelector('.main') as HTMLElement;

      setTimeout(() => {
        popupMessage.remove();
        transition(main, renderPayment.renderPaymentsPage.bind(renderPayment));
        pushState.services();
        document.body.style.overflow = 'auto';
      }, 3000);
    });
  }

  checkResponseForEmailSending(resp: IMainRes, popup: HTMLElement, paymentSum: number, operationId: number): void {
    const currLang = langs[config.lang];
    let message = resp.success ? currLang.modalInfoMessage : currLang.errorPayByCardMessage;
    const respMess = resp.message;

    if (!resp.success || !(this.emailInputs['checkbox-input'] as HTMLInputElement)?.checked) {
      if (
        respMess === 'No enough money!' ||
        respMess === 'Error! Not enough money' ||
        respMess === 'Not enough money'
      ) {
        message = currLang.errorNotEnoughMoney;
      }

      this.modalInfoMessage(message, popup);
    } else {
      const anonimEmail = (this.emailInputs['email-input'] as HTMLInputElement)?.value;

      moneyFetch.sendCheckToEmail(paymentSum, operationId, anonimEmail).then((emailResp) => {
        message = emailResp ? currLang.modalInfoMessage : currLang.errorPayByCardMessage;

        this.modalInfoMessage(message, popup);
      });
    }
  }

  startLoadingModalPayment(popup: HTMLElement): void {
    const popupContent = popup.querySelector('.popup__content') as HTMLElement;
    popupContent.classList.add('loading');
    popupContent.style.height = `${popupContent.offsetHeight}px`;
    load(popupContent);
  }

  currencyExchange(e: Event, paymentDetails: TPaymentDetails, popup: HTMLElement): void {
    e.preventDefault();
    if (!this.canPay) return;

    const token = localStorage.getItem('token');
    const isClient = !!token;

    const { operationSum, currFrom, currTo } = paymentDetails;
    if (!currTo) return;

    let operationId: number;
    if (!currFrom) {
      operationId = INDEX_START_BANK_SERVICES;
    } else if (currFrom === MAIN_CURRENCY) {
      operationId = ID_CURRENCY_REFILL_SERVICE;
    } else if (currTo === MAIN_CURRENCY) {
      operationId = ID_CURRENCY_SELL_SERVICE;
    } else {
      operationId = ID_CURRENCY_COMMON_EXCHANGE;
    }

    const cardNumberElem = this.emailInputs['card-number'] as HTMLInputElement;
    const cardNumber = cardNumberElem ? cardNumberElem.value : '';

    this.startLoadingModalPayment(popup);

    switch (operationId) {
      case INDEX_START_BANK_SERVICES:
        moneyFetch.tryPayByCard(cardNumber).then((payCardResp) => {
          if (!payCardResp.success) {
            this.modalInfoMessage(langs[config.lang].errorPayByCardMessage, popup);
            return;
          }

          moneyFetch.anonimExchange(operationSum, currTo, isClient).then((resp) => {
            this.checkResponse(resp, popup, operationSum, operationId);
          });
        });
        break;
      case ID_CURRENCY_COMMON_EXCHANGE:
        if (!currFrom || !token) return;
        moneyFetch.clientExchange(operationSum, currFrom, currTo, token).then((resp) => {
          this.checkResponseForEmailSending(resp, popup, operationSum, operationId);
        });
        break;
      case ID_CURRENCY_REFILL_SERVICE:
        if (!token) return;
        moneyFetch
          .moneyAccount(EMethod.PUT, config.currentUser, currTo, token, operationSum, EOperation.ADD)
          .then((resp) => {
            if (!resp) return;
            this.checkResponseForEmailSending(resp, popup, operationSum, operationId);
          });
        break;
      case ID_CURRENCY_SELL_SERVICE:
        if (!currFrom || !token) return;
        moneyFetch
          .moneyAccount(EMethod.PUT, config.currentUser, currFrom, token, operationSum, EOperation.REMOVE)
          .then((resp) => {
            if (!resp) return;
            this.checkResponseForEmailSending(resp, popup, operationSum, operationId);
          });
        break;
    }
  }

  changeMainAcc(e: Event, paymentDetails: TPaymentDetails, popup: HTMLElement): void {
    e.preventDefault();
    if (!this.canPay) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    this.startLoadingModalPayment(popup);

    const { operationId, operationSum } = paymentDetails;

    const cardNumberElem = this.emailInputs['card-number'] as HTMLInputElement;
    const cardNumber = cardNumberElem ? cardNumberElem.value : '';

    if (operationId === ID_REFILL_SERVICE) {
      moneyFetch.tryPayByCard(cardNumber).then((payCardResp) => {
        if (!payCardResp.success) {
          this.modalInfoMessage(langs[config.lang].errorPayByCardMessage, popup);
          return;
        }

        moneyFetch.changeMainMoney(operationSum, EOperation.ADD, token, operationId).then((resp) => {
          this.checkResponse(resp, popup, operationSum, operationId);
        });
      });
    } else {
      moneyFetch.changeMainMoney(operationSum, EOperation.REMOVE, token, operationId).then((resp) => {
        this.checkResponse(resp, popup, operationSum, operationId);
      });
    }
  }

  transferMoney(e: Event, paymentDetails: TPaymentDetails, popup: HTMLElement): void {
    e.preventDefault();
    if (!this.canPay) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const { userTo, operationSum, operationId } = paymentDetails;
    if (!userTo) return;

    this.startLoadingModalPayment(popup);

    moneyFetch.transfer(operationSum, userTo, token).then((resp) => {
      this.checkResponse(resp, popup, operationSum, operationId);
    });
  }

  checkResponse(resp: IMainRes, popup: HTMLElement, paymentSum: number, operationId: number): void {
    if (!resp.success) {
      this.modalInfoMessage(langs[config.lang].errorPayByCardMessage, popup);
      return;
    }

    this.checkResponseForEmailSending(resp, popup, paymentSum, operationId);
  }
}

export const modalPayment = new ModalPayment();
