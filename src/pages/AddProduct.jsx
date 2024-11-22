import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import { storage, fs } from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

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
  width: 30%;
  padding: 20px;
  background-color: white;
  ${mobile({ width: "75%" })}
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 300;
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

const Select = styled.select`
  flex: 1;
  min-width: 40%;
  margin: 20px 10px 0 0;
  padding: 10px;
`;

const Option = styled.option`
  background-color: #4e6539;
  color: white;
`;

const RedLine = styled.p`
  display: flex;
  align-items: center;
  width: 25vw;
  height: 10%;
  color: #ef3a21;
  margin: 10px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: #4e6539;
  color: white;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #a4dab4;
  }
`;

const AddProduct = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(false);
  const [color, setColor] = useState(false);
  const [image, setImage] = useState(null);

  const [imageError, setImageError] = useState("");

  const [uploadError, setUploadError] = useState("");

  const types = ["image/jpg", "image/jpeg", "image/png", "image/PNG"];
  const handleProductUpload = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && types.includes(selectedFile.type)) {
        setImage(selectedFile);
        setImageError("");
      } else {
        setImage(null);
        setImageError(
          "Please select a valid image file type (png,jpeg or jpeg)"
        );
      }
    } else {
      console.log("Please select your file");
    }
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const uploadTask = storage.ref(`product-images/${image.name}`).put(image);
    uploadTask.on(
      "state-changed",
      // (snapshot) => {
      //   const progress =
      //     (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      // },
      (error) => setUploadError(error.message),
      () => {
        storage
          .ref("product-images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            fs.collection("Products")
              .add({
                title,
                desc,
                price: Number(price),
                category,
                color,
                url,
              })
              .then(() => {
                setTitle("");
                setDesc("");
                setPrice("");
                setCategory("");
                setColor("");
                document.getElementById("file").value = "";
                setImageError("");
                setUploadError("");
                setTimeout(() => {
                  toast.success("Product added successfully");
                }, 500);
              })
              .catch((error) => setUploadError(error.message));
          });
      }
    );
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <Container>
      <Wrapper>
        <ToastContainer />
        <Title>ADD PRODUCTS</Title>

        <Form autoComplete="off" onSubmit={handleProductSubmit}>
          <Input
            placeholder="Product Title"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            required
          />

          <Input
            placeholder="Product Description"
            type="text"
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
            required
          />

          <Input
            placeholder="Product Price"
            type="text"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
          />

          <Select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            <Option selected>Category</Option>
            <Option>Dresses</Option>
            <Option>Blazers</Option>
            <Option>Loungewears</Option>
          </Select>

          <Select onChange={(e) => setColor(e.target.value)} value={color}>
            <Option selected>Color</Option>
            <Option>Brown</Option>
            <Option>Red</Option>
            <Option>Black</Option>
            <Option>Yellow</Option>
            <Option>Pink</Option>
            <Option>Blue</Option>
            <Option>White</Option>
            <Option>Grey</Option>
            <Option>Others</Option>
          </Select>

          <Input
            placeholder="Product Image"
            type="file"
            id="file"
            onChange={handleProductUpload}
            required
          />

          {imageError && (
            <>
              <RedLine>{imageError}</RedLine>
            </>
          )}

          <Button type="submit">ADD</Button>
        </Form>
        {uploadError && (
          <>
            <RedLine>{uploadError}</RedLine>
          </>
        )}
      </Wrapper>
    </Container>
  );
};

export default AddProduct;
