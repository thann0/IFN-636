const express = require('express');
const Product = require('../models/Product');
const Purchase = require('../models/Purchase');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Story 8: Complete simulated purchase (customer only)
router.post('/', requireAuth, requireRole('customer'), async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId is required.' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    const purchase = await Purchase.create({
      customer: req.user.id,
      product: product._id,
      priceAtPurchase: product.price,
      fileUrlSnapshot: product.fileUrl,
    });

    res.status(201).json({ message: 'Purchase completed successfully.', purchase });
  } catch (err) {
    res.status(500).json({ message: 'Purchase failed.', error: err.message });
  }
});

// Story 9: View purchase history
router.get('/mine', requireAuth, requireRole('customer'), async (req, res) => {
  try {
    const purchases = await Purchase.find({ customer: req.user.id })
      .populate('product', 'title category price')
      .sort({ createdAt: -1 });
    res.json({ purchases });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load purchase history.', error: err.message });
  }
});

// Story 9: Access the purchased file (ownership verified)
router.get('/:id/file', requireAuth, requireRole('customer'), async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) return res.status(404).json({ message: 'Purchase not found.' });
    if (String(purchase.customer) !== req.user.id) {
      return res.status(403).json({ message: 'You do not have access to this file.' });
    }
    res.json({ fileUrl: purchase.fileUrlSnapshot });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve file access.', error: err.message });
  }
});

module.exports = router;
