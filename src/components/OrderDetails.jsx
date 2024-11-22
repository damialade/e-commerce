import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { fs, auth } from "../pages/firebase"; // Assuming auth is required
import styled from "styled-components";
import OrderItem from "./OrderItem";
import LoadingSpinner from "./LoadingSpinner";

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Title = styled.h2`
  margin: 20px;
  text-align: center;
`;

const OrderDetails = () => {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null); // To store the order details
  const [loading, setLoading] = useState(true); // To manage loading state
  const [error, setError] = useState(null); // To handle errors

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;

      if (!user) {
        setError("You need to be logged in to view order details.");
        setLoading(false);
        return;
      }

      const orderDoc = await fs.collection("Orders").doc(orderId).get();

      if (!orderDoc.exists) {
        setError("Order not found.");
      } else {
        setOrder(orderDoc.data());
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("An error occurred while fetching order details.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const ItemsArray = order.OrderItems;

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container>
        <Title>Order Details</Title>
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
        <p style={{ textAlign: "center" }}>
          Click{" "}
          <Link
            to="/account"
            style={{ textDecoration: "none", color: "green" }}
          >
            here
          </Link>{" "}
          to go back.
        </p>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Order Details</Title>
      <p style={{ textAlign: "center" }}>
        Click{" "}
        <Link to="/account" style={{ textDecoration: "none", color: "green" }}>
          here
        </Link>{" "}
        to go back.
      </p>
      <Wrapper>
        {ItemsArray &&
          ItemsArray.map((orderItemData, index) => (
            <OrderItem key={index} individualProduct={orderItemData} />
          ))}
      </Wrapper>
      {!ItemsArray.length && (
        <p style={{ textAlign: "center" }}>No items found in this order.</p>
      )}
    </Container>
  );
};

export default OrderDetails;
