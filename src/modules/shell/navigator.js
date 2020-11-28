import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Product from "../products/products";
import Cart from "../cart/cart";

class RouterComponent extends Component {
  render() {
    const { navigatorContainer } = this.props;

    return (
        <div className={navigatorContainer}>
          <Switch>
            <Route exact path="/">
              <Product />
            </Route>

            <Route exact path="/cart">
              <Cart />
            </Route>
          </Switch>
        </div>
    );
  }
}

export default RouterComponent;
