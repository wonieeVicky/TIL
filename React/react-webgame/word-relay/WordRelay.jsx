const { Component } = require("react");
const React = require("react");
const { Module } = require("webpack");
const { Component } = React;

class WordRelay extends Component {
  state = {};
  render() {}
}

// 바깥에서도 WordRelay를 사용할 수 있도록 export
Module.exports = WordRelay;
