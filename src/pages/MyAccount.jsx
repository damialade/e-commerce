import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Information from "../components/Information";
import Footer from "../components/Footer";
import { fs, auth } from "./firebase";
import CopyRight from "../components/CopyRight";
import styled from "styled-components";
import NewsLetter from "../components/NewsLetter";
import { Link, useHistory } from "react-router-dom";

const Container = styled.div``;

const Wrapper = styled.div`
  overflow-x: auto;
  margin: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 16px;
  text-align: left;

  thead {
    background-color: #f4f4f4;
  }

  th,
  td {
    padding: 12px;
    border: 1px solid #ddd;
  }

  th {
    font-weight: 600;
    text-transform: uppercase;
  }

  tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tbody tr:hover {
    background-color: #f1f1f1;
  }
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background-color: #4e6539;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  text-transform: uppercase;

  &:hover {
    background-color: #f1f1f1;
    color:#333;
  }
`;

const Message = styled.p`
  font-size: 18px;
  color: #555;

  a {
    color: green;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
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
          <Table>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Order Id</th>
                <th>Order Total</th>
                <th>Total Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((orderData, index) => (
                <tr key={orderData.id}>
                  <td>{index + 1}</td>
                  <td>{orderData.id}</td>
                  <td>${orderData.OrderPrice}</td>
                  <td>{orderData.OrderQuantity}</td>
                  <td>
                    <Link to={`/orderDetails/${orderData.id}`}>
                      <ActionButton>View Items</ActionButton>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Message>
            You have never placed an order. Click{" "}
            <Link to="/products">here</Link> to order.
          </Message>
        )}
      </Wrapper>
      <NewsLetter />
      <Footer />
      <CopyRight />
    </Container>
  );
};

export default MyAccount;
