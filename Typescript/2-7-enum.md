# 이넘

## 이넘(Enums)

이넘은 특정 값들의 집합을 의미하는 자료형으로, 타입스크립트에서는 문자형 이넘과 숫자형 이넘을 지원한다.
예를 들면 아래와 같은 목록이 이넘이 될 수 있다.

```
나이키
아디다스
뉴발란스
```

## 숫자형 이넘

숫자형 이넘의 경우 별도 값을 지정하지 않으면 해당 값의 index가 반환되는 자료형을 의미한다. 아래 예시를 보자

```tsx
enum Shoes {
  Nike,
  Adidas,
}

var myShoes = Shoes.Nike;
console.log(myShoes); // 0
myShoes = Shoes.Adidas;
console.log(myShoes); // 1
```

만약 숫자를 지정했을 경우 해당 숫자를 기준으로 카운팅이 +1씩 된다.

```tsx
enum Shoes {
  Nike = 10
  Adidas,
  Sth,
}

var myShoes = Shoes.Nike;
console.log(myShoes); // 10
myShoes = Shoes.Adidas;
console.log(myShoes); // 11
```

## 문자형 이넘

문자형 이넘은 값을 문자로 지정한 자료형 타입의 묶음을 의미한다.

```tsx
enum Shoes {
  Nike = '나이키',
  Adidas = '아이다스',
}

var myShoes = Shoes.Nike;
console.log(myShoes); // 나이키
myShoes = Shoes.Adidas;
console.log(myShoes); // 아디다스
```

## 이넘 활용 사례

이넘은 어디에 활용할 수 있을까?  
보통 이넘은 정해진 값을 받을 때, 드롭다운 등의 목록 형태에서 데이터를 받을 때 사용을 한다.

```tsx
enum Answer {
  Yes = 'Y',
  No = 'N',
}

function askQuestion(answer: Answer) {
  if (answer === Answer.Yes) {
    console.log('정답입니다.');
  }
  if (answer === Answer.No) {
    console.log('오답입니다');
  }
}

askQuestion(Answer.Yes); // Enum에서 정의한 타입만 사용 가능
askQuestion('y'); // error, Enum에서 정의한 타입이 아님
askQuestion('예스'); // error, Enum에서 정의한 타입이 아님
```
