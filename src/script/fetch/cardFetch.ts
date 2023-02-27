import cardConfig from '../pages/cardCreator/cardConfig';

export default async function () {
  const json = {
    html: cardConfig.code,
    css: '*{margin:0}',
  };

  const username = 'be4e67e0-0ec8-406d-94c4-43d370da34a0';
  const password = 'f27562cd-a78a-4cfb-b9eb-63bba4a41471';

  const options = {
    method: 'POST',
    body: JSON.stringify(json),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(username + ':' + password),
    },
  };

  const res = await fetch('https://hcti.io/v1/image', options);
  const link = await res.json();
  return link.url;
}
