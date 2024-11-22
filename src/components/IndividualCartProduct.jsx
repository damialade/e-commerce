import styled from "styled-components";
import { Add, Remove, DeleteForever } from "@mui/icons-material";
import { mobile } from "../responsive";
import { fs, auth } from "../pages/firebase";

const Container = styled.div``;
const Wrapper = styled.div`
  padding: 20px;
  ${mobile({ padding: "10px" })};
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })};
`;
const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })};
`;
const ProductDetail = styled.div`
  display: flex;
  flex: 2;
`;
const Image = styled.img`
  width: 200px;
`;
const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;
const ProductName = styled.span``;
const ProductDesc = styled.span``;
const ProductColor = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;
const ProductSize = styled.span``;
const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;
const ProductAmount = styled.div`
  font-size: 20px;
  margin: 5px;
  ${mobile({ margin: "5px 25px" })};
`;
const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 200;
  ${mobile({ marginBottom: "20px" })};
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
  margin: 10px;
`;

const IndividualCartProduct = ({ cartProduct }) => {
  const decreaseQuantity = (ProdID, ProdQuantity) => {
    const uid = auth.currentUser?.uid || localStorage.getItem("userId");

    if (uid) {
      if (ProdQuantity > 1) {
        fs.collection("Cart")
          .doc(uid)
          .collection("Items")
          .doc(ProdID)
          .update({
            quantity: ProdQuantity - 1,
          });
      } else {
        fs.collection(`Cart${uid}/Items`).doc(ProdID).delete();
      }
    }
  };

  const increaseQuantity = (ProdID, ProdQuantity) => {
    const uid = auth.currentUser?.uid || localStorage.getItem("userId");
    if (uid) {
      if (ProdQuantity < 10) {
        fs.collection("Cart")
          .doc(uid)
          .collection("Items")
          .doc(ProdID)
          .update({
            quantity: ProdQuantity + 1,
          });
      }
    }
  };

  const deleteProduct = (ProdID) => {
    const uid = auth.currentUser?.uid || localStorage.getItem("userId");

    if (uid) {
      fs.collection("Cart").doc(uid).collection("Items").doc(ProdID).delete();
    }
  };

  return (
    <Container>
      <Wrapper>
        <Bottom>
          <Info>
            <Product>
              <ProductDetail>
                <Image src={cartProduct.url} alt="productImage" />
                <Details>
                  <ProductName>
                    <b>Product:</b> {cartProduct.title}
                  </ProductName>
                  <ProductDesc>
                    <b>Desc:</b> {cartProduct.desc}
                  </ProductDesc>
                  <ProductColor color={cartProduct.color} />
                  <ProductSize>
                    <b>Size:</b> {cartProduct.size}
                  </ProductSize>
                </Details>
              </ProductDetail>
              <PriceDetail>
                <ProductAmountContainer>
                  <Remove
                    onClick={() => {
                      decreaseQuantity(cartProduct.ID, cartProduct.quantity);
                    }}
                    style={{ cursor: "pointer" }}
                  />

                  <ProductAmount>{cartProduct.quantity}</ProductAmount>
                  <Add
                    onClick={() => {
                      increaseQuantity(cartProduct.ID, cartProduct.quantity);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                  <DeleteForever
                    onClick={() => {
                      deleteProduct(cartProduct.ID);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </ProductAmountContainer>
                <ProductPrice>
                  $ {cartProduct.price * cartProduct.quantity}
                </ProductPrice>
              </PriceDetail>
            </Product>
            <Hr />
          </Info>
        </Bottom>
      </Wrapper>
    </Container>
  );
};

export default IndividualCartProduct;
