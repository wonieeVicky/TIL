# 8. 지뢰찾기 만들기

## 8-1. Context API 소개와 지뢰찾기

지난 시간에 useReducer 사용법을 배워보았다.

useReducer는 Redux에서 차용한 개념으로 관리해야할 state가 여러 개일 때 그런 state를 하나로 묶어주는 역할, 그리고 state를 변경할 때 dispatch로 action을 처리해주는 역할을 담당했다. useReducer에서 state를 바꿀 때 이 동작이 비동기로 실행되므로 값 변경 시점에 대해 유의하여야 했다. 또, dispatch를 할 때 해당 함수를 자식 컴포넌트에 상속시켜주는 과정에서 코드의 복잡도가 높아지는 경향이 있었다.(A → B → C → D)

위의 상속 단계의 복잡도를 개선해주기 위해 Context API를 사용해볼 수 있는데, 이번 지뢰찾기를 만들어보면서 사용법에 대해 알아보자

먼저 지뢰찾기 게임에는 아래와 같은 컴포넌트가 필요하다.

1. Form 영역: 세로 n줄 + 가로 m줄 + 지뢰의 갯수 o개 + 시작버튼 (Form.jsx)
2. 타이머 영역(state.timer)
3. Table 영역(지뢰찾기 게임 영역) (Tables.jsx → Tr.jsx → Td.jsx)
4. 결과 영역(state.result)

먼저 useReducer를 사용해서 Form 영역에 시작버튼 액션을 실행시키려면 어떻게 할 수 있을까?
아래와 같이 가장 최상단의 MineSearch 컴포넌트에서 useReducer를 선언한 뒤 dispatch 함수를 자식 컴포넌트에게 상속해준다.

```jsx
// MineSearch.jsx
import React, { useReducer } from "react";
import Tables from "./Tables";

// 1. 초기 state 설정
const initialState = {
  tableData: [],
  timer: 0,
  result: "",
};

// 2. action Reducer 설정
const reducer = (state, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const MineSearch = () => {
  // 3. useReducer 선언
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <Form dispatch={dispatch} />
      {/* dispatch 함수의 상속 */}
      <div>{state.timer}</div>
      <Tables />
      <div>{result}</div>
    </>
  );
};

export default MineSearch;
```

## 8-2. createContext와 Provider

이번에는 useReducer를 이용해 dispatch를 상속하는 구조가 아닌, ContextAPI를 이용해 직접 actions을 실행시켜보자.

1. 먼저 MineSearch 컴포넌트에서 createContext를 호출하여 필요한 것들을 선언해준다.

   ```jsx
   import React, { createContext, useMemo } from "react";
   import Tables from "./Tables";

   export const START_GAME = "START_GAME";
   export const CODE = {
     OPENED: 0, // 0 이상이면 다 Opened : 정상적으로 연 칸
     NORMAL: -1, // 보통
     QUESTION: -2, // 물음표 심기
     FLAG: -3, // 깃발 심기
     QUESTION_MINE: -4, // 물음표를 꽂았는데 지뢰가 있을 때
     FLAG_MINE: -5, // 깃발을 꽂았는데 지뢰가 있을 때
     CLICK_MINE: -6, // 지뢰를 눌렀을 때
     MINE: -7, // 지뢰
   };

   // 1. createContext로 초기 값 선언
   export const TableContext = createContext({
     tableData: [],
     dispatch: () => {},
   });

   const plantMine = (row, cell, mine) => {};

   const MineSearch = () => {
     // 3. useMemo를 적용한 value 생성
     const value = useMemo(
       () => {
         tableData: state.tableData;
       },
       dispatch,
       [state.tableData]
     );
     return (
       // 2. Provider메서드로 선언한 contextAPI를 적용해준다.
       <TableContext.Provider value={value}>
         <Form />
         <div>{state.timer}</div>
         <Tables />
         <div>{result}</div>
       </TableContext.Provider>
     );
   };

   export default MineSearch;
   ```

   1. createContext 함수를 실행하여 default value를 선언해준다. 해당 값은 하위 컴포넌트에서 사용해야하므로 export 처리해줘야 한다.
   2. 선언한 TableContext를 Provider로 묶어주면 하위 컴포넌트에서 모두 접근이 가능하다.  
      데이터는 value에 넣어주는데 바로 객체값을 넣어주지 않고 useMemo를 적용한 값으로 넣어준다.  
      그 이유는 state가 변경될 때마다 하위 모든 값들이 매번 새로 리렌더링되기 떄문이다.  
      아래 value 또한 마찬가지인데, 이를 방지하기 위해 상단에 useMemo를 적용히여 캐싱처리 해준다.(Context API는 성능 최적화가 어렵다.)
   3. useMemo를 적용하여 캐싱처리가 완료된 value값을 만들어준다. dispatch는 항상 같은 값을 유지하므로 두번째 인자값에 따로 넣어주지 않아도 된다.

