declare module "lodash" {
  interface ILodash {
    camelCase(str?: string): string;
  }
  const _: ILodash;
  export = _;
}
