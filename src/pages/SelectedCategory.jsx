import React, { useEffect, useState } from "react";
import { fs } from "./firebase";
import styled from "styled-components";
import NavBar from "../components/NavBar";
import Information from "../components/Information";
import NewsLetter from "../components/NewsLetter";
import Footer from "../components/Footer";
import CopyRight from "../components/CopyRight";
import LoadingSpinner from "../components/LoadingSpinner";
import IndividualProduct from "../components/IndividualProduct";
import { useParams, useHistory } from "react-router-dom";

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;
const Title = styled.h2`
  margin: 20px;
`;

const SelectedCategory = () => {
  const params = useParams();
  const navigate = useHistory();

  const { category } = params;

  //retrieving all products from firebase
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    const products = await fs.collection("Products").get();
    const productsArray = [];
    for (var snap of products.docs) {
      var data = snap.data();
      data.ID = snap.id;
      productsArray.push({
        ...data,
      });
      if (productsArray.length === products.docs.length) {
        setProducts(productsArray);
      }
    }
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    getAllProducts();
  }, []);

  const selectedCategory = products.filter(
    (product) => product.category === category
  );

  // Define addToFavorite function here
  const addToFavorite = (product) => {
    const uid = localStorage.getItem("userId");

    if (!uid) {
      navigate.push("/login");
    } else {
      const Wishlist = { ...product, qty: 1 };
      fs.collection("WishList" + uid)
        .doc(product.ID)
        .set(Wishlist)
        .then(() => {
          console.log("Successfully added to wishlist");
        })
        .catch((error) => {
          console.log("Error adding to wishlist:", error);
        });
    }
  };

  return (
    <Container>
      <NavBar />
      <Information />
      <Title> {category} </Title>
      <Wrapper>
        {selectedCategory.map((individualProduct) => (
          <IndividualProduct
            key={individualProduct}
            individualProduct={individualProduct}
            addToFavorite={addToFavorite}
          />
        ))}
      </Wrapper>
      {products.length < 1 && <LoadingSpinner />}

      <NewsLetter />
      <Footer />
      <CopyRight />
    </Container>
  );
};

export default SelectedCategory;
