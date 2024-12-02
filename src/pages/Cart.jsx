import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NavBar from "../components/NavBar";
import Information from "../components/Information";
import Footer from "../components/Footer";
import CopyRight from "../components/CopyRight";
import { mobile } from "../responsive";
import { auth, fs } from "./firebase";
import CartProducts from "../components/CartProducts";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Modal from "../components/Modal";

toast.configure();

const Container = styled.div`
  overflow: hidden;
`;
const Wrapper = styled.div`
  padding: 20px;
  ${mobile({ padding: "10px" })};
`;
const Title = styled.h2`
  font-weight: 300;
  text-align: center;
`;
const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;
const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border: ${(props) => props.type === "filled" && "none"};
  background-color: ${(props) =>
    props.type === "filled" ? "black" : "transparent"};
  color: ${(props) => props.type === "filled" && "white"};

  ${mobile({ margin: "10px" })};
`;

const TopTexts = styled.div`
  ${mobile({ display: "none" })};
`;
const TopText = styled.span`
  text-decoration: underline;
  margin: 0px 10px;
  cursor: pointer;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })};
`;
const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })};
`;
const ProductDetail = styled.div`
  display: flex;
  flex: 2;
`;

const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
  margin: 10px;
`;

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  padding: 20px;
  border-radius: 10px;
  height: 40vh;
`;

const SummaryTitle = styled.h2`
  font-weight: 200;
`;
const SummaryItem = styled.div`
  margin: 30px 0;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === "total" && "500"};
  font-size: ${(props) => props.type === "total" && "24px"};
`;
const SummaryItemText = styled.span``;
const SummaryItemTotal = styled.span``;
const SummaryItemPrice = styled.span``;
// const Button = styled.button`
//   width: 100%;
//   padding: 10px;
//   background-color: black;
//   color: white;
//   font-weight: 600;
// `;

const Cart = () => {
  //state of cart products
  const [cartProducts, setCartProducts] = useState([]);

  //getting cart products from firestore collection and updating state of cart
  const uid = localStorage.getItem("userId");
  useEffect(() => {
    auth?.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("Cart")
          .doc(uid)
          .collection("Items")
          .onSnapshot((snapshot) => {
            const newCartProduct = snapshot.docs.map((doc) => ({
              ID: doc.id,
              ...doc.data(),
            }));
            setCartProducts(newCartProduct);
          });
      } else {
        console.log("user is not signed in");
      }
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [uid]);

  // getting quantity from cart product in a separate array
  const quantity = cartProducts?.map((cartProduct) => {
    return cartProduct.quantity;
  });
  //reducing quantity in single value
  const reducerOfQty = (accumulator, currentValue) =>
    accumulator + currentValue;
  const totalQuantity = quantity.reduce(reducerOfQty, 0);

  // getting TotalProductPrice from cart product in a separate array

  let TotalProductPrice = 0;
  cartProducts.forEach((cartProduct) => {
    TotalProductPrice =
      TotalProductPrice + cartProduct.price * cartProduct.quantity;
  });

  let deliveryFee = "FREE";

  //charging payment

  const navigate = useHistory();

  let localId = localStorage.getItem("userId");

  const deleteCart = () => {
    if (!cartProducts || cartProducts.length === 0) return;
    cartProducts.forEach((cartProduct) => {
      fs.collection(`Cart${localId}`).doc(cartProduct.ID).delete();
    });
  };

  const handleToken = async (token) => {
      const cart = { name: "All Products", TotalProductPrice };
      // Simulate successful response
      const response = await axios.post("https://e-commerce-tiannah.vercel.app/checkout", {
        token,
        cart,
      });
     console.log(response);
     let { status } = response.data;

      if (status ="success") {
        const uid = auth?.currentUser?.uid; // Ensure user is authenticated
        
        // Add order to Firestore
        await fs.collection("Orders").add({
          OrderPrice: TotalProductPrice,
          OrderQuantity: totalQuantity,
          UserId: uid,
          OrderItems: cartProducts,
          PaymentMethod: "Stripe/Card",
        });

        // Clear cart
        deleteCart();

        // Redirect and notify
        toast.success("Your order has been placed successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
        setTimeout(() => {
          navigate.push("/products");
        }, 3000);

      } else {
        toast.error(
          "Something went wrong during checkout. Please try again.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          }
        );
      }
  };

  //showing modal cash on delivery state

  // const [showModal, setShowModal] = useState(false);

  //trigger modal
  // const triggerModal = () => {
  //   setShowModal(true);
  // };

  //hide modal
  // const hideModal = () => {
  //   setShowModal(false);
  // };

  return (
    <Container>
      <NavBar />
      <Information />
      <Wrapper>
        <ToastContainer />
        <Title>YOUR CART</Title>
        <Top>
          <Link to="/products">
            <TopButton>CONTINUE SHOPPING</TopButton>
          </Link>
          <TopTexts>
            {cartProducts.length > 0 && (
              <TopText>Shopping Bag ({totalQuantity})</TopText>
            )}
          </TopTexts>
          <div>
            <StripeCheckout
              stripeKey="pk_test_51KGRP6EVzyUnSBi9XFfZSbOyBlp6bxDi470qqy0rON2MVmH322KgZOsa8xNeURp09bV098TUebGfyoI8BuHqudpc00mYmz4ZXS"
              token={handleToken}
              billingAddress
              shippingAddress
              name="All Products"
              amount={TotalProductPrice * 100}
            >
              <TopButton type="filled">MAKE PAYMENT</TopButton>
            </StripeCheckout>
          </div>
        </Top>

        {cartProducts.length < 1 && <Info>No Products in Cart</Info>}

        <Bottom>
          <Info>
            <Product>
              <ProductDetail>
                <Details>
                  <CartProducts cartProducts={cartProducts} />
                </Details>
              </ProductDetail>
            </Product>
            <Hr />
          </Info>
          <Summary>
            <SummaryTitle>ORDER SUMMARY</SummaryTitle>
            <SummaryItem>
              <SummaryItemText>No. of Items</SummaryItemText>
              <SummaryItemTotal>{totalQuantity}</SummaryItemTotal>
            </SummaryItem>

            <SummaryItem>
              <SummaryItemText>Delivery Fee</SummaryItemText>
              <SummaryItemPrice>$ {deliveryFee}</SummaryItemPrice>
            </SummaryItem>

            <SummaryItem type="total">
              <SummaryItemText>Total</SummaryItemText>
              <SummaryItemPrice>$ {TotalProductPrice}</SummaryItemPrice>
            </SummaryItem>

            {/* <Button onClick={() => triggerModal()}>CASH ON DELIVERY</Button> */}

            {/* {showModal === true && (
              <Modal
                TotalProductPrice={TotalProductPrice}
                totalQuantity={totalQuantity}
                hideModal={hideModal}
              />
            )} */}
          </Summary>
        </Bottom>
      </Wrapper>
      <Footer />
      <CopyRight />
    </Container>
  );
};

export default Cart;