2. 하위 Form 컴포넌트에서 action dispatch 구현

```jsx
// Form.jsx
import React, { useState, useCallback, useContext } from "react";
// 1. 상위 컴포넌트의 default value import
import { TableContext } from "./MineSearch";

const Form = () => {
  const [row, setRow] = useState(10);
  const [cell, setCell] = useState(10);
  const [mine, setMine] = useState(20);

  // 2. useContext를 사용해 dispatch 함수를 선언
  const { dispatch } = useContext(TableContext);

  const onChangeRow = useCallback((e) => setRow(e.target.value), []);
  const onChangeCell = useCallback((e) => sestCell(e.target.value), []);
  const onChangeMine = useCallback((e) => setMine(e.target.value), []);

  // 3. 시작버튼 클릭 시 액션(START_GAME) dispatch
  const onClickBtn = useCallback(() => dispatch({ type: START_GAME, row, cell, mine }), [row, cell, mine]);

  return (
    <div>
      <input type="number" placeholder="세로" value={row} onChange={onChangeRow} />
      <input type="number" placeholder="가로" value={cell} onChange={onChangeCell} />
      <input type="number" placeholder="지뢰" value={mine} onChange={onChangeMine} />
      <button onClick={onClickBtn}>시작</button>
    </div>
  );
};

export default Form;
```

## 8-3. useContext 사용해 지뢰 칸 렌더링

먼저 상단 onClickBtn 동작시 이루어지는 START_GAME에 대한 action dispatch를 구현해보자.

```jsx
import React, { useReducer, createContext, useMemo } from "react";
import Tables from "./Tables";
import Form from "./Form";

export const START_GAME = "START_GAME";
export const CODE = { ... };
export const TableContext = createContext({ ... });
const initialState = { ... };

const reducer = (state, action) => {
	// 1. START_GAME 액션 리듀서 선언
  switch (action.type) {
    case START_GAME:
      return {
        ...state,
        tableData: plantMine(action.row, action.cell, action.mine),
      };
    default:
      return state;
  }
};

// 2. 지뢰심기 함수 구현
const plantMine = (row, cell, mine) => {
  // 2-1. 지정한 row * cell만큼의 기본 배열(0 ~ (row*cell - 1))을 만들어준다.
  const candidate = Array(row * cell)
    .fill()
    .map((arr, i) => {
      return i;
    });
  // 2-2. 몇번째 칸에 지뢰가 있는지 shuffle 정렬로 뽑는다.
  const shuffle = [];
  while (candidate.length > row * cell - mine) {
    const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
    shuffle.push(chosen);
  }
  const data = [];
  // 2-3. 모든 칸에 닫힌 칸을 만든다.
  for (let i = 0; i < row; i++) {
    const rowData = [];
    data.push(rowData);
    for (let j = 0; j < cell; j++) {
      rowData.push(CODE.NORMAL);
    }
  }
  // 2-4. shuffle의 갯수만큼 지뢰를 심어준다.
  for (let k = 0; k < shuffle.length; k++) {
    const ver = Math.floor(shuffle[k] / cell);
    const hor = shuffle[k] % cell;
    data[ver][hor] = CODE.MINE;
  }

	// 2-5. 데이터 반환
  return data;
};

const MineSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ tableData: state.tableData, dispatch }), [state.tableData]);

  return {
    <TableContext.Provider value={value}>{/* components.. */}</TableContext.Provider>
  );
};

export default MineSearch;
```

