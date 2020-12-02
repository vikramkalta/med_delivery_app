import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import { withRouter } from "react-router-dom";

import { fetchHelper, getItem, SAVED_ADDRESS_ID } from "../../utils";
import "./order-summary.css";

class OrderSummary extends Component {
  constructor() {
    super();
    this.state = {
      totalMrp: 0,
      gst: 0,
      totalAmount: 0,
      cartProducts: [],
    };
  }

  async componentDidMount() {
    const savedAddressId = getItem(SAVED_ADDRESS_ID);

    const endpoint = `api/order-summary/${savedAddressId}`;
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    try {
      const response = await fetchHelper(options, endpoint);

      if (response.statusCode !== 200) {
        throw "Something went wrong while fetching order summary";
      }

      const totalMrp = response.data.reduce((total, curr) => {
        let valueToAdd = curr.PRODUCTPRICE * curr.QUANTITY;

        return total + valueToAdd;
      }, 0);

      const gst = (totalMrp * 0.18).toFixed(2);
      const totalAmount = parseInt(totalMrp, 10) + parseInt(gst, 10);

      this.setState({
        totalMrp,
        gst,
        totalAmount,
        cartProducts: response.data,
      });
    } catch (error) {
      console.log("Error while fetching order summary", error);
      throw error;
    }
  }

  renderOrderSummary() {
    return this.state.cartProducts.map((product, i) => (
      <tr>
        <td>{product.PRODUCTNAME}</td>
        <td>{product.QUANTITY}</td>
        <td> {product.PRODUCTPRICE * product.QUANTITY}</td>
      </tr>
    ));
  }

  onClickConfirmOrder() {
    // Clear the data from localStorage
    localStorage.clear()
    // Navigate to home screen
    this.props.history.push('/');
  }

  render() {
    return (
      <div className="OrderSummaryContainer">
        <Card className="OrderSummaryCard">
          <CardContent className="OrderSummaryCardContent">
            <h4>{"Order summary: "}</h4>
            <div className="OrderSummaryListContainer">
              <table className="Table">
                <tr>
                  <th>{"Product"}</th>
                  <th>{"Quantity"}</th>
                  <th>{"Total amount (Rs.)"}</th>
                </tr>
                {this.renderOrderSummary()}
              </table>
            </div>

            <div className="TotalPayableContainer">
              <div className="TotalPayableInfo">
                <div className="TextHolder">
                  <span className="Label">{"Total MRP: "}</span>
                  <span>
                    {"INR "}
                    {this.state.totalMrp}
                  </span>
                </div>
                <div className="TextHolder">
                  <span className="Label">{"GST: "}</span>
                  <span>
                    {"INR "}
                    {this.state.gst}
                  </span>
                </div>
                <div className="TextHolder">
                  <span className="Label">{"Total Amount: "}</span>
                  <span>
                    {" "}
                    {"INR "}
                    {this.state.totalAmount}
                  </span>
                </div>
              </div>

              <div className="ConfirmOrderContainer">
                <Button
                  className="ConfirmOrderButton"
                  variant="contained"
                  color="primary"
                  onClick={() => this.onClickConfirmOrder()}
                >
                  <span className="ConfirmOrderButtonText">
                    {"Confirm order"}
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default withRouter(OrderSummary);
