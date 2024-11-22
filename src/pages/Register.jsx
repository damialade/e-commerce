import React, { useState } from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import { Link } from "react-router-dom";
import { auth, fs } from "./firebase";
import { useHistory } from "react-router-dom";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://static.standard.co.uk/s3fs-public/thumbnails/image/2019/05/01/14/richardquinndebenhams.jpg?width=1200&width=1200&auto=webp&quality=75")
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Wrapper = styled.div`
  width: 45%;
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
  margin: 20px 10px 0 0;
  padding: 10px;
`;
const Agreement = styled.span`
  font-size: 12px;
  margin: 20px 0;
`;
const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: #4e6539;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #a4dab4;
  }
`;

const Register = () => {
  const navigate = useHistory();

  const handleRegister = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((credentials) => {
        fs.collection("users")
          .doc(credentials.user.uid)
          .set({
            FullName: fullName,
            Email: email,
            Password: password,
          })
          .then(() => {
            setSuccessMsg(
              "Registration Successful. You will be automatically redirected to Login"
            );
            setFullName("");
            setEmail("");
            setPassword("");
            setErrMsg("");
            setTimeout(() => {
              setSuccessMsg("");
              navigate.push("/login");
            }, 500);
          })
          .catch((error) => setErrMsg(error.message));
      })
      .catch((error) => {
        setErrMsg(error.message);
      });
  };

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  return (
    <Container>
      <Wrapper>
        <Title>CREATE AN ACCOUNT</Title>
        {successMsg && (
          <>
            <GreenLine>{successMsg}</GreenLine>
          </>
        )}
        <Form autoComplete="off" onSubmit={handleRegister}>
          <Input
            placeholder="Enter your FullName"
            type="text"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            required
          />

          <Input
            placeholder="Enter your Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />

          <Input
            placeholder="Enter your password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <Agreement>
            Already Created an account? You have consented to the processing of
            your personal data
            <Link
              to="/login"
              style={{ textDecoration: "underline", color: "black" }}
            >
              {" "}
              Login here
            </Link>
          </Agreement>
          <Button type="submit">REGISTER</Button>
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

export default Register;
