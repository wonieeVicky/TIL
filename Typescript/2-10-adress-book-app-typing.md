# address-book App 타이핑

이제 전화번호부 애플리케이션에 대한 타이핑을 해보는 프로젝트를 진행해보자. 기존의 소스에서 타입을 추가해주는 개념이다. 먼저 해당 작업을 진행하기에 앞서 address_book 프로젝트를 `npm install` 해준 뒤 타입 지정에 대한 엄격한 검사를 위해 `tslint`와 `tsconfig.json` 등의 옵션을 아래와 같이 수정해준다.

`address-book/tsconfig.json`

```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "target": "es5",
    "lib": ["es2015", "dom", "dom.iterable"],
    "noImplicitAny": true, // 변경, true일 때 암묵적으로 any를 추론하지 않도록 한다.
    "strict": true, // 추가
    "strictFunctionTypes": true // 추가
  },
  "include": ["./src/**/*"]
}
```

`address-book/.eslintrc.js`

```json
module.exports = {
	// settings...
  rules: {
    "prettier/prettier": [
      // settings ..
    ],
    // '@typescript-eslint/no-explicit-any': 'off', // 주석처리
    // "@typescript-eslint/explicit-function-return-type": 'off', // 주석처리
    "prefer-const": "off",
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
};
```

이렇게 하면 기존의 any 자동추론도 되지않고, 비동기 처리 등의 다양한 코드에서 엄격한 타입체크가 실행된다.

## 애플리케이션에 정의된 타입 설명 및 API 함수 타입 정의

`index.ts`

타입정의가 필요한 전화번호부 애플리케이션의 코드는 아래와 같이 나뉘어져 있다.

1. Contact 객체, 즉 전화번호부 객체에 대한 타입정의 - API 호출에 대한 반환 response 타입 정의

   아래 코드를 보면 name과 address에 대한 기본 타입 정의와 함께 phone 객체에 대한 별도의 인터페이스 객체를 선언해주었다 : )

   ```tsx
   // Contact 객체에 대한 타입 정의
   interface PhoneNumberDictionary {
     [phone: string]: {
       num: number;
     };
   }
   interface Contact {
     name: string;
     address: string;
     phones: PhoneNumberDictionary; // 특정 속성을 별도의 interface 타입으로 지정할 수 있다.
   }
   ```

2. API 호출함수인 fetchContacts 함수 : 보통 제네릭은 API 호출에 대한 타입정의 시 많이 사용된다.

   ```tsx
   // call api
   function fetchContacts(): Promise {
     // 함수 반환 타입 Promise로 지정, 상세 제네릭 지정해야 한다.
     // TODO: 아래 변수의 타입을 지정해보세요.
     const contacts = [
       {
         name: 'Tony',
         address: 'Malibu',
         phones: {
           home: {
             num: 11122223333,
           },
           office: {
             num: 44455556666,
           },
         },
       },
       {
         name: 'Banner',
         address: 'New York',
         phones: {
           home: {
             num: 77788889999,
           },
         },
       },
       {
         name: '마동석',
         address: '서울시 강남구',
         phones: {
           home: {
             num: 213423452,
           },
           studio: {
             num: 314882045,
           },
         },
       },
     ];
     return new Promise(resolve => {
       setTimeout(() => resolve(contacts), 2000);
     });
   }
   ```

3. 실제 전화번호부 애플리케이션 main 클래스 함수 : 각종 메서드들이 함께 포함되어 있다.

   ```tsx
   class AddressBook {
     // TODO: 아래 변수의 타입을 지정해보세요.
     contacts = [];

     constructor() {
       this.fetchData();
     }

     fetchData() {
       fetchContacts().then(response => {
         this.contacts = response;
       });
     }

     /* TODO: 아래 함수들의 파라미터 타입과 반환 타입을 지정해보세요 */
     findContactByName(name) {
       return this.contacts.filter(contact => contact.name === name);
     }

     findContactByAddress(address) {
       return this.contacts.filter(contact => contact.address === address);
     }

     findContactByPhone(phoneNumber, phoneType: string) {
       return this.contacts.filter(
         contact => contact.phones[phoneType].num === phoneNumber
       );
     }

     addContact(contact) {
       this.contacts.push(contact);
     }

     displayListByName() {
       return this.contacts.map(contact => contact.name);
     }

     displayListByAddress() {
       return this.contacts.map(contact => contact.address);
     }
   }

   new AddressBook();
   ```

## Promise를 이용한 API 함수 타입 정의

위에서 간단하게 적용해본 fetchData 함수의 반환 타입 정의 좀 더 구체적으로 설정해보기 전에 먼저 제네릭이 왜 API 호출 즉 Promise 객체 반환에 많이 사용되는지 이유를 알아보자.

