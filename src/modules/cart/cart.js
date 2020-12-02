import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import Modal from "@material-ui/core/Modal";
import { withRouter } from "react-router-dom";

import "./cart.css";

import {
  getItem,
  setItem,
  PRODUCTS_STORAGE_KEY,
  SAVED_ADDRESS_ID,
  fetchHelper,
} from "../../utils";

class Cart extends Component {
  constructor() {
    super();

    const cartProducts = getItem(PRODUCTS_STORAGE_KEY);
    this.state = {
      cartProducts,
      totalMRP: 0,
      gst: 0,
      modalOpen: false,
    };
  }

  addProductQuantity(productID) {
    const { cartProducts } = this.state;

    if (cartProducts && cartProducts.length) {
      for (let i = 0; i < cartProducts.length; i++) {
        const product = cartProducts[i];

        if (product.productID === productID) {
          if (product.quantity && product.quantity >= 10)
            // Can't add more
            return;

          product.quantity = (product.quantity || 1) + 1;
          product.totalPrice = product.quantity * product.productPrice;

          break;
        }
      }
    }
    // Update localstorage
    setItem(PRODUCTS_STORAGE_KEY, cartProducts);
    // Update state
    this.setState({ cartProducts });
  }

  removeProductQuantity(productID) {
    const { cartProducts } = this.state;

    if (cartProducts && cartProducts.length) {
      for (let i = 0; i < cartProducts.length; i++) {
        const product = cartProducts[i];

        if (product.productID === productID) {
          if (!product.quantity || product.quantity === 1) {
            // operation not allowed
            // Update localStorage, remove product
            cartProducts.splice(i, 1);
            break;
          }
          product.quantity--;
          product.totalPrice = product.quantity * product.productPrice;
          break;
        }
      }
    }
    // Update localstorage
    setItem(PRODUCTS_STORAGE_KEY, cartProducts);
    // Update state
    this.setState({ cartProducts });
  }

  renderCartProducts() {
    const { cartProducts } = this.state;

    if (cartProducts && cartProducts.length) {
      // console.log("cartProducts----->", cartProducts);
      return cartProducts.map((product, i) => (
        <div className="CardContainer" key={i.toString()}>
          <Card className="CardCart">
            <CardContent className="CardContentCart">
              <div className="ProductInfo">
                <span className="Field">{"Name: "}</span>
                <span className="Value">
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  {product.productName}
                </span>
              </div>
              <div className="ProductInfo">
                <span className="Field">{"Total price: "}</span>
                <span className="Value">
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  {"INR "}
                  {product.totalPrice || product.productPrice}
                </span>
              </div>
              <div className="ProductInfo">
                <span className="Field">{"Quantity: "}</span>
                <span className="Value">
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  {"quantity" in product ? product.quantity : 1}
                </span>
              </div>

              <div className="QuantityControllerContainer">
                <div
                  className="Icon"
                  onClick={() => this.addProductQuantity(product.productID)}
                >
                  <AddCircleIcon />
                </div>
                <div
                  className="Icon"
                  onClick={() => this.removeProductQuantity(product.productID)}
                >
                  <RemoveCircleIcon />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ));
    }
    return <span>{"No items selected."}</span>;
  }

  handleOpen() {
    this.setState({ modalOpen: true });
  }
  handleClose() {
    this.setState({ modalOpen: false });
  }

