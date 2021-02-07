import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import Lotto from "./src/lotto/Lotto";
import RSP from "./src/rock-paper-scissors/RSP";
import NumberBaseball from "./src/number-baseball/NumberBaseball";

class GameMatcher extends Component {
  render() {
    const urlSearchParams = new URLSearchParams(this.props.location.search.slice(1));
    urlSearchParams.get("hello"); // vicky

    const { name } = this.props.match.params;
    if (name === "number-baseball") {
      return <NumberBaseball />;
    } else if (name === "rock-scissors-paper") {
      return <RSP />;
    } else if (name === "lotto-generator") {
      return <Lotto />;
    }

    return <div>일치하는 게임이 없습니다!</div>;
  }
}

export default withRouter(GameMatcher);