1. Form컴포넌트에서 onClickBtn이벤트로 넘어온 `START_GAME` 액션에 대한 리듀서를 작성해준다.
   Form 컴포넌트에서 정해준 row, cell, mine 갯수를 바탕으로 지뢰찾기 table이 생성된다.
2. 지뢰찾기 Table을 생성해주는 plantMine 함수를 별도로 구현해보자.
   해당 함수는 기본 테이블 생성(row \* cell) → 지뢰 위치 shuffle 정렬로 도출 → 모든 칸에 CODE.NORMAL값 부여 → shuffle 자리에 CODE.MINE(지뢰) 부여 → 데이터 변환의 과정을 거친다.

이렇게 만들어진 tableData로 실제 테이블을 그려주는 컴포넌트를 구현해보자.

```jsx
// Table.jsx
import React, { useContext } from "react";
import { TableContext } from "./MineSearch";
import Tr from "./Tr";

const Table = () => {
  // useContext를 이용해 tableData 가져오기
  const { tableData } = useContext(TableContext);
  return (
    <table>
      {Array(tableData.length)
        .fill()
        .map((tr, i) => (
          <Tr rowIndex={i} key={Math.floor(Math.random() * 1000) + i} />
        ))}
    </table>
  );
};

export default Table;
```

```jsx
// Tr.jsx
import React, { useContext } from "react";
import { TableContext } from "./MineSearch";
import Td from "./Td";

const Tr = ({ rowIndex }) => {
  // useContext를 이용해 tableData 가져오기
  const { tableData } = useContext(TableContext);
  return (
    <tr>
      {/* tableData가 Undefined인 경우에 대한 보호 처리 */}
      {tableData[0] &&
        Array(tableData.length)
          .fill()
          .map((td, i) => <Td key={i} rowIndex={rowIndex} cellIndex={i} />)}
    </tr>
  );
};

export default Tr;
```

```jsx
// Td.jsx
import React, { useContext } from "react";
import { TableContext, CODE } from "./MineSearch";

// CODE 데이터에 따른 스타일 부여
const getTdStyle = (code) => {
  switch (code) {
    case CODE.NORMAL:
    case CODE.MINE:
      return {
        background: "#444",
      };
    case CODE.OPENED:
      return {
        background: "white",
      };
    default:
      return {
        background: "white",
      };
  }
};

// CODE 데이터에 따른 텍스트 부여
const getTdText = (code) => {
  switch (code) {
    case CODE.NORMAL:
      return "";
    case CODE.MINE:
      return "x";
    default:
      return "";
  }
};

const Td = ({ rowIndex, cellIndex }) => {
  // useContext를 이용해 tableData 가져오기
  const { tableData } = useContext(TableContext);

  return <td style={getTdStyle(tableData[rowIndex][cellIndex])}>{getTdText(tableData[rowIndex][cellIndex])}</td>;
};

export default Td;
```

## 8-4. 왼쪽 오른쪽 클릭 로직 작성하기

이제 클릭을 해서 숫자를 넣는 동작을 구현해보자.
우선 Td 컴포넌트에서 각 action(클릭)에 대한 처리를 dispatch안에 정의해보자.

