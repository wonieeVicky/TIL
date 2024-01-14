type PositionType = {
  x: number;
  y: number;
};

interface PositionInterface {
  x: number;
  y: number;
}

// object ★
const obj1: PositionType = {
  x: 1,
  y: 2
};
// object ★
const obj12: PositionInterface = {
  x: 4,
  y: 5,
  z: 1
};

// class ★
class Pos1 implements PositionType {
  x: number;
  y: number;
}
class Pos2 implements PositionInterface {
  x: number;
  y: number;
  z: number;
}

// Type, interface의 확장 Extends
interface ZPositionInterface extends PositionInterface {
  z: number;
}
type ZPositionType = PositionType & { z: number };

// only interfaces can be merged.
interface PositionInterface {
  z: number;
}

// Type aliases can use computed properties
type Person = {
  name: string;
  age: number;
};
type Name = Person['name']; // string type
type NumberType = number; // type만 쓸 수 있는 특징
type Direction = 'left' | 'right'; // union type
