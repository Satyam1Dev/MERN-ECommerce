import React from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Table, 
  Badge,
  Form,
  Alert
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

const Cart = () => {
  const { 
    cart, 
    loading, 
    updateCartItem, 
    removeFromCart, 
    clearCart,
    getCartTotal 
  } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      try {
        await clearCart();
      } catch (error) {
        console.error('Error clearing cart:', error);
        alert('Failed to clear cart: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  // Add debug logging to see what's in the cart
  console.log('🛒 Cart data:', cart);
  console.log('🛒 Cart items:', cart?.items);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="loading-spinner">Loading cart...</div>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <Card className="empty-cart-card border-0 shadow-sm">
              <Card.Body className="py-5">
                <div className="empty-cart-icon mb-4">🛒</div>
                <h3 className="mb-3">Your cart is empty</h3>
                <p className="text-muted mb-4">
                  Looks like you haven't added any items to your cart yet.
                </p>
                <Button as={Link} to="/products" variant="primary" size="lg">
                  Continue Shopping
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <Container className="py-5">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="display-5 fw-bold">Shopping Cart</h1>
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={handleClearCart}
            >
              Clear Cart
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.items.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={item.product?.images?.[0] || 'https://via.placeholder.com/80x80?text=No+Image'} 
                              alt={item.product?.name}
                              className="cart-product-image me-3"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                              }}
                            />
                            <div>
                              <h6 className="mb-1">{item.product?.name || 'Unknown Product'}</h6>
                              <small className="text-muted">
                                Category: {item.product?.category || 'Unknown'}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>${item.price?.toFixed(2) || '0.00'}</td>
                        <td>
                          <div className="quantity-controls d-flex align-items-center">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </Button>
                            <span className="mx-3">{item.quantity}</span>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </td>
                        <td>${((item.price || 0) * item.quantity).toFixed(2)}</td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveItem(item._id)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="order-summary">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span>
                    {shipping === 0 ? (
                      <Badge bg="success">FREE</Badge>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (10%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong className="text-primary h5">
                    ${total.toFixed(2)}
                  </strong>
                </div>

                {subtotal < 100 && (
                  <Alert variant="info" className="small">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </Alert>
                )}

                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-100"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>

                <Button 
                  as={Link} 
                  to="/products" 
                  variant="outline-primary" 
                  className="w-100 mt-2"
                >
                  Continue Shopping
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;