  renderOrderSummary() {
    const { cartProducts } = this.state;
    const totalMRP = cartProducts.reduce((total, curr) => {
      let valueToAdd = curr.totalPrice;

      if (!curr.totalPrice) valueToAdd = curr.productPrice;

      return total + valueToAdd;
    }, 0);

    const gst = (totalMRP * 0.18).toFixed(2);

    return (
      <Card className="OrderSummaryInfo">
        <CardContent className="CardContentCartPlaceorder">
          <div className="ProductInfo">
            <span className="Field">{"Total MRP: "}</span>
            <span className="Value">
              &nbsp;&nbsp;&nbsp;&nbsp;
              {"INR "}
              {totalMRP || 0}
            </span>
          </div>

          <div className="ProductInfo">
            <span className="Field">{"GST (18%): "}</span>
            <span className="Value">
              &nbsp;&nbsp;&nbsp;&nbsp;
              {"INR "}
              {gst || 0}
            </span>
          </div>

          <div className="ProductInfo">
            <span className="Field">{"Total Amount: "}</span>
            <span className="Value">
              &nbsp;&nbsp;&nbsp;&nbsp;
              {"INR "} {parseInt(totalMRP) + parseFloat(gst)}
            </span>
          </div>

          <div className="PlaceOrderButton">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => this.handleOpen()}
            >
              {/* {"Place order"} */}
              <span className="PlaceOrderButtonText">Place order</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  onChangeText(event, type) {
    this.setState({ [type]: event.target.value });
  }

  async onClickSaveAddress() {
    // Save address and order summary to backend
    try {
      const saveAddressEndpoint = "api/address";

      const body = {
        contactName: this.state.name,
        contactNumber: this.state.mobile,
        pincode: this.state.pincode,
        streetAddress: this.state.address,
        city: this.state.city,
        state: this.state.state || 'Maharashtra',
      };
      const saveAddressOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      };
      const saveAddressResponse = await fetchHelper(
        saveAddressOptions,
        saveAddressEndpoint
      );
      // console.log("saveAddressResponse", saveAddressResponse);
      if (saveAddressResponse.statusCode !== 200) {
        throw "Error occured while saving address";
      }
      setItem(SAVED_ADDRESS_ID, saveAddressResponse.data);

      const storedProducts = getItem(PRODUCTS_STORAGE_KEY);

      const finalProducts = [];
      for (let i = 0; i < storedProducts.length; i++) {
        finalProducts.push({
          addressID: saveAddressResponse.data,
          productID: storedProducts[i].productID,
          quantity: storedProducts[i].quantity || 1,
        });
      }

      const saveCartProductsEndpoint = "api/cart-product";
      const saveFinalProductOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalProducts),
      };
      const saveCartProductsResponse = await fetchHelper(
        saveFinalProductOptions,
        saveCartProductsEndpoint
      );
      // console.log("saveCartProductsResponse", saveCartProductsResponse);
      if (saveCartProductsResponse.statusCode !== 200) {
        throw "Error occured while saving cart products";
      }
      // Navigate to Confirm order screen
      this.props.history.push("/order-summary");
    } catch (error) {
      console.log("Error occured while saving address[catch-block]", error);
      throw error;
    }
  }

  renderModalBody() {
    return (
      <div className="ModalContainer">
        <div className="ModalHeader">
          <span className="HeaderText">{"ADD DELIVERY ADDRESS"}</span>
        </div>

        <div className="ContactDetails">
          <div>
            <span className="Title">CONTACT DETAILS</span>
          </div>
          <div className="TextInput">
            <input
              type="text"
              placeholder="Name"
              value={this.state.name}
              onChange={(value) => this.onChangeText(value, "name")}
            />
          </div>
          <div className="TextInput">
            <input
              type="text"
              placeholder="Mobile No"
              value={this.state.mobile}
              onChange={(value) => this.onChangeText(value, "mobile")}
            />
          </div>
        </div>

        <div className="Address">
          <div>
            <span className="Title">ADDRESS</span>
          </div>
          <div className="TextInput">
            <input
              type="text"
              placeholder="Pin Code"
              value={this.state.pincode}
              onChange={(value) => this.onChangeText(value, "pincode")}
            />
          </div>
          <div className="TextInput">
            <input
              type="text"
              placeholder="Address (House No, Building, Street, Area)"
              value={this.state.address}
              onChange={(value) => this.onChangeText(value, "address")}
            />
          </div>
          <div className="TextInput">
            <input
              type="text"
              placeholder="Locality/Town"
              value={this.state.locality}
              onChange={(value) => this.onChangeText(value, "locality")}
            />
          </div>
          <div className="TextInput">
            <input
              type="text"
              placeholder="City"
              value={this.state.city}
              onChange={(value) => this.onChangeText(value, "city")}
            />
          </div>
        </div>

        <div className="AddAddressButtonWrapper">
          <Button
            className="ModalButton"
            variant="contained"
            color="secondary"
            onClick={() => this.onClickSaveAddress()}
          >
            <span className="ModalButtonText">{"ADD ADDRESS"}</span>
          </Button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="ContainerCart">
        <div className="ContainerCartProducts">{this.renderCartProducts()}</div>
        <div className="OrderSummary">{this.renderOrderSummary()}</div>
        <Modal
          open={this.state.modalOpen}
          onClose={() => this.handleClose()}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {this.renderModalBody()}
        </Modal>
      </div>
    );
  }
}

export default withRouter(Cart);
