import React, { Component } from "react";
import { ShoppingCart } from "@material-ui/icons";
import { Link } from "react-router-dom";

import "./shell.css";
import { getItem, PRODUCTS_STORAGE_KEY } from "../../utils";

let ref = null;

class Header extends Component {
  constructor() {
    super();
    ref = this;

    const storedItems = getItem(PRODUCTS_STORAGE_KEY);
    this.state = { counter: storedItems ? storedItems.length : 0 };
  }

  // This is called from Product component's add button
  tickCounter() {
    const storedItems = getItem(PRODUCTS_STORAGE_KEY);
    this.setState({ counter: storedItems ? storedItems.length : 0 });
  }

  onClickCart() {}

  renderCounter() {
    if (!this.state.counter) return null;
    return (
      <div className="Counter">
        <span className="CounterText">{this.state.counter}</span>
      </div>
    );
  }

  render() {
    const { headerClass, headerLeft, headerRight, textClass } = this.props;
    return (
      <div className={headerClass}>
        <Link to="/">
          <div className={headerLeft}>
            <img
              src="medicine-delivery.webp"
              height="30px"
              width="30px"
              alt="Medicine delivery logo"
            />
            <span>&nbsp;&nbsp;</span>
            <h3 className={textClass}>{"Medicine on wheels"}</h3>
          </div>
        </Link>

        <div className={headerRight}>
          <Link to={this.state.counter > 0 ? "/cart" : "#"}>
            <ShoppingCart fontSize={"large"} />
          </Link>

          {this.renderCounter()}
        </div>
      </div>
    );
  }
}

export default Header;

export const getHeaderRef = () => ref;
