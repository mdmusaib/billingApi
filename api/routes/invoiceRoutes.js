const express = require("express");
const mongoose = require("mongoose");

const Invoice = require("../models/invoiceModels");

const router = express.Router();

router.post("/create-invoice", (req, res, next) => {
  const invoice = new Invoice({
    _id: new mongoose.Types.ObjectId(),
    productName: req.body.productName,
    productPrice: req.body.productPrice,
  });
  invoice
    .save()
    .then((doc) => {
      res.status(200).json({
        message: "Product Created Scuccessfully",
        invoiceDetails: [
          {
            invoiceId: doc._id,
            productName: doc.productName,
            productPrice: doc.productPrice,
          },
        ],
      });
    })
    .catch((err) => {
      res.status(401).json({
        message: "Product Creation Is Failed",
        error: err.message,
      });
    });
});

router.get("/invoice-list", (req, res, next) => {
  Invoice.find()
    .then((doc) => {
      const response = {
        count: doc.length,
        products: doc.map((product) => {
          return {
            name: product.productName,
            price: product.productPrice,
            request: {
              type: "GET",
              url: "http://localhost:9000/billing/" + product._id,
            },
          };
        }),
      };
      if (doc.length > 0) {
        res.status(200).json(response);
      } else {
        res.status(404).json({ message: "No data found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.get("/:invoiceId", (req, res, next) => {
  const id = req.params.invoiceId;
  Invoice.findById(id)
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          name: doc.productName,
          price: doc.productPrice,
          request: {
            type: "GET",
            url: "http://localhost:9000/billing/" + doc._id,
          },
        });
      } else {
        res.status(404).json({ message: "No data found" });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
