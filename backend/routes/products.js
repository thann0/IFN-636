const express = require('express');
const Product = require('../models/Product');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Story 6/7: Browse + filter product catalogue (public, customer-facing)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { status: 'published' };
    if (category) filter.category = category;

    const products = await Product.find(filter)
      .populate('seller', 'name')
      .sort({ createdAt: -1 });

    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load products.', error: err.message });
  }
});

// Story 4: Seller's own listings (must come before /:id so 'mine' isn't read as an id)
router.get('/mine', requireAuth, requireRole('seller'), async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id }).sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load your listings.', error: err.message });
  }
});

// Story 6: View individual product detail
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ product });
  } catch (err) {
    res.status(400).json({ message: 'Invalid product id.' });
  }
});

// Story 3: Create product listing (seller only)
router.post('/', requireAuth, requireRole('seller'), async (req, res) => {
  try {
    const { title, description, category, fileFormat, price, fileUrl, status } = req.body;

    if (!title || !description || !category || !fileFormat || price === undefined || !fileUrl) {
      return res.status(400).json({ message: 'All product fields are required.' });
    }
    if (isNaN(price) || Number(price) < 0) {
      return res.status(400).json({ message: 'Price must be a valid non-negative number.' });
    }

    const product = await Product.create({
      title,
      description,
      category,
      fileFormat,
      price,
      fileUrl,
      seller: req.user.id,
      status: status === 'draft' ? 'draft' : 'published',
    });

    res.status(201).json({ message: 'Product listed successfully.', product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product.', error: err.message });
  }
});

// Story 4: Update own listing
router.put('/:id', requireAuth, requireRole('seller'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    if (String(product.seller) !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own listings.' });
    }

    const { title, description, category, fileFormat, price, fileUrl, status } = req.body;
    if (price !== undefined && (isNaN(price) || Number(price) < 0)) {
      return res.status(400).json({ message: 'Price must be a valid non-negative number.' });
    }

    if (title) product.title = title;
    if (description) product.description = description;
    if (category) product.category = category;
    if (fileFormat) product.fileFormat = fileFormat;
    if (price !== undefined) product.price = price;
    if (fileUrl) product.fileUrl = fileUrl;
    if (status) product.status = status;

    await product.save();
    res.json({ message: 'Product updated successfully.', product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product.', error: err.message });
  }
});

// Story 5: Delete own listing
router.delete('/:id', requireAuth, requireRole('seller'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    if (String(product.seller) !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own listings.' });
    }
    await product.deleteOne();
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product.', error: err.message });
  }
});

module.exports = router;
