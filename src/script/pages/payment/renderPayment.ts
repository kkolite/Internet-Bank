import config from '../../data/config';
import {
  ID_COMMISSION_SERVICE,
  ID_CURRENCY_REFILL_SERVICE,
  ID_CURRENCY_SELL_SERVICE,
  ID_STOCKS_BUY_SERVICE,
  ID_STOCKS_SELL_SERVICE,
  INDEX_START_BANK_SERVICES,
  INDEX_START_SERVICES,
} from '../../data/constants';
import { IServiceObj, IServices, TElemsForUpdateText, TServiceDetails, TTextByLang } from '../../data/models';
import { IMainRes } from '../../data/types';
import { createElem } from '../../utilities/payUtils/createElem';
import { renderPaymentDetails } from './renderPaymentDetails';
import { transition } from '../../utilities/transition';
import { userFetch } from '../../fetch/userFetch';
import { load } from '../../utilities/load';
import pushState from '../../router/pushState';
import langs from '../../data/lang/payment/langs';

class RenderPayment {
  main = document.querySelector('.main-container') as HTMLElement;
  operationsResp: IServiceObj = {};
  elemsForUpdatingText: TElemsForUpdateText = {};
  selectedCategoryFilter = 'all';
  operationsContainer = createElem('div', 'operations');
  canRenderPage = false;

  constructor() {
    this.saveServicesResponse();
  }

  async renderPaymentsPage(): Promise<void> {
    load(this.main);

    if (!this.canRenderPage) {
      await this.saveServicesResponse();
    }

    this.main.innerHTML = '';
    this.main.className = 'container main-container';
    window.scrollTo(0, 0);
    const paymentPage = createElem('div', 'main__payment-page', this.main);
    const filtersContainer = createElem('div', 'filters', paymentPage);

    paymentPage.append(this.operationsContainer);

    this.updatePaymentCards();
    this.renderFilters(filtersContainer);
  }

  renderPaymentCard(operationId: string, container: HTMLElement): void {
    const card = createElem('div', 'operations__card serv-card');

    const mainInfo = createElem('div', 'serv-card__main', card);

    const operationImgBlock = createElem('div', 'serv-card__img', mainInfo);
    const logo = this.operationsResp[operationId].logo;
    if (logo) {
      operationImgBlock.style.backgroundColor = 'transparent';
      operationImgBlock.style.backgroundImage = `url(${logo})`;
    }

    const operationName = createElem('p', 'serv-card__title', mainInfo);
    this.elemsForUpdatingText[`${operationId}_operation-title`] = operationName;

    const currLangObj = langs[config.lang];

    const operationCategory = createElem('p', 'serv-card__category', mainInfo);
    const categoryTxtContent = currLangObj['serv-card__category-text'];
    createElem('span', 'serv-card__category-text', operationCategory, categoryTxtContent);
    const categoryTxt = this.operationsResp[operationId].category[config.lang];
    const categoryTitle = createElem('span', 'serv-card__category-type', operationCategory, categoryTxt);
    this.elemsForUpdatingText[`${operationId}_category-type`] = categoryTitle;

    const btn = createElem('button', 'serv-card__btn btn-colored', card, currLangObj['serv-card__btn']);

    btn.addEventListener('click', () => {
      this.renderPayment(+operationId);
      pushState.services(operationId);
    });

    container.append(card);
  }

  renderPayment(operationId: number): void {
    const main = document.querySelector('.main') as HTMLElement;
    transition(main, renderPaymentDetails.renderPayment.bind(renderPaymentDetails, operationId));
  }

  updatePaymentCardsText(): void {
    const keyForText = config.lang === 'en' ? 'name' : 'ruName';

    const operationsRespValues = Object.values(this.operationsResp);

    Object.keys(this.elemsForUpdatingText).forEach((key) => {
      const [operationId, elemType, filterVal] = key.split('_');
      const elemForUpdate = this.elemsForUpdatingText[key];

      if (elemType === 'operation-title') {
        const textForElem = this.operationsResp[operationId][keyForText];
        elemForUpdate.textContent = textForElem;
      } else if (elemType === 'category-type') {
        const textForElem = this.operationsResp[operationId].category[config.lang];
        elemForUpdate.textContent = textForElem;
      } else if (elemType === 'category-title') {
        if (!operationsRespValues) return;

        const textDataForElem = operationsRespValues.find(
          (operationData) => operationData.category.en.toLowerCase() === filterVal
        );
        if (!textDataForElem) return;

        elemForUpdate.textContent = textDataForElem.category[config.lang];
      }
    });
  }

  getOparationData(operationId: number): TServiceDetails | null {
    return this.operationsResp[operationId] || null;
  }

  renderFilters(container: HTMLElement): void {
    const filterType = 'category';

    const filterElem = createElem('div', 'filter');
    const filterForm = createElem('form', 'filter__form', filterElem) as HTMLFormElement;

    createElem('div', 'filter__title', filterForm, langs[config.lang].filter__title);
    const filterList = createElem('div', 'filter__list', filterForm);

    const filterAllTxtData = { en: langs.en['radio-all'], ru: langs.ru['radio-all'] };
    const filterAllItemElem = this.createFilterItemElem(filterType, filterAllTxtData);
    filterList.append(filterAllItemElem);

    const filterValues = this.getFiltersList();
    filterValues.forEach((filterValue) => {
      const filterItemElem = this.createFilterItemElem(filterType, filterValue);
      filterList.append(filterItemElem);
    });

    filterForm.addEventListener('change', () => this.filterOperations(filterForm));

    container.append(filterElem);
  }

