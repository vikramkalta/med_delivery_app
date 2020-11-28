import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

import "./products.css";
// import { fetchHelper } from "../../utils/fetch-helper";
import {
  fetchHelper,
  getItem,
  setItem,
  PRODUCTS_STORAGE_KEY,
} from "../../utils";
import { getHeaderRef } from "../shell/header";

class Product extends Component {
  constructor(props) {
    super(props);

    this.state = { productList: [] };
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

      if (response.statusCode >= 200 || response.statusCode <= 300) {
        const productList = getItem(PRODUCTS_STORAGE_KEY) || [];

        if (productList.length)
          for (let i = 0; i < response.data.length; i++) {
            const data = response.data[i];
            for (let j = 0; j < productList.length; j++) {
              const product = productList[j];
              
              // Merge the products if found
              if (product.productID === data.productID) {
                response.data[i] = product;
                break;
              }
            }
          }
        this.setState({ productList: response.data });
      }
    } catch (error) {
      // Proper error handling required
      throw error;
    }
  }

  onButtonClick(productID) {
    let foundProduct = getItem(PRODUCTS_STORAGE_KEY) || [];

    // Initialise
    if (!foundProduct.length) {
      for (let i = 0; i < this.state.productList.length; i++) {
        const product = this.state.productList[i];
        if (product.productID === productID) {
          product.isAdded = true;
          foundProduct.push(product);
          break;
        }
      }
      setItem(PRODUCTS_STORAGE_KEY, foundProduct);
      this.setState({ productList: this.state.productList });
    } else {
      let productToAddOrRemove;

      // Get the product from the storage
      for (let i = 0; i < foundProduct.length; i++) {
        const product = foundProduct[i];
        if (product.productID === productID) {
          productToAddOrRemove = product;
          // Remove the object from the array
          foundProduct.splice(i, 1);
          // Set the final product array in storage
          setItem(PRODUCTS_STORAGE_KEY, foundProduct);
          break;
        }
      }

      // If product is found
      if (productToAddOrRemove) {
        for (let i = 0; i < this.state.productList.length; i++) {
          const product = this.state.productList[i];
          if (product.productID === productID) {
            product.isAdded = false;
            break;
          }
        }
        this.setState({ productList: this.state.productList });
      }
      // If product is not found
      if (!productToAddOrRemove) {
        for (let i = 0; i < this.state.productList.length; i++) {
          const product = this.state.productList[i];
          if (product.productID === productID) {
            product.isAdded = true;
            productToAddOrRemove = product;
            break;
          }
        }
        foundProduct.push(productToAddOrRemove);
        setItem(PRODUCTS_STORAGE_KEY, foundProduct);
        this.setState({ productList: this.state.productList });
      }
    }

    // Gets ref to header component and calls tickCounter method to update state
    const headerRef = getHeaderRef();
    headerRef.tickCounter();
  }

  renderProductList() {
    return this.state.productList.map((product, i) => (
      <Card key={i.toString()} className="Product">
        <CardContent className="CardContent">
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
          <div className="ButtonWrapper">
            <Button
              onClick={() => this.onButtonClick(product.productID)}
              variant="contained"
            >
              {product.isAdded ? "Remove" : "Add"}
            </Button>
          </div>
        </CardContent>
      </Card>
    ));
  }

  // TODO: Handle state after refresh, get data from storage if present
  render() {
    return <div className="ProductContainer">{this.renderProductList()}</div>;
  }
}

export default Product;