```jsx
// Td.jsx
import React, { useContext, useCallback } from "react";
import { TableContext, CODE, OPEN_CELL, CLICK_MINE, FLAG_CELL, QUESTION_CELL, NORMALIZE_CELL } from "./MineSearch";

const getTdStyle = (code) => { ... };
const getTdText = (code) => { ... };

const Td = ({ rowIndex, cellIndex }) => {
  const { tableData, dispatch, halted } = useContext(TableContext);

  const onClickTd = useCallback(() => {
    if (halted) {
      return;
    }
    switch (tableData[rowIndex][cellIndex]) {
      // 이미 연 칸
      // 깃발 꽂은 칸, 물음표 칸
      case CODE.OPENED:
      case CODE.FLAG_MINE:
      case CODE.FLAG:
      case CODE.QUESTION_MINE:
      case CODE.QUESTION:
        return;
      case CODE.NORMAL:
        dispatch({ type: OPEN_CELL, row: rowIndex, cell: cellIndex });
        return;
      // 지뢰 칸
      case CODE.MINE:
        dispatch({ type: CLICK_MINE, row: rowIndex, cell: cellIndex });
        return;
      default:
        return;
    }
  }, [tableData[rowIndex][cellIndex], halted]);

  // 오른쪽 이벤트 처리는 onContextMenu로 한다.
  const onRightClickTd = useCallback(
    (e) => {
      e.preventDefault();
      if (halted) {
        return;
      }
      switch (tableData[rowIndex][cellIndex]) {
        // 일반 칸 -> 깃발 칸
        case CODE.NORMAL:
        case CODE.MINE:
          dispatch({ type: FLAG_CELL, row: rowIndex, cell: cellIndex });
          return;
        // 깃발 칸 -> 물음표 칸
        case CODE.FLAG_MINE:
        case CODE.FLAG:
          dispatch({ type: QUESTION_CELL, row: rowIndex, cell: cellIndex });
          return;
        // 물음표 칸 -> 일반 칸
        case CODE.QUESTION_MINE:
        case CODE.QUESTION:
          dispatch({ type: NORMALIZE_CELL, row: rowIndex, cell: cellIndex });
          return;
        default:
          return;
      }
    },
    [tableData[rowIndex][cellIndex], halted]
  );

  return (
    <td style={getTdStyle(tableData[rowIndex][cellIndex])} onClick={onClickTd} onContextMenu={onRightClickTd}>
      {getTdText(tableData[rowIndex][cellIndex])}
    </td>
  );
};

export default Td;
```

이제 Td 컴포넌트에서 정의해둔 dispatch 이벤트를 구체화하는 과정이 남았다.

```jsx
// MineSearch.jsx
import React, { useReducer, createContext, useMemo } from "react";
import Tables from "./Tables";
import Form from "./Form";

export const CODE = { ... };

export const TableContext = createContext({
  tableData: [],
  halted: true,
  dispatch: () => {},
});

const initialState = {
  tableData: [],
  timer: 0,
  result: "",
  halted: true,
};

const plantMine = (row, cell, mine) => { ... };

export const START_GAME = "START_GAME";
export const OPEN_CELL = "OPEN_CELL";
export const CLICK_MINE = "CLICK_MINE";
export const FLAG_CELL = "FLAG_CELL";
export const QUESTION_CELL = "QUESTION_CELL";
export const NORMALIZE_CELL = "NORMALIZE_CELL";

let Data;
const reducer = (state, action) => {
  switch (action.type) {
    case START_GAME:
      return {
        ...state,
        tableData: plantMine(action.row, action.cell, action.mine),
        halted: false,
      };
    case OPEN_CELL:
      Data = [...state.tableData];
      Data[action.row] = [...state.tableData[action.row]];
      Data[action.row][action.cell] = CODE.OPENED;
      return {
        ...state,
        tableData: Data,
      };
    case CLICK_MINE:
      Data = [...state.tableData];
      Data[action.row] = [...state.tableData[action.row]];
      Data[action.row][action.cell] = CODE.CLICKED_MINE;
      return {
        ...state,
        tableData: Data,
        halted: true,
      };
    case FLAG_CELL:
      Data = [...state.tableData];
      Data[action.row] = [...state.tableData[action.row]];
      if (Data[action.row][action.cell] === CODE.MINE) {
        Data[action.row][action.cell] = CODE.FLAG_MINE;
      } else {
        Data[action.row][action.cell] = CODE.FLAG;
      }
      return {
        ...state,
        tableData: Data,
      };
    case QUESTION_CELL:
      Data = [...state.tableData];
      Data[action.row] = [...state.tableData[action.row]];
      if (Data[action.row][action.cell] === CODE.FLAG_MINE) {
        Data[action.row][action.cell] = CODE.QUESTION_MINE;
      } else {
        Data[action.row][action.cell] = CODE.QUESTION;
      }
      return {
        ...state,
        tableData: Data,
      };
    case NORMALIZE_CELL:
      Data = [...state.tableData];
      Data[action.row] = [...state.tableData[action.row]];
      if (Data[action.row][action.cell] === CODE.QUESTION_MINE) {
        Data[action.row][action.cell] = CODE.MINE;
      } else {
        Data[action.row][action.cell] = CODE.NORMAL;
      }
      return {
        ...state,
        tableData: Data,
      };
    default:
      return state;
  }
};

const MineSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tableData, halted, timer, result } = state;

  const value = useMemo(() => ({ tableData, halted, dispatch }), [tableData, halted]);

  return (
    <TableContext.Provider value={value}>
      <Form />
      <div>{timer}</div>
      <Tables />
      <div>{result}</div>
    </TableContext.Provider>
  );
};

export default MineSearch;
```

