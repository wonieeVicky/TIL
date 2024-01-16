{
  const obj = {
    name: 'vicky'
  };
  obj.name; // vicky
  obj['name']; // vicky

  type Animal = {
    name: string;
    age: number;
    gender: 'male' | 'female';
  };

  type Name = Animal['name']; // string
  const text: Name = 'hello'; // Ok!

  type Gender = Animal['gender']; // male | female
  type Keys = keyof Animal; // name | age | gender
  const key: Keys = 'gender'; // Ok

  type Person = {
    name: string;
    gender: Animal['gender'];
  };
  const person: Person = {
    name: 'vicky',
    gender: 'female'
  };
}
