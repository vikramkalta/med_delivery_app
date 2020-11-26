import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

import "./products.css";
import { fetchHelper } from "../../utils/fetch-helper";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productList: [],
    };
  }

  async componentDidMount() {
    const endpoint = "api/products";
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetchHelper(options, endpoint);
      console.log("Response products---->", response);
      if (response.statusCode >= 200 || response.statusCode <= 300) {
        this.setState({ productList: response.data });
      }
    } catch (error) {
      // Proper error handling required
      throw error;
    }
  }

  renderProductList() {
    return this.state.productList.map((product, i) => (
      <Card key={i.toString()} className="Product">
        <CardContent className='CardContent'>
          <div className="ProductInfo">
            <span className="Field">{"Category: "}</span>
            <span className="Value">
              &nbsp;&nbsp;&nbsp;&nbsp;{product.category}
            </span>
          </div>
          <div className="ProductInfo">
            <span className="Field">{"Name: "}</span>
            <span className="Value">
              &nbsp;&nbsp;&nbsp;&nbsp;{product.productName}
            </span>
          </div>
          <div className="ProductInfo">
            <span className="Field">{"Price: "}</span>
            <span className="Value">
              &nbsp;&nbsp;&nbsp;&nbsp;{`INR ${product.productPrice}`}
            </span>
          </div>
          <div className='ButtonWrapper'>
            <Button variant="contained">{'Add'}</Button>
          </div>
        </CardContent>
      </Card>
    ));
  }

  render() {
    return <div className="ProductContainer">{this.renderProductList()}</div>;
  }
}

export default Product;