## 8-5. 지뢰 개수 표시하기

이제 `OPEN_CELL` 액션에서 빈칸을 눌렀을 때 주변에 존재하는 지뢰의 갯수를 표시해보자

```jsx
// MineSearch.jsx
const reducer = (state, action) => {
  switch (action.type) {
    case OPEN_CELL:
      Data = [];
      Data = [...state.tableData];
      Data[action.row] = [...state.tableData[action.row]];

      // 1. 지뢰 개수 표시하기
      // 윗줄, 아랫줄 유무에 따라 5칸 ~ 8칸이 될 수 있다.
      let around = [];
      // 클릭한 위치에서 윗줄이 있으면 around에 검사 field 3개 추가
      if (Data[action.row - 1]) {
        around = around.concat(
          Data[action.row - 1][action.cell - 1],
          Data[action.row - 1][action.cell],
          Data[action.row - 1][action.cell + 1]
        );
      }

      // 클릭한 위치에 양 옆 칸 검사 field 2개 추가
      around = around.concat(Data[action.row][action.cell - 1], Data[action.row][action.cell + 1]);

      // 클릭한 위치에 아랫줄이 있으면 around에 검사 field 3개 추가
      if (Data[action.row + 1]) {
        around = around.concat(
          Data[action.row + 1][action.cell - 1],
          Data[action.row + 1][action.cell],
          Data[action.row + 1][action.cell + 1]
        );
      }

			// MINE 갯수 count
      const count = around.filter((v) => [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v)).length;
      Data[action.row][action.cell] = count;

      return {
        ...state,
        tableData: Data,
      };
}
```

## 8-6. 빈 칸들 한 번에 열기

이제 누른 칸 주변을 한 번에 여는 동작을 구현해볼 차례이다. 이 부분은 재귀함수를 이용해서 구현하는데, 잘못하면 콜스택이 터지는 경우가 발생할 수 있으니 유의해서 개발해야 한다. (maximum callstack exceeded)

