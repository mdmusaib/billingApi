const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");

const Product = require("../models/productModels");

const router = express.Router();

// const upload = multer({ dest: "uploads/" });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.post("/create-product", (req, res, next) => {
  console.log(req.file);
  const invoice = new Product({
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
            productId: doc._id,
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

// router.post("/single-upload", upload.single("image"), (req, res, next) => {
//   console.log("called", req.file);
//   const image = new Invoice({
//     productImage: req.file.path,
//   });
// });

router.get("/product-list", (req, res, next) => {
  Product.find()
    .then((doc) => {
      console.log("called");
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

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
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

router.patch("/update-product/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updatedProductDetails = {
    productName: req.body.productName,
    productPrice: req.body.productPrice,
  };
  Product.update(
    {
      _id: id,
    },
    {
      $set: updatedProductDetails,
    }
  )
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(401).json(err);
    });
});

router.delete("/delete-product/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product Deleted",
        // url: {
        //   type: "POST",
        //   url: "http://localhost:3000/products",
        //   body: { name: "String", price: "Number" },
        // },
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
