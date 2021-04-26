import * as React from "react";
import { FunctionComponent } from "react";
import { TryInfo } from "./types";

// props에 대한 타이핑
// state는 useState가 대체했으므로 제네릭에서는 타이핑이 없다.
const Try: FunctionComponent<{ tryInfo: TryInfo }> = ({ tryInfo }) => {
  return (
    <li>
      <div>{tryInfo.try}</div>
      <div>{tryInfo.result}</div>
    </li>
  );
};

export default Try;
