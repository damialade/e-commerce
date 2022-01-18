import React, { useEffect, useState } from "react";
import { fs } from "./firebase";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
  //console.log(products);

  useEffect(() => {
    getAllProducts();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const uid = localStorage.getItem("userId");

  let Wishlist;
  const addToFavorite = (product) => {
    if (uid !== null) {
      //console.log(product);
      Wishlist = product;
      Wishlist['qty'] = 1;
      fs.collection('WishList' + uid).doc(product.ID).set(Wishlist).then(() => {
        console.log('successfully added to wishlist');
      })
    } else {
      navigate("/login");
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
