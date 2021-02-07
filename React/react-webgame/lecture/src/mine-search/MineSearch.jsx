import React, { useReducer, createContext, useMemo, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

export const CODE = {
  OPENED: 0, // 0 이상이면 다 Opened : 정상적으로 연 칸
  NORMAL: -1, // 보통
  QUESTION: -2, // 물음표 심기
  FLAG: -3, // 깃발 심기
  QUESTION_MINE: -4, // 물음표를 꽂았는데 지뢰가 있을 때
  FLAG_MINE: -5, // 깃발을 꽂았는데 지뢰가 있을 때
  CLICKED_MINE: -6, // 지뢰를 눌렀을 때
  MINE: -7, // 지뢰
};

// 다른 파일에서 default value를 가져와 쓸 수 있도록 export 선언
export const TableContext = createContext({
  tableData: [],
  halted: true,
  dispatch: () => {},
});

const initialState = {
  tableData: [],
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

export const START_GAME = "START_GAME";
export const OPEN_CELL = "OPEN_CELL";
export const CLICK_MINE = "CLICK_MINE";
export const FLAG_CELL = "FLAG_CELL";
export const QUESTION_CELL = "QUESTION_CELL";
export const NORMALIZE_CELL = "NORMALIZE_CELL";
export const INCREMENT_TIMER = "INCREMENT_TIMER";

const reducer = (state, action) => {
  switch (action.type) {
    case START_GAME:
      return {
        ...state,
        data: {
          // 총 가로, 세로, 지뢰 갯수
          row: action.row,
          cell: action.cell,
          mine: action.mine,
        },
        openedCount: 0,
        result: "",
        tableData: plantMine(action.row, action.cell, action.mine),
        halted: false,
        timer: 0,
      };
    case OPEN_CELL: {
      const tableData = [...state.tableData];
      // 1. 모든 칸들을 다 새로운 객체로 만든다.
      tableData.forEach((row, i) => {
        tableData[i] = [...row];
      });
      // 2. 한번 검사한 칸은 다시 검사하지 않는다.
      const checked = [];
      // 총 오픈한 칸의 갯수
      let openedCount = 0;
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

        // 지뢰개수 알려주기: 상황에 따라 5칸 ~ 8칸이 될 수 있다.
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
        if (tableData[row][cell] === CODE.NORMAL) {
          openedCount += 1;
        }
        tableData[row][cell] = count;
      };
      // checkAround 함수 실행
      checkAround(action.row, action.cell);
      let halted = false;
      let result = "";
      // 승리조건 체크
      if (state.data.row * state.data.cell - state.data.mine === state.openedCount + openedCount) {
        halted = true;
        result = `${state.timer}초 만에 승리했습니다!`;
      }

      return {
        ...state,
        tableData,
        openedCount: state.openedCount + openedCount,
        halted,
        result,
      };
    }
    case CLICK_MINE:
      Data = [];
      Data = [...state.tableData];
      Data[action.row] = [...state.tableData[action.row]];
      Data[action.row][action.cell] = CODE.CLICKED_MINE;
      return {
        ...state,
        tableData: Data,
        halted: true,
      };
    case FLAG_CELL:
      Data = [];
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
      Data = [];
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
      Data = [];
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
    case INCREMENT_TIMER: {
      return {
        ...state,
        timer: state.timer + 1,
      };
    }
    default:
      return state;
  }
};

// 지뢰심기 함수 구현
const plantMine = (row, cell, mine) => {
  // 지정한 row * cell만큼의 기본 배열(0 ~ (row*cell - 1))을 만들어준다.
  const candidate = Array(row * cell)
    .fill()
    .map((arr, i) => {
      return i;
    });
  // 몇번째 칸에 지뢰가 있는지 shuffle 정렬로 뽑는다.
  const shuffle = [];
  while (candidate.length > row * cell - mine) {
    const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
    shuffle.push(chosen);
  }

  // 모든 칸에 닫힌 칸을 만든다.
  const data = [];
  for (let i = 0; i < row; i++) {
    const rowData = [];
    data.push(rowData);
    for (let j = 0; j < cell; j++) {
      rowData.push(CODE.NORMAL);
    }
  }
  // shuffle의 갯수만큼 지뢰를 심어준다.
  for (let k = 0; k < shuffle.length; k++) {
    const ver = Math.floor(shuffle[k] / cell);
    const hor = shuffle[k] % cell;
    data[ver][hor] = CODE.MINE;
  }

  return data; // tableData return
};

const MineSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tableData, halted, timer, result } = state;

  // 두번째 인자값에 dispatch는 넣어주지 않아도 된다! 항상 같은 값을 유지하므로
  const value = useMemo(() => ({ tableData, halted, dispatch }), [tableData, halted]);

  // timer
  useEffect(() => {
    if (!halted) {
      const timer = setInterval(() => dispatch({ type: INCREMENT_TIMER }), 1000);
      return () => clearInterval(timer);
    }
  }, [halted]);

  return (
    // 선언한 TableContext를 Provider로 묶어주면 하위 컴포넌트에서 모두 접근이 가능하다.
    // 데이터는 value에 넣어주는데 바로 객체값을 넣어주지 않고 상단에 useMemo를 적용한 값으로 넣어준다.
    // 그 이유는 state가 변경될 때마다 하위 모든 값들이 매번 새로 리렌더링되기 떄문이다.
    // 아래 value 또한 마찬가지인데, 이를 방지하기 위해 상단에 useMemo를 적용히여 캐싱처리 해준다.(Context API는 성능 최적화가 어렵다.)
    <TableContext.Provider value={value}>
      <Form />
      <div>{timer}</div>
      <Table />
      <div>{result}</div>
    </TableContext.Provider>
  );
};

export default MineSearch;