  getFiltersList(): Array<TTextByLang> {
    const values: Array<TTextByLang> = [];

    const isAnonim = !localStorage.getItem('token');

    Object.keys(this.operationsResp).forEach((operationId) => {
      const toRenderFilter = this.checkServiceIdForUserStatus(isAnonim, +operationId);
      if (!toRenderFilter) return;

      const operationCategory = this.operationsResp[operationId].category;
      const hasValue = values.some((value) => value.en.toLowerCase() === operationCategory.en.toLowerCase());
      if (!hasValue) {
        values.push(operationCategory);
      }
    });

    return values;
  }

  createFilterItemElem(filterType: string, filterValue: TTextByLang): HTMLElement {
    const filterItemElem = createElem('div', 'filter__item');
    const key = `${filterType.toLowerCase()}_${filterValue.en.toLowerCase().replace(/ /g, '*')}`;

    const inputElem = createElem('input', 'filter__input', filterItemElem) as HTMLInputElement;
    inputElem.name = filterType.toLowerCase();
    inputElem.type = 'radio';
    inputElem.checked = this.selectedCategoryFilter.toLowerCase() === filterValue.en.toLowerCase();
    this.elemsForUpdatingText[`radio_${key}`] = inputElem;

    const label = createElem('label', 'filter__label', filterItemElem) as HTMLLabelElement;
    inputElem.id = inputElem.value = label.htmlFor = `${filterValue.en.toLowerCase()}`;

    const labelTxt = createElem('span', 'filter__label-title', label, filterValue[config.lang]);
    const isAllCategoryRadio = filterValue.en.toLowerCase() === 'all';
    if (isAllCategoryRadio) {
      labelTxt.classList.add('radio-all');
    } else {
      this.elemsForUpdatingText[`0_category-title_${filterValue.en.toLowerCase()}`] = labelTxt;
    }
    createElem('span', 'filter__label-numbers', label, `(${this.countFilterValues(filterValue.en)})`);
    return filterItemElem;
  }

  countFilterValues(filterValue: string): number {
    const operationIdArr = Object.keys(this.operationsResp);
    const filterVal = filterValue.toLowerCase();

    const isAnonim = !localStorage.getItem('token');

    const filteredOperationIdArr = operationIdArr.filter((operationId) => {
      const toCountFilter = this.checkServiceIdForUserStatus(isAnonim, +operationId);
      return toCountFilter;
    });

    if (filterVal === 'all') return filteredOperationIdArr.length;

    return filteredOperationIdArr.reduce((acc, operationId) => {
      if (this.operationsResp[operationId].category.en.toLowerCase() === filterVal) {
        acc += 1;
      }
      return acc;
    }, 0);
  }

  filterOperations(filterForm: HTMLFormElement): void {
    const filterValue = filterForm.category.value;
    this.selectedCategoryFilter = filterValue;

    transition(this.operationsContainer, this.updatePaymentCards.bind(this));
  }

  updatePaymentCards(): void {
    this.operationsContainer.innerHTML = '';

    const isAnonim = !localStorage.getItem('token');

    const filteredOperationsIdArr = Object.keys(this.operationsResp).filter((operationId) => {
      const toRenderService = this.checkServiceIdForUserStatus(isAnonim, +operationId);
      if (!toRenderService) return false;

      const categInResp = this.operationsResp[operationId].category.en.toLowerCase();

      return this.selectedCategoryFilter === 'all' || categInResp === this.selectedCategoryFilter.toLowerCase();
    });

    filteredOperationsIdArr.forEach((operationId) => {
      this.renderPaymentCard(operationId, this.operationsContainer);
    });

    this.updatePaymentCardsText();
  }

  async saveServicesResponse(): Promise<void> {
    const response: IMainRes = await userFetch.services();
    const operationsObj = (response as IServices).operations as IServiceObj;

    Object.keys(operationsObj).forEach((operationId) => {
      this.operationsResp[operationId] = operationsObj[operationId];
    });

    this.canRenderPage = true;
  }

  checkServiceIdForUserStatus(isAnonim: boolean, operationId: number): boolean {
    const isNotForAnonimServ =
      isAnonim && operationId > INDEX_START_BANK_SERVICES && operationId < INDEX_START_SERVICES;
    const isCurrencyDuplucateService =
      operationId === ID_CURRENCY_REFILL_SERVICE || operationId === ID_CURRENCY_SELL_SERVICE;
    const isCommissionService = operationId === ID_COMMISSION_SERVICE;
    const isStockService = operationId === ID_STOCKS_BUY_SERVICE || operationId === ID_STOCKS_SELL_SERVICE;

    if (isNotForAnonimServ || isCurrencyDuplucateService || isCommissionService || isStockService) return false;
    return true;
  }
}

export const renderPayment = new RenderPayment();
