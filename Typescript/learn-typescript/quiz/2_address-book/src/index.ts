interface PhoneNumberDictionary {
  [phone: string]: {
    num: number;
  };
}

interface Contact {
  name: string;
  address: string;
  phones: PhoneNumberDictionary;
}

enum PhoneType {
  Home = 'home',
  Office = 'office',
  Studio = 'studio',
}

// api
// 보통 제네릭은 API 규격의 타입을 지정할 때 가장 많이 사용되어 진다.
function fetchContacts(): Promise<Contact[]> {
  // TODO: 아래 변수의 타입FAQ 카테고리을 지정해보세요.
  const contacts: Contact[] = [
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

// main
class AddressBook {
  contacts: Contact[] = []; // contacts 변수 타입 지정

  constructor() {
    this.fetchData();
  }

  fetchData(): void {
    // 별도의 반환값이 없기 때문에 void를 반환타입으로 지정한다.
    fetchContacts().then(response => {
      this.contacts = response;
    });
  }

  findContactByName(name: string): Contact[] {
    return this.contacts.filter(contact => contact.name === name);
  }

  findContactByAddress(address: string): Contact[] {
    return this.contacts.filter(contact => contact.address === address);
  }

  // enum으로 타입 지정 -> findContactByPhone('officee'); 등으로 오탈자가 발생할 수 있으므로!
  // home, offiect, studio
  findContactByPhone(phoneNumber: number, phoneType: PhoneType): Contact[] {
    return this.contacts.filter(
      contact => contact.phones[phoneType].num === phoneNumber
    );
  }

  addContact(contact: Contact): void {
    this.contacts.push(contact);
  }

  displayListByName(): string[] {
    return this.contacts.map(contact => contact.name);
  }

  displayListByAddress(): string[] {
    return this.contacts.map(contact => contact.address);
  }
  /* ------------------------------------------------ */
}

new AddressBook();
