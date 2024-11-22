import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Information from "../components/Information";
import Footer from "../components/Footer";
import { fs, auth } from "./firebase";
import CopyRight from "../components/CopyRight";
import styled from "styled-components";
import { Table, Tr } from "styled-table-component";
import NewsLetter from "../components/NewsLetter";
import { Link, useHistory } from "react-router-dom";

const Container = styled.div``;

const Wrapper = styled.div`
  overflow-x: auto;
  margin: 10px;
`;

const MyAccount = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const getAllOrders = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        console.error("No user is logged in.");
        history.push("/login");
        return;
      }

      const uid = user.uid;

      // Query Firestore for the user's orders
      const querySnapshot = await fs
        .collection("Orders")
        .where("UserId", "==", uid)
        .get();

      const userOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(userOrders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    getAllOrders();
  });

  if (loading) {
    return (
      <Container>
        <NavBar />
        <Information />
        <Wrapper>
          <p>Loading your orders...</p>
        </Wrapper>
        <Footer />
        <CopyRight />
      </Container>
    );
  }

  return (
    <Container>
      <NavBar />
      <Information />
      <Wrapper>
        {orders.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th scope="col">S/N</th>
                <th scope="col">Order Id</th>
                <th scope="col">Order Total</th>
                <th scope="col">Total Quantity</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((orderData, index) => (
                <tr active key={orderData.id}>
                  <td>{index + 1}</td> {/* Use index for serial number */}
                  <td>{orderData.id}</td>
                  <td>${orderData.OrderPrice}</td>
                  <td>{orderData.OrderQuantity}</td>
                  <td>
                    <Link to={`/orderDetails/${orderData.id}`}>
                      <button>View Items</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>
            You have never placed an Order. Click{" "}
            <Link
              to="/products"
              style={{ textDecoration: "none", color: "green" }}
            >
              here
            </Link>{" "}
            to Order
          </p>
        )}
      </Wrapper>
      <NewsLetter />
      <Footer />
      <CopyRight />
    </Container>
  );
};

export default MyAccount;
