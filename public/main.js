const delay = 20000;

document.querySelector('.button').addEventListener('click', () => openDialog());
document.querySelector('.setPocket').addEventListener('click', () => setPocket());
document.querySelector('.closeDialog').addEventListener('click', () => closeDialog());

fetchValues = function () {
  let apiUrl = 'https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=EUR&limit=10';
  let kraken = 'https://api.kraken.com/0/public/Ticker?pair=ETHEUR';
  fetch(kraken)
    .then(res => res.json())
    .then(json => {
      updateView(json.result.XETHZEUR);
    });
};

updateView = function (json) {
  let pocket = localStorage.getItem('pocket') || 1;
  let invest = localStorage.getItem('invest') || 0;

  let evolElement = document.querySelector('.item__evolValue');
  let ethElement = document.querySelector('.item__ethValue');
  let valueElement = document.querySelector('.item__value');
  let earningElement = document.querySelector('.item__earning');
  let value = parseFloat(json.c[0]) * pocket;
  let ethValue = parseFloat(json.c[0]);
  let opening = parseFloat(json.o);
  let evol = (ethValue - opening) / opening * 100;

  earningElement.innerText = parseFloat(value - invest).toFixed(2);

  valueElement.innerText = value.toFixed(2);

  evolClass = evol > 0 ? 'item__evol--up' : 'item__evol--down';
  evolElement.classList.add(evolClass);

  evolElement.innerText = evol.toFixed(2);
  ethElement.innerText = ethValue.toFixed(2);
}

refresh = function (event) {
  let btn = event.path[0];
  btn.classList.add('refreshing');
  fetchValues();
  setTimeout(() => {
    btn.classList.remove('refreshing');
  }, 1000);
}


openDialog = function () {
  let dialog = document.querySelector('.dialog');
  let input = document.querySelector('#textfield-1');
  let input2 = document.querySelector('#textfield-2');
  input.value = localStorage.getItem('pocket') || '';
  input2.value = localStorage.getItem('invest') || '';
  dialog.classList.add('visible');
}

closeDialog = function () {
  let dialog = document.querySelector('.dialog');
  dialog.classList.remove('visible');
}

setPocket = function () {
  let value = document.querySelector('#textfield-1').value;
  let value2 = document.querySelector('#textfield-2').value;
  window.localStorage.setItem('pocket', value);
  window.localStorage.setItem('invest', value2);
  fetchValues();
  closeDialog();
}


window.onload = () => fetchValues();

setInterval(() => {
  fetchValues()
}, delay);
