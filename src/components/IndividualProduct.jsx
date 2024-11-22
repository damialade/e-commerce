import {
  FavoriteBorderOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import styled from "styled-components";
import { Link } from "react-router-dom";
//import {mobile} from "../responsive";

const Info = styled.div`
  opacity: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 3;
  cursor: pointer;
  transition: all 0.5s ease;
`;

const Container = styled.div`
    flex:1;
    margin:5px;
    min-width:280px;
    height:380px;
    display:flex;
    align-items:center;
    justify-content:center;
    background-color:#fbeff5;
    position:relative;

    &:hover ${Info}{
        opacity:1;    
`;

const Image = styled.img`
  height: 85%;
  margin-bottom: 45px;
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  transition: 0.5s ease;

  &:hover {
    background-color: #e9f5f5;
    transform: scale(1.1);
  }
`;

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 10px;
`;

const Title = styled.h5``;
const Description = styled.p`
  font-size: 12px;
`;
const Price = styled.p`
  color: grey;
  font-size: 16px;
`;

const IndividualProduct = ({ individualProduct, addToFavorite }) => {
  const handleWish = () => {
    addToFavorite(individualProduct);
  };
  return (
    <Container>
      <Image src={individualProduct.url} />
      <Info>
        <Link to={`/product/${individualProduct.ID}`}>
          <Icon>
            <ShoppingCartOutlined />
          </Icon>
        </Link>

        <Icon>
          <FavoriteBorderOutlined onClick={handleWish} />
        </Icon>
      </Info>
      <Wrapper>
        <Title>{individualProduct.title}</Title>
        <Description>{individualProduct.desc}</Description>
        <Price>$ {individualProduct.price.toLocaleString()}</Price>
      </Wrapper>
    </Container>
  );
};

export default IndividualProduct;
