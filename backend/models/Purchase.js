const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    priceAtPurchase: { type: Number, required: true },
    fileUrlSnapshot: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Purchase', purchaseSchema);
