import { useParams, Link,useHistory } from "react-router-dom";
import { useState, useEffect} from "react";
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
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

 const getOrderItems = async () => {
    try {
      const uid = auth?.currentUser?.uid || localStorage.getItem("userId");
      if (!uid) {
        console.error("No user is logged in.");
        history.push("/login");
        return;
      };

      const itemsSnapshot = await fs
          .collection("Orders")
          .doc(uid)
          .collection("Items")
          .doc(orderId)
          .get();

         if (!itemsSnapshot.exists) {
      toast.error("Order not found.");
      return;
    }

       const userOrderDetails = {
      id: itemsSnapshot.id,
      ...itemsSnapshot.data(),
    };

      setOrder(userOrderDetails);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      toast.error("An error occurred while fetching the items.");
      history.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
   getOrderItems();
  }, []);


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