```jsx
const reducer = (state, action) => {
	case OPEN_CELL: {
      const tableData = [...state.tableData];
      // 1. 모든 칸들을 다 새로운 객체로 만든다.
      tableData.forEach((row, i) => {
        tableData[i] = [...row];
      });
      // 2. 한번 검사한 칸은 다시 검사하지 않는다.
      const checked = [];
      // 3. 내 기준으로 주변 칸을 검사하는 함수
      const checkAround = (row, cell) => {
        // 상하좌우 칸이 아닌 경우 (unefined)필터링
        if (row < 0 || row >= tableData.length || cell < 0 || cell >= tableData[0].length) {
          return;
        }
        // 이미 열었거나, 깃발, 물음표가 있는 경우 필터링
        if (
          [CODE.OPENED, CODE.FLAG, CODE.FLAG_MINE, CODE.QUESTION_MINE, CODE.QUESTION].includes(tableData[row][cell])
        ) {
          return;
        }
        // 닫힌 칸만 열기
        if (checked.includes(row + "/" + cell)) {
          return;
        } else {
          // 검사안한 칸이면 checked 배열에 값 push
          checked.push(row + "/" + cell);
        }

        // 지뢰개수 알려주기
        // 상황에 따라 5칸 ~8칸이 될 수 있다.

        // 클릭한 위치에 양 옆 칸 검사 field 2개 추가
        let around = [tableData[row][cell - 1], tableData[row][cell + 1]];
        // 클릭한 위치에 윗줄이 있으면 around에 검사 field 3개 추가
        if (tableData[row - 1]) {
          around = around.concat([
            tableData[row - 1][cell - 1],
            tableData[row - 1][cell],
            tableData[row - 1][cell + 1],
          ]);
        }
        // 클릭한 위치에 아랫줄이 있으면 around에 검사 field 3개 추가
        if (tableData[row + 1]) {
          around = around.concat([
            tableData[row + 1][cell - 1],
            tableData[row + 1][cell],
            tableData[row + 1][cell + 1],
          ]);
        }

        // 주변의 지뢰 갯수
        const count = around.filter((v) => [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v)).length;

        // 내가 빈칸이면 주변 8 칸을 검사
        if (count === 0) {
          // 주변칸 오픈
          if (row > -1) {
            const near = [];
            // 제일 윗 칸을 선택한 경우
            if (row - 1 > -1) {
              near.push([row - 1, cell - 1]);
              near.push([row - 1, cell]);
              near.push([row - 1, cell + 1]);
            }
            // 양 옆 칸
            near.push([row, cell - 1]);
            near.push([row, cell + 1]);
            // 제일 아랫 칸을 선택한 경우
            if (row + 1 < tableData.length) {
              near.push([row + 1, cell - 1]);
              near.push([row + 1, cell]);
              near.push([row + 1, cell + 1]);
            }
            near.forEach((n) => {
              if (tableData[n[0]][n[1]] !== CODE.OPENED) {
                checkAround(n[0], n[1]);
              }
            });
          }
        }
        tableData[row][cell] = count;
      };
      // checkAround 함수 실행
      checkAround(action.row, action.cell);

      return {
        ...state,
        tableData,
      };
    }
}
```

## 8-7. 승리 조건 체크와 타이머

마지막으로 승리 조건과 타이머를 만들어보자

승리 조건 알고리즘은 아래와 같다.
만약 5\*5의 테이블에 지뢰갯수가 10개라고 설정했다면 `25 - 10 = 15`로 계산하여 총 15개의 일반칸이 있다고 계산한다. 따라서, 펑!이 되기 전에 15개가 클릭되면 우승한 것으로 체크하는 로직이다.

또한 타이머는 시작과 동시에 halted의 값이 false가 되면 시작하며, 해당 값이 true가 되었을 때 timer가 clearInterval되어야한다!

