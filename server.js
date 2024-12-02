const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(
  process.env.SK_TEST_MY_SECRET_KEY
);
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

// Checkout Endpoint
app.post("/checkout", async (req, res) => {
  let error;
  let status;
  try {
    const { cart, token } = req.body;
    // Validate cart data
    if (!cart || typeof cart.TotalProductPrice !== "number") {
      throw new Error("Invalid cart data");
    }
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    

    const charge = await stripe.charges.create({
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
    status="success"
  } catch (err) {
    console.error("Error in checkout:", err);
    status="error"
  }
});

// Start Server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
