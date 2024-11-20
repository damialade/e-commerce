import React, { useState, useEffect } from "react";
import {
  FavoriteBorderOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Badge } from "@mui/material";
import styled from "styled-components";
import { mobile } from "../responsive";
import { Link } from "react-router-dom";
import { auth, fs } from "../pages/firebase";
import { useHistory } from "react-router-dom";

const Container = styled.div`
  height: 80px;
  ${mobile({ height: "70px" })}
`;

const Wrapper = styled.div`
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ padding: "10px 0" })}
`;

// const Left = styled.div`
//   display: flex;
//   flex: 1;
//   align-items: center;
// `;
// const Language = styled.span`
//   cursor: pointer;
//   font-size: 14px;
//   ${mobile({ display: "none" })}
// `;
// const SearchBar = styled.div`
//   border: 0.5px solid lightgray;
//   display: flex;
//   align-items: center;
//   margin: 25px;
//   padding: 5px;
//   ${mobile({ margin: "18px" })}
// `;
// const Input = styled.input`
//   outline: none;
//   border: none;
//   ${mobile({ width: "50px" })}
// `;

const Logo = styled.h1`
  font-weight: bold;
  ${mobile({ fontSize: "24px" })}
`;

const Center = styled.div`
  flex: 1;
  text-align: left;
  margin-left: 20px;
`;

const Right = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  ${mobile({ justifyContent: "center", flex: 2 })}
`;

const MenuItem = styled.div`
  font-size: 14px;
  cursor: pointer;
  margin-left: 20px;
  ${mobile({ fontSize: "10px", marginLeft: "12px" })}
`;

const NavBar = () => {
  const navigate = useHistory();

  //getting current user id

  const GetUserId = () => {
    const [uid, setUid] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          setUid(user.uid);
        }
      });
    }, []);
    localStorage.setItem("userId", uid);
    return uid;
  };
  GetUserId();

  //getting current user to display on navbar

  const GetCurrentUser = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection("users")
            .doc(user.uid)
            .get()
            .then((snapshot) => {
              setUser(snapshot.data().FullName);
            });
        } else {
          setUser(null);
        }
      });
    }, []);

    return user;
  };

  const user = GetCurrentUser();

  const handleLogout = () => {
    auth.signOut().then(() => {
      localStorage.removeItem("userId");
      navigate.push("/login");
    });
  };

  //state of cart products
  const [cartProducts, setCartProducts] = useState([]);

  //getting cart products from firestore collection and updating state of cart
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("Cart" + user.uid).onSnapshot((snapshot) => {
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
  }, []);

  //state of cart products
  const [wishlistProducts, setWishListProducts] = useState([]);

  //getting wishlist products from firestore collection and updating state of wishlist
  const uid = localStorage.getItem("userId");
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("WishList" + uid).onSnapshot((snapshot) => {
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
  }, [uid]);

  return (
    <Container>
      <Wrapper>
        {/* <Left>
          <Language>EN</Language>
          <SearchBar>
            <Input placeholder="Search" />
            <Search style={{ color: "gray", fontSize: 16 }} onClick={searchButtonHandler}/>
          </SearchBar>
        </Left> */}
        <Center>
          <Logo>Tiannah.</Logo>
        </Center>
        <Right>
          {user && (
            <>
              <Link to="/" style={{ textDecoration: "none", color: "grey" }}>
                <MenuItem>{user}</MenuItem>
              </Link>

              <MenuItem onClick={handleLogout}>Logout</MenuItem>

              {wishlistProducts.length > 0 && (
                <Link
                  to="/wishlist"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <MenuItem>
                    <Badge
                      badgeContent={wishlistProducts.length}
                      color="success"
                    >
                      <FavoriteBorderOutlined />
                    </Badge>
                  </MenuItem>
                </Link>
              )}

              {cartProducts.length > 0 && (
                <Link
                  to="/cart"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <MenuItem>
                    <Badge badgeContent={cartProducts.length} color="success">
                      <ShoppingCartOutlined />
                    </Badge>
                  </MenuItem>
                </Link>
              )}
            </>
          )}

          {!user && (
            <>
              <Link
                to="/register"
                style={{ textDecoration: "none", color: "grey" }}
              >
                <MenuItem>Register</MenuItem>
              </Link>

              <Link
                to="/login"
                style={{ textDecoration: "none", color: "grey" }}
              >
                <MenuItem>Login</MenuItem>
              </Link>
            </>
          )}
        </Right>
      </Wrapper>
    </Container>
  );
};

export default NavBar;
