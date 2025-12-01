const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Get user's cart
router.get('/', protect, async (req, res) => {
  try {
    console.log('🛒 Getting cart for user:', req.user._id);
    
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price images category brand stock');
    
    if (!cart) {
      console.log('📦 No cart found, creating new one');
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    
    console.log('✅ Cart retrieved:', cart);
    res.json(cart);
  } catch (error) {
    console.error('❌ Error getting cart:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post('/add', protect, async (req, res) => {
  try {
    console.log('➕ Adding to cart:', req.body);
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      console.log('📦 Creating new cart for user');
      cart = new Cart({ user: req.user._id, items: [] });
    }
    
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
      console.log('📈 Updated existing item quantity');
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
      console.log('🆕 Added new item to cart');
    }
    
    await cart.save();
    await cart.populate('items.product', 'name price images category brand stock');
    
    console.log('✅ Cart updated successfully');
    res.json(cart);
  } catch (error) {
    console.error('❌ Error adding to cart:', error);
    res.status(400).json({ 
      message: error.message || 'Failed to add item to cart'
    });
  }
});

// Update cart item quantity
router.put('/update/:itemId', protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    const product = await Product.findById(item.product);
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product', 'name price images category brand stock');
    
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();
    await cart.populate('items.product', 'name price images category brand stock');
    
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Clear cart
router.delete('/clear', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = [];
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;