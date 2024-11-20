import React, { useState } from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import { Link } from "react-router-dom";
import { auth } from "./firebase";
import { useHistory } from "react-router-dom";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://image.freepik.com/free-photo/lovely-graceful-girl-trendy-pink-fur-coat-laughing-posing-with-eyes-closed-isolated-bright-background-pretty-blonde-young-woman-with-dreamy-face-expression-smiling-touching-her-face_197531-3608.jpg")
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Wrapper = styled.div`
  width: 25%;
  padding: 20px;
  background-color: white;
  ${mobile({ width: "75%" })}
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 300;
`;

const GreenLine = styled.p`
  display: flex;
  align-items: center;
  width: 25vw;
  height: 10%;
  color: #85fba8;
  margin: 10px;
`;
const RedLine = styled.p`
  display: flex;
  align-items: center;
  width: 25vw;
  height: 10%;
  color: #ef3a21;
  margin: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 10px 0;
  padding: 10px;
`;
const Button = styled.button`
  width: 30%;
  border: none;
  padding: 15px 20px;
  background-color: #4e6539;
  color: white;
  cursor: pointer;
  margin-bottom: 10px;

  &:hover {
    background-color: #a4dab4;
  }
`;

const Agreement = styled.span`
  font-size: 12px;
  margin: 20px 0;
`;

const Login = () => {
  const navigate = useHistory();

  const handleLogin = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setSuccessMsg(
          "Login Successful. You will now be redirected to the Homepage"
        );
        setEmail("");
        setPassword("");
        setErrMsg("");
        setTimeout(() => {
          setSuccessMsg("");
          navigate("/");
        }, 500);
      })
      .catch((error) => setErrMsg(error.message));
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  return (
    <Container>
      <Wrapper>
        <Title>SIGN IN</Title>
        {successMsg && (
          <>
            <GreenLine>{successMsg}</GreenLine>
          </>
        )}
        <Form autoComplete="off" onSubmit={handleLogin}>
          <Input
            placeholder="Enter your Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />

          <Input
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            required
          />

          <Agreement>
            Don't have an account? You are consenting to the processing of your
            personal data
            <Link
              to="/register"
              style={{ textDecoration: "underline", color: "black" }}
            >
              {" "}
              Register{" "}
            </Link>
          </Agreement>
          <Button type="submit">LOGIN</Button>
        </Form>

        {errMsg && (
          <>
            <RedLine>{errMsg}</RedLine>
          </>
        )}
      </Wrapper>
    </Container>
  );
};

export default Login;
