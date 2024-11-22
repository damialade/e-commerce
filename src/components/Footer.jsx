import {
  Facebook,
  Instagram,
  MailOutlined,
  Phone,
  Pinterest,
  Room,
  Twitter,
} from "@mui/icons-material";
import styled from "styled-components";
import { mobile } from "../responsive";
import { Link } from "react-router-dom";

const Container = styled.div`
  display: flex;
  ${mobile({ flexDirection: "column" })}
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;
const Logo = styled.h1``;
const Description = styled.p`
  margin: 20px 0px;
  line-height: 1;
`;
const SocialContainer = styled.div`
  display: flex;
`;
const SocialIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  margin-right: 15px;
  background-color: #${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Center = styled.div`
  flex: 1;
  padding: 20px;
`;
const Title = styled.h3`
  margin-bottom: 30px;
`;
const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
`;
const ListItem = styled.li`
  width: 50%;
  margin-bottom: 10px;
`;

const Right = styled.div`
  flex: 1;
  padding: 20px;
  ${mobile({ backgroundColor: "gainsboro" })}
`;

const ContactItem = styled.div`
  display: flex;
  margin-bottom: 20px;
  align-items: center;
`;

const Payment = styled.img`
  width: 50%;
`;

const Footer = () => {
  return (
    <Container>
      <Left>
        <Logo>Tiannah.</Logo>
        <Description>
          A brand where comfort meets elegance. A punchline for fashion botique
          delivering exceptional quality unique styles. The possibilities are
          endless.
        </Description>
        <SocialContainer>
          <SocialIcon color="3b5999">
            <Facebook />
          </SocialIcon>
          <SocialIcon color="e4405f">
            <Instagram />
          </SocialIcon>
          <SocialIcon color="55acee">
            <Twitter />
          </SocialIcon>
          <SocialIcon color="e60023">
            <Pinterest />
          </SocialIcon>
        </SocialContainer>
      </Left>
      <Center>
        <Title>Useful Links</Title>
        <List>
          <ListItem>
            <Link to="/" style={{ textDecoration: "none", color: "black" }}>
              Home
            </Link>
          </ListItem>
          <ListItem>
            <Link to="/cart" style={{ textDecoration: "none", color: "black" }}>
              Cart
            </Link>
          </ListItem>
          <ListItem>
            <Link
              to="/category/Dresses"
              style={{ textDecoration: "none", color: "black" }}
            >
              Dresses
            </Link>
          </ListItem>
          <ListItem>
            <Link
              to="/category/Blazers"
              style={{ textDecoration: "none", color: "black" }}
            >
              Blazers
            </Link>
          </ListItem>
          <ListItem>
            <Link
              to="/category/Loungewears"
              style={{ textDecoration: "none", color: "black" }}
            >
              Loungewears
            </Link>
          </ListItem>
          <ListItem>
            <Link
              to="/account"
              style={{ textDecoration: "none", color: "black" }}
            >
              My Account
            </Link>
          </ListItem>
          <ListItem>
            <Link
              to="/wishlist"
              style={{ textDecoration: "none", color: "black" }}
            >
              Wishlist
            </Link>
          </ListItem>
          <ListItem>
            <Link
              to="/products"
              style={{ textDecoration: "none", color: "black" }}
            >
              All Products
            </Link>
          </ListItem>
        </List>
      </Center>
      <Right>
        <Title>Contact Us</Title>
        <ContactItem>
          <Room style={{ marginRight: "10px" }} />
          278, Fola Osibo, Lekki Phase 1, Lagos State;
        </ContactItem>
        <ContactItem>
          <Phone style={{ marginRight: "10px" }} />
          +234 813 478 9002
        </ContactItem>
        <ContactItem>
          <MailOutlined style={{ marginRight: "10px" }} />
          tiannah1989@gmail.com
        </ContactItem>
        <Payment src="https://printdoctorafrica.com/bookwork/wp-content/uploads/2020/03/Payment.png" />
      </Right>
    </Container>
  );
};

export default Footer;
