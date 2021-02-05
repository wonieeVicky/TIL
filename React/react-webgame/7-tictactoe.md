# 틱택토 만들기

## 7-1. 틱택토와 useReducer 소개

React에서 기존의 Redux의 사양을 useReducer로 구현할 수 있도록 제공하고 있다. 물론 모든 사양을 다 useReducer로 맞추기는 어렵지만 소규모 프로젝트에서는 useReducer와 Context API만 가지고도 충분히 운영이 가능하다. 단 규모가 큰 프로젝트가 될수록 비동기 부분의 처리가 필요해지므로 Redux가 필요해진다.

또, useReducer를 이용하면 useState를 하나로 관리할 수 있게 된다. 틱택토를 Hooks로 만들어보자!
useReducer를 사용하기 위해서는 초기 State(initialState)와 reducer, 그리고 useReducer Hooks를 선언하는 영역이 필요하다.

```jsx
// TicTacToe.jsx
import React, { useReducer } from "react";
import Table from "./Table";

const initialState = {
  winner: "",
  turn: "o",
  tableData: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ], // 3목 형태여야 하므로 3 x 3 배열을 만들어준다.
};

const reducer = (state, action) => {};

const TicTacToe = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <Table />
      {winner && <div>{winner} 님의 승리!</div>}
    </>
  );
};

export default TicTacToe;
```

## 7-2. reducer, action, dispatch의 관계

우리가 useReducer를 사용하는 목적은 무엇인가? state를 유용하게 관리하기 위해서이다.
state는 바꿀 수 없는 값이다. 이 state를 바꾸려면 이벤트가 실행될 때 `action`을 `dispatch`해서 state를 바꿔야한다. state를 어떻게 바꿀 것인지는 `reducer`가 관리하고 있다.

위 내용을 코드로 풀자면 아래와 같다.

```jsx
import React, { useReducer, useCallback } from "react";
import Table from "./Table";

const initialState = {
  winner: "",
  turn: "o",
  tableData: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
};

// 4. 상수 값은 별도로 보관하는 것이 규칙이다.
const SET_WINNER = "SET_WINNER";

// 3. action은 type별로 구분한다.
const reducer = (state, action) => {
  // action type별로 구분한다.
  switch (action.type) {
    case SET_WINNER:
      return {
        ...state,
        winner: action.winner,
      };
  }
};

const TicTacToe = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 1. 자식 컴포넌트에 내려주는 함수
  const onClickTable = useCallback(() => {
    // 2. 액션 객체를 넣어 실행(dispatch)
    dispatch({ type: SET_WINNER, winner: "o" });
  }, []);

  return (
    <>
      <Table onClick={onClickTable} tableData={state.tableData} />
      {state.winner && <div>{state.winner} 님의 승리!</div>}
    </>
  );
};

export default TicTacToe;
```

1. 자식 컴포넌트에 내려주는 함수의 경우 반드시 useCallback으로 감싸준다!
2. action만 있다고 해서 자동으로 state가 바뀌지 않는다. action을 실행(dispatch)하고, 이를 해석해서 state를 바꿔주는 기능(reducer)가 필요하다. 우선 아래와 같이 dispatch 안에 액션 객체를 넣어 실행한다.
3. `state.winner = action.winner;` 처럼 React에서는 기존 state를 직접 바꿔주면 안된다. 항상 state를 새롭게 복사하여, 바뀔 부분만 업데이트 해준 뒤 새로운 state로 반환해주어야 한다. 이는 불변성을 유지하는 개념으로 React에서 매우 중요한 개념이다!
4. 또한 action의 type과 같은 상수 값들은 별도로 보관하는 것이 규칙이다.

## 7-3. action 만들어 dispatch 하기

가장 최상단의 component에서 하단의 자식 컴포넌트에 필요한 정보를 내려준다. (dispatch, tableData)

