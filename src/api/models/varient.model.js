const mongoose = require("mongoose");

const varientSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * Methods
 */

module.exports = mongoose.model("Varient", varientSchema);
