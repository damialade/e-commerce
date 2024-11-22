import { useState } from "react";
import { Send } from "@mui/icons-material";
import styled from "styled-components";
import { fs } from "../pages/firebase";
import firebase from "firebase";
import { mobile } from "../responsive";

const Container = styled.div`
  height: 50vh;
  background-color: #fbeff5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 70px;
  margin-bottom: 20px;
  ${mobile({ fontSize: "50px" })}
`;

const Description = styled.div`
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: 300;
  ${mobile({ textAlign: "center", fontSize: "20px" })}
`;

const Form = styled.form`
  width: 40%;
  ${mobile({ width: "80%" })}
`;

const InputContainer = styled.div`
  height: 40px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  border: 1px solid lightgray;
`;

const Input = styled.input`
  border: none;
  flex: 8;
  padding-left: 20px;
`;

const Button = styled.button`\
    flex:1;
    border:none;
    background-color:#4e6539;
    color:white;
`;

const Alert = styled.p`
  position:relative;
  padding:0.4rem;
  margin:0.5rem;
  color;white;
  text-align:center;
  font-size:1.2rem;
  
`;

const NewsLetter = () => {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");

  const handleForm = (e) => {
    e.preventDefault();
    if (input) {
      //add to firebase
      fs.collection("newsletter").add({
        email: input,
        time: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setInput("");
      setMessage("Thank you for Subscribing to our Newsletter");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  const handleNewsletter = (e) => {
    setInput(e.target.value);
  };

  return (
    <Container>
      <Title>NewsLetter</Title>
      <Description>Get timely updates for New Arrivals.</Description>
      <Form onSubmit={handleForm}>
        <InputContainer>
          <Input
            placeholder="Enter Your E-mail"
            type="email"
            onChange={handleNewsletter}
            value={input}
          />
          <Button type="submit">
            <Send />
          </Button>
        </InputContainer>
      </Form>
      <Alert>{message}</Alert>
    </Container>
  );
};

export default NewsLetter;
