const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Create new order
router.post('/', protect, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Create order items from cart
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images[0] || '/images/placeholder.jpg',
      price: item.price,
      quantity: item.quantity
    }));
    
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod
    });
    
    const createdOrder = await order.save();
    
    // Clear the cart
    cart.items = [];
    await cart.save();
    
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order to paid
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentStatus = 'completed';
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;