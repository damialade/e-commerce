const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(
  "sk_test_51KGRP6EVzyUnSBi95TPvs1v9Py6iYD8pwDQ1s2zMc4mOtc2GgY741iF2lrP4HOKpR2ElQ28f3K7Iqt6qHKWKJzGO009IcZbw7c"
);
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

// Checkout Endpoint
app.post("https://e-commerce-damialade.vercel.app/payment", async (req, res) => {
  let { cart, token } = req.body;
  try {
    // Validate cart data
    if (!cart || typeof cart.TotalProductPrice !== "number") {
      throw new Error("Invalid cart data");
    }
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create({
      amount: cart.TotalProductPrice * 100, // Convert to cents
      currency: "usd",
      customer: customer.id,
      receipt_email: token.email,
      description: "Purchase from Tiannah E-commerce Store",
      shipping: {
        name: token.card.name,
        address: {
          line1: token.card.address_line1,
          city: token.card.address_city,
          country: token.card.address_country,
          postal_code: token.card.address_zip,
        },
      },
    });

    console.log("Charge successful:", payment);
    res.json({
      message: "Payment successful",
      success: true,
    });
  } catch (err) {
    console.error("Error in checkout:", err);
    res.json({
      message: "Payment failed",
      success: false,
    });
  }
});

// Start Server
app.listen(8080, () => {
  console.log("Sever is listening on port 8080");
});
