declare module "connect-flash" {
  global {
    namespace Express {
      interface Request {
        // 타입 확장
        flash(message: string): void;
        flash(event: string, message: string): void;
        flash(): { [key: string]: string[] };
      }
    }
  }
  import { RequestHandler } from "express";
  function flash(): RequestHandler;
  export default flash;
}
