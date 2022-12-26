interface Profile {
  name: string;
  age: number;
  married: boolean;
}

// custom Pick
type P<T, S extends keyof T> = {
  [P in S]: T[P];
};

const vicky: Profile = {
  name: "vicky",
  age: 33,
  married: false,
};

const PartialVicky: Partial<Profile> = {
  name: "vicky",
  age: 33,
};

const PickVicky: Pick<Profile, "name" | "age"> = {
  name: "vicky",
  age: 33,
};

const OmitVicky: Omit<Profile, "married"> = {
  name: "vicky",
  age: 33,
};
