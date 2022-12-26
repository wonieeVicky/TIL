interface Profile {
  name: string;
  age: number;
  married: boolean;
}

// custom Partial
type P<T> = {
  [P in keyof T]?: T[P];
};

const vicky: Profile = {
  name: "vicky",
  age: 33,
  married: false,
};

const filteredVicky: Partial<Profile> = {
  name: "vicky",
  age: 33,
};
