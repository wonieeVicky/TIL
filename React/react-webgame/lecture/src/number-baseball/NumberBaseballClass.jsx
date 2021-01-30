import React, { PureComponent, createRef } from "react";
import Try from "./TryClass";

// 숫자 네 개를 겹치지 않고 랜덤하게 리턴하는 함수
const getNumbers = () => {
  const candidate = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const array = [];
  for (let i = 0; i < 4; i += 1) {
    const chosen = candidate.splice(Math.floor(Math.random() * (9 - i)), 1)[0];
    array.push(chosen);
  }
  return array;
};

class NumberBaseball extends PureComponent {
  state = {
    result: "",
    value: "",
    answer: getNumbers(), // ex. [1,3,5,7]
    tries: [], // push 쓰면 안된다.
  };

  onSubmitForm = (e) => {
    const { value, tries, answer } = this.state;
    e.preventDefault();
    if (value === answer.join("")) {
      this.setState((prevState) => {
        return {
          result: "홈런!",
          tries: [...prevState.tries, { try: value, result: "홈런!" }],
        };
      });
      alert("게임을 다시 시작합니다.");
      this.setState({
        value: "",
        answer: getNumbers(),
        tries: [],
      });
      this.inputRef.current.focus();
    } else {
      const answerArray = value.split("").map((v) => parseInt(v));
      let strike = 0;
      let ball = 0;

      // 10번 이상 틀렸을 때
      if (tries.length >= 9) {
        this.setState({
          result: `10번 넘게 틀려서 실패! 답은 ${answer.join(",")} 였습니다!`,
        });
        alert("게임을 다시 시작합니다.");
        this.setState({
          value: "",
          answer: getNumbers(),
          tries: [],
        });
        this.inputRef.current.focus();
      } else {
        for (let i = 0; i < 4; i++) {
          if (answerArray[i] === answer[i]) {
            strike++;
          } else if (answer.includes(answerArray[i])) {
            ball++;
          }
        }
        this.setState((prevState) => {
          return {
            tries: [...prevState.tries, { try: value, result: `${strike} 스트라이크, ${ball} 볼입니다` }],
            value: "",
          };
        });
        this.inputRef.current.focus();
      }
    }
  };

  onChangeInput = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  inputRef = createRef();

  render() {
    const { result, value, tries } = this.state; // 구조분해로 값 간단히 만들기
    return (
      <>
        <h1>{result}</h1>
        <form onSubmit={this.onSubmitForm}>
          <input ref={this.inputRef} maxLength={4} value={value} onChange={this.onChangeInput} />
        </form>
        <div>시도: {tries.length}</div>
        <ul>
          {tries.map((v, i) => (
            <Try key={`${i + 1}차 시도 :`} tryInfo={v} index={i} />
          ))}
        </ul>
      </>
    );
  }
}

export default NumberBaseball;
