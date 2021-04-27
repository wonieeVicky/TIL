# typeof, keyof, 고차함수 타이핑

가위바위보 게임을 만들면서 keyof, typeof에 대한 타이핑 적용을 해볼 수 있다.

`RSP.tsx`

```tsx
// 1. 값 고정
const rspCoords = {
  바위: "0",
  가위: "-142px",
  보: "-284px",
} as const;
// 1. 값 고정
const scores = {
  가위: 1,
  바위: 0,
  보: -1,
} as const;

// 2. code 중복을 없애기 위해 typeof, keyof 사용
// type imgCoords = "0" | "-142px" | "-284px";
type ImgCoords = typeof rspCoords[keyof typeof rspCoords];

// 3. 강제 형변환 - undefined가 될 수도 있다는 추론 발생.. !를 사용하여 개선
const computerChoice = (imgCoords: ImgCoords) =>
  (Object.keys(rspCoords) as ["바위", "가위", "보"]).find((k) => rspCoords[k] === imgCoords)!;

const RSP = () => {
  const [result, setResult] = useState("");
  const [imgCoord, setImgCoord] = useState<ImgCoords>(rspCoords.바위); // 4. type 지정
  const [score, setScore] = useState(0);
  const interval = useRef<number>();

  useEffect(() => {
    // 5. window Event 타입 지정
    interval.current = window.setInterval(changeHand, 100);
    return () => clearInterval(interval.current);
  }, [imgCoord]);

  const changeHand = () => {
    if (imgCoord === rspCoords.바위) {
      setImgCoord(rspCoords.가위);
    } else if (imgCoord === rspCoords.가위) {
      setImgCoord(rspCoords.보);
    } else {
      setImgCoord(rspCoords.바위);
    }
  };

  // 6. 고차함수 타이핑 - keyof + typeof 활용
  const onClickBtn = (choice: keyof typeof rspCoords) => () => {
    clearInterval(interval.current);

    const myScore = scores[choice];
    const cpuScore = scores[computerChoice(imgCoord)];
    const diff = myScore - cpuScore;

    if (diff === 0) {
      setResult("비겼습니다");
    } else if ([-1, 2].includes(diff)) {
      setResult("이겼습니다");
      setScore((prevState) => prevState + 1);
    } else {
      setResult("졌습니다ㅠㅠ");
      setScore((prevState) => prevState - 1);
    }
    setTimeout(() => {
      // 5. window Event 타입 지정
      interval.current = window.setInterval(changeHand, 100);
    }, 2000);
  };

  return <>{/* codes... */}</>;
};

export default RSP;
```

1. 바뀔 가능성이 없는 정적 데이터의 경우 as const를 사용하여 readonly로 고정되면서 해당 값으로 타입이 고정된다.
2. ImgCoords라는 변수에 대한 타입 지정을 위해 직접 데이터를 입력하는 방법으로 타이핑을 할 경우 (type imgCoords = "0" | "-142px" | "-284px";) 만약 값이 바뀌면 데이터 수정을 여러번 해줘야 한다.

   따라서 keyof와 typeof를 사용해 기존 변수 `rspCoords` 객체의 데이터를 활용한다.
   먼저 keyof typeof rspCoords로 타이핑을 하면 타입 추론이 `"바위" | "가위" | "보"` 가 되는데 실제 필요한 데이터는 `"0" | "-142px" | "-284px"`이므로 객체의 배열 키 값으로 찾아준다.다.

   `typeof rspCoords[keyof typeof rspCoords];`

   이렇게 만들어진 ImgCoords 타입을 `computerChoice` 함수의 매개변수에 타입으로 선언해주면 ok!

3. 실제 `computerChoice` 함수에서 `Object.keys`메서드의 타입 지정이 string이므로 `string[]`배열이 들어가지 못한다.(타입스크립트의 한계점) 따라서 직접 타입을 `as ["바위", "가위", "보"]`로 지정해준다.

   위와 같이 타입을 지정해주면, `computerChoice` 함수의 타입 추론이 `"바위" | "가위" | "보" | undefined`가 되는데, 타입스크립트가 반환데이터 추론 시 `undefined`가 나올 수 있다고 추론하는 것이다. 해당 데이터는 정확히 `가위, 바위, 보` 세 가지 데이터 중에서만 동작되어지는 것이 정확하므로 `!`를 사용하여 강제 타입지정을 해준다. (혹은 if문으로 분기처리 해주는 방법도 있음)

