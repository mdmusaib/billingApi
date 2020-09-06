const mongoose = require("mongoose");

const productDetails = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  productName: { type: String, required: true },
  productPrice: { type: Number, required: true },
  // productImage: { type: String, required: true },
  createdDate: { type: Date, default: Date.now(), required: true },
});

module.exports = mongoose.model("Product", productDetails);
