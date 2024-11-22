import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NavBar from "../components/NavBar";
import Information from "../components/Information";
import Footer from "../components/Footer";
import CopyRight from "../components/CopyRight";
import { mobile } from "../responsive";
import { fs, auth } from "./firebase";
import WishlistProducts from "../components/WishlistProducts";
import { Link } from "react-router-dom";

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

const Wishlist = () => {
  const [wishlistProducts, setWishListProducts] = useState([]);
  const uid = localStorage.getItem("userId");
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("Wishlist")
          .doc(uid)
          .collection("Items")
          .onSnapshot((snapshot) => {
            const newWishListProduct = snapshot.docs.map((doc) => ({
              ID: doc.id,
              ...doc.data(),
            }));
            setWishListProducts(newWishListProduct);
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

  return (
    <Container>
      <NavBar />
      <Information />
      <Wrapper>
        <Title>YOUR WISHLIST</Title>
        <Top>
          <Link to="/products">
            <TopButton>CONTINUE SHOPPING</TopButton>
          </Link>
          <TopTexts>
            {wishlistProducts.length > 0 && (
              <TopText>Wishlist ({wishlistProducts.length})</TopText>
            )}
          </TopTexts>
        </Top>

        {wishlistProducts.length < 1 && <Info>No Products in Wishlist</Info>}

        <Bottom>
          <Info>
            <Product>
              <ProductDetail>
                <Details>
                  <WishlistProducts wishlistProducts={wishlistProducts} />
                </Details>
              </ProductDetail>
            </Product>
            <Hr />
          </Info>
        </Bottom>
      </Wrapper>
      <Footer />
      <CopyRight />
    </Container>
  );
};

export default Wishlist;
