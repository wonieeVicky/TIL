import * as React from "react"; // index.d.ts에서 export default를 지원하지 않으므로 * as를 사용한다.
import * as ReactDOM from "react-dom";

import ResponseCheck from "./ResponseCheck";

ReactDOM.render(<ResponseCheck />, document.querySelector("#root"));
