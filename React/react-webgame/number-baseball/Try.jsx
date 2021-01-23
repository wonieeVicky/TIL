import React, { Component } from "react";

class Try extends Component {
  render() {
    return (
      <li key={this.props.value.name + this.props.value.description}>
        {this.props.value.name}-{this.props.value.description}
        <div>content1</div>
        <div>content2</div>
        <div>content3</div>
      </li>
    );
  }
}

export default Try;
