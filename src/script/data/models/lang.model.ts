export type TElemsForUpdateText = {
  [key: string]: HTMLElement;
};

export type TTextByLang = {
  [key: string]: string;
};

export type TLang = {
  [key: string]: TTextByLang;
};

export type TPageLang = {
  [page: string]: TLang;
};
