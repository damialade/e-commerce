const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")
  ("sk_test_51KGRP6EVzyUnSBi95TPvs1v9Py6iYD8pwDQ1s2zMc4mOtc2GgY741iF2lrP4HOKpR2ElQ28f3K7Iqt6qHKWKJzGO009IcZbw7c");
const bodyParser = require("body-parser");
const cors = require("cors");

console.log("Stripe Secret Key Loaded:", !!process.env.SK_TEST_MY_SECRET_KEY);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: "https://e-commerce-tiannah.vercel.app" }));

// Checkout Endpoint
app.post("/api/checkout", async (req, res) => {
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
        status = "success";
        res.status(200).json({ status });
    } catch (err) {
        console.error("Error in checkout:", err);
        error = err.message;
        status = "error";
        res.status(500).json({ status, error });
    }
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

