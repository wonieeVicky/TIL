{
  // Array
  const fruits: string[] = ['🍅', '🍌'];
  const scores: Array<number> = [1, 3, 4];

  function printArray(fruits: readonly string[]) {
    fruits.push('🍓'); // error - readonly 값은 변경할 수 없음
  }

  // Tuple -> 권장하지 않음, 값을 보지 않는 이상 알 수 없음
  // interface, type alias, class로 대체해서 사용한다.
  let student: [string, number];
  student = ['name', 123]; // ok
  student[0]; // name
  student[1]; // 123

  // 피하는 방법
  const [name, age] = student; // 명시적으로 알 수 있음

  // Tuple 사용 예제
  const [count, setCount] = useState(0); // useState는 리턴타입 사용 시 tuple을 사용함
  // function useState<S>(initialState: S | (() => S)): [S,Dispatch<SetStateAction<S>>];
}
