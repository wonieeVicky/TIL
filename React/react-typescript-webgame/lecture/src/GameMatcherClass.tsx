import * as React from "react";
import { Component } from "react";
import NumberBaseball from "./NumberBaseballClass";
import RSP from "./RSPClass";
import Lotto from "./LottoClass";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";
class GameMatcher extends Component<RouteComponentProps<{ name?: string }>> {
  render() {
    // this.props.match에 타입에러가 발생할 경우, 존재하지 않는 경우에 대한 분기처리를 추가하면 된다.
    if (!this.props.match) {
      return <div>일치하는 게임이 없습니다.</div>;
    }

    // query-string 가져오기
    // let urlSearchParams = new URLSearchParams(this.props.location.search.slice(1));
    // console.log(urlSearchParams.get("limit"));

    if (this.props.match.params.name === "number-baseball") {
      return <NumberBaseball />;
    } else if (this.props.match.params.name === "rock-scissors-paper") {
      return <RSP />;
    } else if (this.props.match.params.name === "lotto-generator") {
      return <Lotto />;
    } else {
      return <div>일치하는 게임이 없습니다.</div>;
    }
  }
}
export default withRouter(GameMatcher);
