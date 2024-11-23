import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { fs, auth } from "../pages/firebase"; 
import styled from "styled-components";
import OrderItem from "./OrderItem";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "react-toastify"; 

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

  const [order, setOrder] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  // Ensure Firebase is initialized and user is authenticated before fetching order details
  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;

      // If not authenticated, display error and stop
      if (!user) {
        setError("You need to be logged in to view order details.");
        toast.error("Please log in to view your orders.");
        setLoading(false);
        return;
      }

      // Firebase fetch logic to get order data
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
    // Listen for authentication state change
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true); 
      } else {
        setIsAuthenticated(false);
      }
    });

    
    if (isAuthenticated) {
      fetchOrderDetails();
    }

    return () => unsubscribe(); 
  }, [isAuthenticated, fetchOrderDetails]);

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

  const ItemsArray = order ? order.OrderItems : [];

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
        {ItemsArray.length > 0 ? (
          ItemsArray.map((orderItemData, index) => (
            <OrderItem key={index} individualProduct={orderItemData} />
          ))
        ) : (
          <p style={{ textAlign: "center" }}>No items found in this order.</p>
        )}
      </Wrapper>
    </Container>
  );
};

export default OrderDetails;