```jsx
// TicTacToe.jsx
import React, { useReducer, useCallback } from "react";
import Table from "./Table";

const initialState = {
  winner: "",
  turn: "O",
  tableData: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
};

export const SET_WINNER = "SET_WINNER";
export const CLICK_CELL = "CLICK_CELL";
export const CHANGE_TURN = "CHANGE_TURN";

const reducer = (state, action) => {
  switch (action.type) {
    case SET_WINNER:
      return {
        ...state,
        winner: action.winner,
      };
    case CLICK_CELL: {
      // 가독성이 떨어지는 spread Operater, 이후 immer라는 라이브러리로 가독성 문제를 해결해준다.
      const tableData = [...state.tableData];
      tableData[action.row] = [...tableData[action.row]];
      tableData[action.row][action.cell] = state.turn;
      return {
        ...state,
        tableData,
      };
    }
    case CHANGE_TURN: {
      return {
        ...state,
        turn: state.turn === "O" ? "X" : "O",
      };
    }
  }
};

const TicTacToe = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onClickTable = useCallback(() => {
    dispatch({ type: SET_WINNER, winner: "o" });
  }, []);

  return (
    <>
      <Table tableData={state.tableData} dispatch={dispatch} />
      {state.winner && <div>{state.winner} 님의 승리!</div>}
    </>
  );
};

export default TicTacToe;
```

tableData로 3행짜리 테이블을 만들어준 뒤 자식 컴포넌트에 rowIndex, rowData, dispatch를 상속한다.

```jsx
// Table.jsx
import React from "react";
import Tr from "./Tr";

const Table = ({ tableData, dispatch }) => {
  return (
    <table>
      {Array(tableData.length)
        .fill()
        .map((tr, i) => (
          <Tr key={Math.random() + i} rowIndex={i} rowData={tableData[i]} dispatch={dispatch} />
        ))}
    </table>
  );
};

export default Table;
```

rowData로 3열짜리 테이블을 만들어준 뒤 자식 컴포넌트에 cellIndex, rowIndex, dispatch, cellData를 상속한다.

```jsx
// Tr.jsx
import React from "react";
import Td from "./Td";

const Tr = ({ rowData, rowIndex, dispatch }) => {
  return (
    <tr>
      {Array(rowData.length)
        .fill()
        .map((td, i) => (
          <Td rowIndex={rowIndex} cellIndex={i} dispatch={dispatch} cellData={rowData[i]} key={Math.random() + i}>
            {""}
          </Td>
        ))}
    </tr>
  );
};

export default Tr;
```

상속받은 정보로 클릭 이벤트를 구현하고, 그 안에 필요한 actions를 dispatch로 실행시켜준다!

```jsx
// Td.jsx
import React, { useCallback } from "react";
import { CLICK_CELL, CHANGE_TURN } from "./TicTacToe";

const Td = ({ rowIndex, cellIndex, cellData, dispatch }) => {
  const onClickTd = useCallback(() => {
    dispatch({ type: CLICK_CELL, row: rowIndex, cell: cellIndex });
    dispatch({ type: CHANGE_TURN });
  }, []);
  return <td onClick={onClickTd}>{cellData}</td>;
};

export default Td;
```

위와 같이 TicTacToe → Table → Tr → Td로 컴포넌트에 dispatch 함수 등을 상속시켜주었다. 굉장히 귀찮고 복잡한 일인데 , 이 부분은 contextAPI를 사용하면 개선이 가능하다.

## 7-4. 틱택토 구현하기

우선 틱택토 게임의 onClick 이벤트는 useReducer를 활용해 구현을 했다. 이제 남은 것은 onClick이 중복되지 않도록 하는 것과 승자 혹은 무승부를 가려내는 일을 하면 된다.

먼저 onClick이 중복되지 않게 하기 위해서는 아래와 같이 분기를 해주면된다.

```jsx
// Td.jsx
import React, { useCallback } from "react";
import { CLICK_CELL } from "./TicTacToe";

const Td = ({ rowIndex, cellIndex, cellData, dispatch }) => {
  const onClickTd = useCallback(() => {
    // cellData가 있을 때에는 dispatch하지 않는다.
    if (cellData) {
      return;
    }
    dispatch({ type: CLICK_CELL, row: rowIndex, cell: cellIndex });
  }, [cellData]);
  return <td onClick={onClickTd}>{cellData}</td>;
};

export default Td;
```

