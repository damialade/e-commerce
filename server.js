const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51KGRP6EVzyUnSBi95TPvs1v9Py6iYD8pwDQ1s2zMc4mOtc2GgY741iF2lrP4HOKpR2ElQ28f3K7Iqt6qHKWKJzGO009IcZbw7c"
);

const app = express();

const path = require("path");

const port = process.env.PORT || 8080;

if (process.env.NODE_ENV === "development") {
  app.use(express.static("build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Tiannah E-commerce Store");
});

app.post("/checkout", async (req, res) => {
  let error;
  let status;
  try {
    const { cart, token } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const key = uuidv4();
    const charge = await stripe.charges.create(
      {
        amount: cart.TotalProductPrice * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: "Products description here",
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip,
          },
        },
      },
      { idempotencyKey: key }
    );
    status = "success";
  } catch (err) {
    console.log(err);
    status = "error";
  }
  res.json({ status });
});

app.listen(port, () => {
  console.log("Your app is running on port no", port);
});