4. useState에도 ImgCoords type으로 제네릭을 이용해 타입 지정해준다.
5. typeScript는 해당 파일이 node에서 동작하는지 window에서 동작하는지 알지 못하므로 에러를 뱉는다. (환경에 따라 타입 정의가 다르므로) 따라서 해당 영역에 window를 명시적으로 붙여 타입 에러를 막는다.
6. 고차함수의 경우 필요에 따라 매개변수 타이핑이 필요하다. choice 매개변수 에는 `rspCoords`의 키 값이 들어가므로(가위, 바위, 보) `keyof typeof rspCoords`라고 타입 지정을 해준다.

### 클래스형 컴포넌트로 바꿔보기

클래스형 컴포넌트도 함수형 컴포넌트와 크게 다르지 않음. 초기 props와 State에 대한 타입 지정해주는 것만 기억하자 :)

`RSPClass.tsx`

```tsx
import * as React from "react";
import { Component } from "react";

const rspCoords = {
  바위: "0",
  가위: "-142px",
  보: "-284px",
} as const;

const scores = {
  가위: 1,
  바위: 0,
  보: -1,
} as const;

type ImgCoords = typeof rspCoords[keyof typeof rspCoords];

const computerChoice = (imgCoord: ImgCoords) =>
  (Object.keys(rspCoords) as ["바위", "가위", "보"]).find((v) => rspCoords[v] === imgCoord);

interface State {
  result: string;
  imgCoord: ImgCoords;
  score: number;
}

// class 컴포넌트는 초기에 props와 state에 대한 타입지정 필요
class RSP extends Component<{}, State> {
  // constructor 를 사용하지 않은 변수 선언 시 직접 타입 주입 필요
  state: State = {
    result: "",
    imgCoord: rspCoords.바위,
    score: 0,
  };

  // interval 초기값 타입 정의
  interval: number | null = null;

  componentDidMount() {
    // window 이벤트 명시
    this.interval = window.setInterval(this.changeHand, 100);
  }
  componentWillUnmount() {
    clearInterval(this.interval!);
  }

  changeHand = () => {
    const { imgCoord } = this.state;
    if (imgCoord === rspCoords.바위) {
      this.setState({
        imgCoord: rspCoords.가위,
      });
    } else if (imgCoord === rspCoords.가위) {
      this.setState({
        imgCoord: rspCoords.보,
      });
    } else {
      this.setState({
        imgCoord: rspCoords.바위,
      });
    }
  };

  // 고차함수 타입 지정, e는 React.MouseEvent<HTMLButtonElement>로 처리
  onClickBtn = (choice: keyof typeof rspCoords) => (e: React.MouseEvent<HTMLButtonElement>) => {
    const { imgCoord } = this.state;
    clearInterval(this.interval!); // 명확한 값일 경우 !로 타입체크 무시

    const myScore = scores[choice];
    const cpuScore = scores[computerChoice(imgCoord)!]; // 명확한 값일 경우 !로 타입체크 무시
    const diff = myScore - cpuScore;

    if (diff === 0) {
      this.setState({
        result: "비겼습니다",
      });
    } else if ([-1, 2].includes(diff)) {
      this.setState((prevState) => {
        return {
          result: "이겼습니다~!",
          score: prevState.score + 1,
        };
      });
    } else {
      this.setState((prevState) => {
        return {
          result: "졌습니다ㅠㅠ",
          score: prevState.score - 1,
        };
      });
    }

    // window 이벤트 명시
    setTimeout(() => {
      this.interval = window.setInterval(this.changeHand, 100);
    }, 2000);
  };

  render() {
    const { result, score, imgCoord } = this.state;
    return <>{/* codes... */}</>;
  }
}

export default RSP;
```