승자를 가려내는 것은 어디에 해당 코드를 위치시킬지 먼저 고려해보자.
우선 Redux 동기적으로 State가 바뀌는 반면 useReducer는 State가 비동기적으로 바뀐다. (React에서도 State는 비동기적으로 바뀐다.) 따라서 Redux에 익숙하다면 조금 익숙하지 않게 느껴질 수도 있다.
예를 들어 상단의 onClickTd 이벤트에서 `dispatch({ type: CHANGE_TURN });` 하단에 state.turn을 찍어보면 바뀌기 전의 state.turn 값이 나온다. 이 또한 비동기적으로 action이 처리되기 때문이다.
이와 같이 비동기적으로 State가 처리되는 가운데 state를 가지고 어떤 작업을 하기 위해서는 반드시 useEffect를 사용해야 한다.

```jsx
// TicTacToe.jsx
import React, { useReducer, useCallback, useEffect } from "react";
import Table from "./Table";

const initialState = {
  winner: "",
  turn: "O",
  tableData: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
  recentCell: [-1, -1],
};

export const SET_WINNER = "SET_WINNER";
export const CLICK_CELL = "CLICK_CELL";
export const CHANGE_TURN = "CHANGE_TURN";
export const RESET_GAME = "RESET_GAME";

const reducer = (state, action) => {
  switch (action.type) {
    case SET_WINNER:
      return {
        ...state,
        winner: action.winner,
      };
    case CLICK_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...tableData[action.row]];
      tableData[action.row][action.cell] = state.turn;
      return {
        ...state,
        tableData,
        recentCell: [action.row, action.cell], // 최근에 클릭한 Cell
      };
    }
    case CHANGE_TURN: {
      return {
        ...state,
        turn: state.turn === "O" ? "X" : "O",
      };
    }
    case RESET_GAME: {
      return {
        ...state,
        turn: "O",
        tableData: [
          ["", "", ""],
          ["", "", ""],
          ["", "", ""],
        ],
        recentCell: [-1, -1],
      };
    }
    default:
      return state;
  }
};

const TicTacToe = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { winner, turn, tableData, recentCell } = state;

  const onClickTable = useCallback(() => {
    dispatch({ type: SET_WINNER, winner: "o" });
  }, []);

  // useEffect에서 승부를 따진다.
  useEffect(() => {
    const [row, cell] = recentCell;
    // 초기 돔 렌더링 시 실행되지 않도록 함!
    if (row < 0) {
      return;
    }
    let win = false;
    // 행
    if (tableData[row][0] === turn && tableData[row][1] === turn && tableData[row][2] === turn) {
      win = true;
    }
    // 열
    if (tableData[0][cell] === turn && tableData[1][cell] === turn && tableData[2][cell] === turn) {
      win = true;
    }
    // 대각선 오른쪽방향
    if (tableData[0][0] === turn && tableData[1][1] === turn && tableData[2][2] === turn) {
      win = true;
    }
    // 대각선 왼쪽방향
    if (tableData[0][2] === turn && tableData[1][1] === turn && tableData[2][0] === turn) {
      win = true;
    }
    if (win) {
      // 승자 산출
      dispatch({ type: SET_WINNER, winner: turn });
      // 게임 리셋
      dispatch({ type: RESET_GAME });
    } else {
      // 무승부 검사
      let all = true; // all이 true면 무승부이다.

      tableData.forEach((row) => {
        row.forEach((cell) => {
          if (!cell) {
            all = false; // 3X3 중에 하나라도 cell이 없으면 무승부가 아니다
          }
        });
      });

      if (all) {
        // 무승부라면 게임 리셋
        dispatch({ type: RESET_GAME });
      } else {
        // 이긴게 아니면 다음 차례
        dispatch({ type: CHANGE_TURN }); // 비동기 처리의 이슈로 인해 Td컴포넌트에서 이동
      }
    }
  }, [recentCell]);

  return (
    <>
      <Table tableData={state.tableData} dispatch={dispatch} />
      {state.winner && <div>{state.winner} 님의 승리!</div>}
    </>
  );
};

export default TicTacToe;
```