```jsx
import React, { useReducer, createContext, useMemo, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

const initialState = {
  tableData: [],
	// 1-1. 승리조건을 계산하기 위한 data 초기값 세팅
  data: {
    row: 0,
    cell: 0,
    mine: 0,
  },
  timer: 0,
  result: "",
  halted: true,
  openedCount: 0,
};

// 2-1. 타이머 변수 생성
export const INCREMENT_TIMER = "INCREMENT_TIMER";

const reducer = (state, action) => {
  switch (action.type) {
    case START_GAME:
      return {
        ...state,
        data: {
          // 1-2. data 셋팅: 총 가로, 세로, 지뢰 갯수
          row: action.row,
          cell: action.cell,
          mine: action.mine,
        },
        openedCount: 0,
        result: "",
        tableData: plantMine(action.row, action.cell, action.mine),
        halted: false,
				// 2-2. timer 셋팅
        timer: 0,
      };
    case OPEN_CELL: {
      const tableData = [...state.tableData];
      tableData.forEach((row, i) => {
        tableData[i] = [...row];
      });
      const checked = [];

      // 1-3. 총 오픈한 칸 갯수 변수 선언
      let openedCount = 0;

      const checkAround = (row, cell) => {
        if (row < 0 || row >= tableData.length || cell < 0 || cell >= tableData[0].length) {
          return;
        }
        if ([CODE.OPENED, CODE.FLAG, CODE.FLAG_MINE, CODE.QUESTION_MINE, CODE.QUESTION].includes(tableData[row][cell])) {
          return;
        }
        if (checked.includes(row + "/" + cell)) {
          return;
        } else {
          checked.push(row + "/" + cell);
        }

        let around = [tableData[row][cell - 1], tableData[row][cell + 1]];
        if (tableData[row - 1]) {
          around = around.concat([
            tableData[row - 1][cell - 1],
            tableData[row - 1][cell],
            tableData[row - 1][cell + 1],
          ]);
        }
        if (tableData[row + 1]) {
          around = around.concat([
            tableData[row + 1][cell - 1],
            tableData[row + 1][cell],
            tableData[row + 1][cell + 1],
          ]);
        }

        const count = around.filter((v) => [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v)).length;

        if (count === 0) {
          if (row > -1) {
            const near = [];
            if (row - 1 > -1) {
              near.push([row - 1, cell - 1]);
              near.push([row - 1, cell]);
              near.push([row - 1, cell + 1]);
            }
            near.push([row, cell - 1]);
            near.push([row, cell + 1]);
            if (row + 1 < tableData.length) {
              near.push([row + 1, cell - 1]);
              near.push([row + 1, cell]);
              near.push([row + 1, cell + 1]);
            }
            near.forEach((n) => {
              if (tableData[n[0]][n[1]] !== CODE.OPENED) {
                checkAround(n[0], n[1]);
              }
            });
          }
        }
				// 1-4. 일반 칸일 경우에만 openedCount 카운트
        if (tableData[row][cell] === CODE.NORMAL) {
          openedCount += 1;
        }
        tableData[row][cell] = count;
      };

      checkAround(action.row, action.cell);

			// 1-5. 승리 조건 체크
      let halted = false;
      let result = "";
      if (state.data.row * state.data.cell - state.data.mine === state.openedCount + openedCount) {
        halted = true;
        result = `${state.timer}초 만에 승리했습니다!`;
      }

      return {
        ...state,
        tableData,
        openedCount: state.openedCount + openedCount, // 1-6. 카운트 갯수 반환
        halted, // 1-7. 게임 완료 staus 반환
        result, // 1-8. 결과 text 반환
      };
    }
  }
};

const MineSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tableData, halted, timer, result } = state;
  const value = useMemo(() => ({ tableData, halted, dispatch }), [tableData, halted]);

  // 2-3. timer 동작: halted가 false일 때만!
  useEffect(() => {
    if (!halted) {
      const timer = setInterval(() => dispatch({ type: INCREMENT_TIMER }), 1000);
      return () => clearInterval(timer);
    }
  }, [halted]);

  return ( ... );
};

export default MineSearch;
```

## 8-8. Context api 최적화

1.  먼저 Context api의 value 값을 넣어줄 때 반드시 `useMemo`로 값을 기억해줘야 한다.
    이유는 state가 변경될 때마다 하위 모든 값들이 매번 새로 리렌더링 되기 때문이다.

        ```jsx
        const value = useMemo(() => ({ tableData, halted, dispatch }), [tableData, halted]);
        ```

2.  자식 컴포넌트들에 모두 `memo` 를 넣어준다.(Form, Table, Tr, Td.jsx)
3.  `useContext`를 쓰면 기본적으로 함수 자체가 리렌더링되므로, 실제 return 영역에서 불필요한 리렌더링이 발생하지 않는지를 콘솔 디버깅으로 확인하고, 만약 return 함수에 `useMemo`를 사용하는 것이 싫다면 별도의 함수로 빼서 `memo`를 적용시키는 것도 좋은 방법이다.

    ```jsx
    // Td.jsx
    const Td = () => {
    	return <RealTd onClickTd={onClickTd} onRightClickTd={onRightClickTd} data={tableData[rowIndex][cellIndex]} />;
    });

    const RealTd = memo(({ onClickTd, onRightClickTd, data }) => {
      console.log("real td rendered");
      return (
        <td style={getTdStyle(data)} onClick={onClickTd} onContextMenu={onRightClickTd}>
          {getTdText(data)}
        </td>
      );
    });
    ```
