const React = require("react");
const { Component } = React;

class WordRelay extends Component {
  state = {
    word: "비키",
    value: "",
    result: "",
  };

  onSubmitForm = (e) => {
    e.preventDefault();
    if (this.state.word[this.state.word.length - 1] === this.state.value[0]) {
      this.setState({
        result: "딩동댕!",
        word: this.state.value,
        value: "",
      });
      this.input.focus();
    } else {
      this.setState({
        result: "땡",
        value: "",
      });
      this.input.focus();
    }
  };

  onChange = (e) => {
    this.setState({ value: e.currentTarget.value });
  };

  onRefInput = (c) => {
    this.input = c;
  };

  render() {
    return (
      <>
        <div>{this.state.word}</div>
        <form onSubmit={this.onSubmitForm}>
          {/* onChange와 value를 사용하지 않으려면 defaultValue 프로퍼티를 꼭 적어줘야 에러가 안난다. */}
          <input ref={this.onRefInput} onChange={this.onChange} value={this.state.value} />
          <button>입력</button>
        </form>
        <div>{this.state.result}</div>
      </>
    );
  }
}

module.exports = WordRelay;
