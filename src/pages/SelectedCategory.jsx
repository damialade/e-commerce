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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

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


    // Check authentication state before proceeding
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        localStorage.removeItem("userId"); 
      } else {
        localStorage.setItem("userId", user.uid); 
      }
    });

    return () => unsubscribe(); 
  }, []);

  const addToFavorite = async(product) => {
    const uid = auth?.currentUser?.uid || localStorage.getItem("userId");
    if (uid && uid !== "null") {
      const wishlistItem = { ...product, qty: 1 };

    try {
        await fs
          .collection("Wishlist")
          .doc(uid)
          .collection("Items")
          .doc(product.ID)
          .set(wishlistItem);

        toast.success(
          "Your item has been added successfully to your WishList"
        );
      } catch (error) {
        console.error("Error adding item to wishlist:", error);
        toast.error("There was an issue adding the product to your WishList.");
      }
    } else {
      toast.error("Please log in to add items to the WishList.");
        navigate.push("/login"); 
  };
  }

  return (
    <Container>
      <NavBar />
      <Information />
      <Title> {category} </Title>
      <Wrapper>
        <ToastContainer />
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
