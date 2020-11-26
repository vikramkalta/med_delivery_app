import React, { Component } from "react";

import Product from "../products/products";

class RouterComponent extends Component {
  render() {
    const { navigatorContainer } = this.props;
    return (
      <div className={navigatorContainer}>
        <Product />
      </div>
    );
  }
}

export default RouterComponent;
