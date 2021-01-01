// 모듈의 타입 선언(Ambient module declaration)
declare module "lodash" {
  // 1. 타입(인터페이스) 선언
  interface ILodash {
    camelCase(str?: string): string;
  }

  // 2. 타입(인터페이스)을 가지는 변수 선언
  const _: ILodash;

  // 3. 내보내기(CommonJS)
  export = _;
}
