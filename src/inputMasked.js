import IMask from "imask";
import setCardType from './cardType';

const cardNumber = document.querySelector("#card-number");
const securityCode = document.querySelector("#security-code");
const expirationDate = document.querySelector("#expiration-date");
const cardHolder = document.querySelector('#card-holder');

const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardType: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    },
  ],
  dispatch: (appended, dynamicMasked) => {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "");
    
    return dynamicMasked.compiledMasks.find(({ regex }) => number.match(regex));
  },
};

const securityCodePattern = {
  mask: "0000",
};

const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
};

const cardNumberMasked = IMask(cardNumber, cardNumberPattern).on('accept', () => {
  const ccNumber = document.querySelector('.cc-info .cc-number');

  const { cardType, value } = cardNumberMasked.masked.currentMask;

  setCardType(cardType);

  ccNumber.textContent = value.length > 0 ? value : '1234 5678 9012 3456';
});

cardHolder.addEventListener('input', (event) => {
  event.preventDefault();
  const ccHolder = document.querySelector('.cc-holder .value');

  ccHolder.textContent = event.target.value.length > 0 ? event.target.value : 'FULANO DA SILVA';
})

const securityCodeMasked = IMask(securityCode, securityCodePattern).on('accept', () => {
  const ccSecurity = document.querySelector('.cc-extra .cc-security .value');
  console.log(ccSecurity)

  const { value } = securityCodeMasked.masked;

  ccSecurity.textContent = value.length > 0 ? value : '123';
  
});

const expirationDateMasked = IMask(expirationDate, expirationDatePattern).on('accept', () => {
  const ccExpirationDate = document.querySelector('.cc-extra .cc-expiration .value');

  const { value } = expirationDateMasked.masked;

  ccExpirationDate.textContent = value.length > 0 ? value : '02/32';
});
