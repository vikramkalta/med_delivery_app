import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import Product from "../products/products";
import Cart from "../cart/cart";
import OrderSummary from "../order-summary/order-summary";

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

            <Route exact path="/order-summary">
              <OrderSummary />
            </Route>
          </Switch>
        </div>
    );
  }
}

export default RouterComponent;