아래와 같이 기본 문자열 Array Item을 반환해주는 함수가 있다고 생각해보자.

```tsx
function fetchItems() {
  let items = ['a', 'b', 'c'];
  return items;
}
fetchItems(); // string[] 으로 타입 추론된다.
```

타입스크립트는 기본적으로 별도의 리턴 타입을 지정하지 않아도 return 데이터를 보고 반환 타입을 추론할 수 있다. 따라서 `fetchItems();`라는 함수를 실행할 때 별도의 타입이 지정되지 않아도 `string[]`으로 타입이 추론된다.

그럼 만약 API 호출에 대한 Promise 객체 반환은 어떻게 하면될까? 아래 예시코드를 보자

```tsx
function fetchItems(): Promise<string[]> {
  let items = ['a', 'b', 'c'];
  return new Promise(function (resolve) {
    resolve(items);
  });
}
fetchItems();
```

타입스크립트는 return 당시의 Promise 객체만 보고 타입이 뭔지 예측할 수 없다. (자동 타입 추론 시 `Promise<unknown>`으로 처리) 따라서 비동기 코드 작업 시 반환 값에 대한 자세한 타입정의를 해줘야 한다. (`Promise<string[]>`)

따라서 위 전화번호 부 애플리케이션의 fetchContacts 함수에 대한 Promise 반환 타입을 지정하면 아래와 같다

```tsx
function fetchContacts(): Promise<Contact[]> {
  // return 값 타입 지정
  const contacts: Contact[] = [
    // contact 객체 배열 타입 지정
    {
      name: 'Tony',
      address: 'Malibu',
      phones: {
        home: {
          num: 11122223333,
        },
        office: {
          num: 44455556666,
        },
      },
    },
    {
      name: 'Banner',
      address: 'New York',
      phones: {
        home: {
          num: 77788889999,
        },
      },
    },
    {
      name: '마동석',
      address: '서울시 강남구',
      phones: {
        home: {
          num: 213423452,
        },
        studio: {
          num: 314882045,
        },
      },
    },
  ];
  return new Promise(resolve => {
    setTimeout(() => resolve(contacts), 2000);
  });
}
```

## 전화번호부 App 내 클래스 함수 타입 정의

이제 전화번호부 애플리케이션을 구성하는 메인함수의 타입을 지정해본다.

```tsx
// 2. findContactByPhone 함수 내 phoneType 인자값에 대한 타입정의
enum PhoneType {
  Home = 'home',
  Office = 'office',
  Studio = 'studio',
}

class AddressBook {
  // 선언부 타입 지정 - contacts 변수 타입 지정
  contacts: Contact[] = [];

  constructor() {
    this.fetchData();
  }

  // 선언부 타입 비정 - 별도의 반환값이 없으므로 void를 반환 타입으로 지정
  fetchData(): void {
    fetchContacts().then(response => {
      this.contacts = response;
    });
  }

  // 인자 및 반환 값에 대한 타입 지정
  findContactByName(name: string): Contact[] {
    return this.contacts.filter(contact => contact.name === name);
  }

  // 인자 및 반환 값에 대한 타입 지정
  findContactByAddress(address: string): Contact[] {
    return this.contacts.filter(contact => contact.address === address);
  }

  // 1. enum으로 타입 지정 : home, office, studio
  findContactByPhone(phoneNumber: number, phoneType: PhoneType): Contact[] {
    return this.contacts.filter(
      contact => contact.phones[phoneType].num === phoneNumber
    );
  }

  // 인자 및 반환 값에 대한 타입 지정
  addContact(contact: Contact): void {
    this.contacts.push(contact);
  }

  // 특정 인자값에 대한 배열 반환이므로 string[]으로 타입 지정
  displayListByName(): string[] {
    return this.contacts.map(contact => contact.name);
  }
  // 특정 인자값에 대한 배열 반환이므로 string[]으로 타입 지정
  displayListByAddress(): string[] {
    return this.contacts.map(contact => contact.address);
  }
}
```

위의 대부분의 타입은 미리 정해놓은 인터페이스의 규칙을 그대로 상속받아 인자와 반환값에 대한 타입을 지정해줄 수 있다.

1. `findContactByPhone` 함수의 매개변수에는 각각 `phoneNumber`와 `phoneType`이라는 데이터가 들어가는데 , 여기서`phoneType` 인자의 경우 위 Contact 더미데이터를 보면 들어가는 데이터가 home, office, studio 3가지로 정해져있는 것을 알 수 있음. 따라서 해당 함수에 대한 타입을 enum으로 정의해줄 수 있다.
2. enum 타입으로 설정 후 `findContactByPhone`의 `phoneType` 인자의 타입으로 지정해준다.
