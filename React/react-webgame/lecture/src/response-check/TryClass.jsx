import React, { PureComponent } from "react";

class Try extends PureComponent {
  state = {
    result: this.props.tryInfo.result,
    try: this.props.tryInfo.divtry,
  };
  render() {
    return (
      <li>
        <div>{this.state.try}</div>
        <div>{this.state.result}</div>
      </li>
    );
  }
}

export default Try;
