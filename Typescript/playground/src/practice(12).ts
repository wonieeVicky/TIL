// 12. 모듈
// 1) 내보내기와 가져오기
// 인터페이스나 타입 별칭 모듈로 내보내기

// myTypes.ts
// 인터페이스 내보내기
export interface IUser {
  name: string;
  age: number;
}
// 타입 별칭 내보내기
export type MyType = string | number;

// 선언한 모듈(myTypes.ts)가져오기
import { IUser, MyType } from "./myTypes";
const user: IUser = {
  name: "Vicky",
  age: 31,
};
const something: MyType = true; // Error - TS2322: Type 'true' is not assignable to type 'MyType'.

// CommonJS/ AMD/ UMD 모듈을 위한 내보내기, 가져오기
// CommonJS/AMD/UMD
import ABC = require("abc");
// or
import * as ABC from "abc";
// or `"esModuleInterop": true`
import ABC from "abc";
