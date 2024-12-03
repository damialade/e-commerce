import { useParams, Link } from "react-router-dom";
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
  const [orderItems, setOrderItems] = useState([]);
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
      }

      
      const orderDoc = await fs
        .collection("Orders") 
        .doc(orderId) 
        .get();

  
      if (orderDoc.exists && orderDoc.data().userId === uid) {
        
        const itemsSnapshot = await fs
          .collection("Orders")
          .doc(orderId)
          .collection("Items")
          .get();

        if (itemsSnapshot.empty) {
          setError("No items found for this order.");
        } else {
          
          const items = itemsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setOrderItems(items);
        }
      } else {
        setError("You do not have permission to view this order.");
        history.push("/login"); 
      }
    } catch (error) {
      console.error("Error fetching order items:", error);
      setError("An error occurred while fetching the items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    getOrderItems(); 
  }, [orderId]); 

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
