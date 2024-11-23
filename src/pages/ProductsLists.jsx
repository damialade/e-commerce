import React, { useEffect, useState } from "react";
import { fs, auth } from "./firebase";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import NavBar from "../components/NavBar";
import Information from "../components/Information";
import AllProducts from "../components/AllProducts";
import NewsLetter from "../components/NewsLetter";
import Footer from "../components/Footer";
import CopyRight from "../components/CopyRight";
import { mobile } from "../responsive";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

const Container = styled.div``;

const Title = styled.h2`
  margin: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Filter = styled.div`
  margin: 20px;
  ${mobile({ width: "0 20px", display: "flex", flexDirection: "column" })};
`;

const FilterText = styled.p`
  font-size: 20px;
  font-weight: 600;
  margin-right: 20px;
  ${mobile({ marginRight: "0px" })};
`;

const ProductsLists = () => {
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
    getAllProducts();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const navigate = useHistory();

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
   const user = auth?.currentUser || null;
    const uid = user?.uid || localStorage.getItem("userId");

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
     
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  };


  //categories list rendering
  const [spans] = useState([
    { id: "Dresses", text: "Dresses" },
    { id: "Blazers", text: "Blazers" },
    { id: "Loungewears", text: "Loungewears" },
  ]);

  return (
    <Container>
      <NavBar />
      <Information />
      <ToastContainer />

      <Title>All Products</Title>
      <FilterContainer>
        <Filter>
          <FilterText>Filter Products by Category:</FilterText>

          {spans.map((individualSpan, index) => (
            <span style={{ margin: "10px" }} key={index} id={individualSpan.id}>
              <Link
                to={`/category/${individualSpan.text}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                {individualSpan.text}
              </Link>
            </span>
          ))}
        </Filter>
      </FilterContainer>

      {products.length > 0 && (
        <AllProducts products={products} addToFavorite={addToFavorite} />
      )}
      {products.length < 1 && <LoadingSpinner />}

      <NewsLetter />
      <Footer />
      <CopyRight />
    </Container>
  );
};

export default ProductsLists;
