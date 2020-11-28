import React, { Component } from "react";

import "./shell.css";
import Header from "./header";
import RouterComponent from "./navigator";
import { BrowserRouter } from "react-router-dom";

class Shell extends Component {
  render() {
    return (
      <BrowserRouter>
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
      </BrowserRouter>
    );
  }
}

export default Shell;
