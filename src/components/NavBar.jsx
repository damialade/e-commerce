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
  ${mobile({ height: "60px" })}
`;

const Wrapper = styled.div`
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ padding: "5px 10px" })}
`;

const Logo = styled.h1`
  font-weight: bold;
  font-size: 28px;
  ${mobile({ fontSize: "20px" })}
`;

const Center = styled.div`
  flex: 1;
  text-align: left;
  margin-left: 20px;
  ${mobile({ marginLeft: "10px" })}
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
  ${mobile({ fontSize: "12px", marginLeft: "10px" })}
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  ${mobile({ flexDirection: "row", justifyContent: "space-around" })}
`;

const NavBar = () => {
  const navigate = useHistory();

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

  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("Cart")
          .doc(user.uid)
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
  }, []);

  const [wishlistProducts, setWishListProducts] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("Wishlist")
          .doc(user.uid)
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
  }, []);

  return (
    <Container>
      <Wrapper>
        <Center>
          <Link to="/" style={{ textDecoration: "none", color: "#000" }}>
            <Logo>Tiannah.</Logo>
          </Link>
        </Center>
        <Right>
          {user ? (
            <>
              <MenuItem>{user}</MenuItem>
              <Link to="/account" style={{ textDecoration: "none", color: "grey" }}>
                <MenuItem>My Account</MenuItem>
              </Link>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>

              <IconWrapper>
                {wishlistProducts.length > 0 && (
                  <Link to="/wishlist" style={{ textDecoration: "none", color: "black" }}>
                    <MenuItem>
                      <Badge badgeContent={wishlistProducts.length} color="success">
                        <FavoriteBorderOutlined />
                      </Badge>
                    </MenuItem>
                  </Link>
                )}

                {cartProducts.length > 0 && (
                  <Link to="/cart" style={{ textDecoration: "none", color: "black" }}>
                    <MenuItem>
                      <Badge badgeContent={cartProducts.length} color="success">
                        <ShoppingCartOutlined />
                      </Badge>
                    </MenuItem>
                  </Link>
                )}
              </IconWrapper>
            </>
          ) : (
            <>
              <Link to="/register" style={{ textDecoration: "none", color: "grey" }}>
                <MenuItem>Register</MenuItem>
              </Link>

              <Link to="/login" style={{ textDecoration: "none", color: "grey" }}>
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
