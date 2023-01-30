declare global {
  namespace Express {
    interface Response {
      vicky: string;
    }

    interface User {
      vicky: string;
    } // 이 부분을 확장해야
    interface Request {
      vicky: string;
    }
  }

  interface Error {
    status: number;
  }
}

export {};
