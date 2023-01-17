type BRAND<K, T> = K & { __brand: T };

type USD = BRAND<number, "USD">;
type EUR = BRAND<number, "EUR">;

const usd = 10 as USD;
const eur = 10 as EUR;
const krw = 2000;

// 유로를 달러로 바꾸는 함수이다.
function euroToUsd(euro: EUR): USD {
  return (euro * 1.18) as USD;
}

console.log(`USD: ${euroToUsd(eur)}`);

// euroToUsd(krw); // Error
euroToUsd(eur);
