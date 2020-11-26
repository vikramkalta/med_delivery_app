import React, { Component } from "react";

import "./shell.css";
import Header from "./header";
import RouterComponent from "./navigator";

class Shell extends Component {
  render() {
    return (
      <div className="Shell">
        <div className="HeaderWrapper">
          <Header
            headerClass="Header"
            headerLeft="HeaderLeft"
            headerRight="HeaderRight"
            textClass="App-name"
          />
        </div>
        <div className="RouterWrapper">
          <RouterComponent navigatorContainer="Navigator" />
        </div>
      </div>
    );
  }
}

export default Shell;
