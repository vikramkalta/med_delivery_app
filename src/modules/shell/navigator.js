import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Product from "../products/products";
import Cart from "../cart/cart";

class RouterComponent extends Component {
  render() {
    const { navigatorContainer } = this.props;
    // return (
    //   <div className={navigatorContainer}>
    //     <Product />
    //   </div>
    // );
    return (
      <Router>
        <div className={navigatorContainer}>
          <Switch>
            <Route path="/">
              <Product />
            </Route>

            <Route path="/cart">
              <Cart />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default RouterComponent;
