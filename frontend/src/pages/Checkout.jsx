import React, { useState } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Form, 
  Alert,
  Accordion
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/cartService';
import { authService } from '../services/authService';
import '../styles/Checkout.css';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  const [shippingAddress, setShippingAddress] = useState({
    name: currentUser?.name || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate shipping address
      if (!shippingAddress.name || !shippingAddress.address || !shippingAddress.city || 
          !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country) {
        throw new Error('Please fill in all shipping address fields');
      }

      // Validate payment method
      if (paymentMethod === 'card') {
        if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.nameOnCard) {
          throw new Error('Please fill in all card details');
        }
      }

      const orderData = {
        shippingAddress,
        paymentMethod
      };

      const order = await orderService.createOrder(orderData);
      
      // Simulate payment processing
      if (paymentMethod === 'card') {
        await orderService.updateOrderToPaid(order._id);
      }

      await clearCart();
      navigate('/order-success', { state: { order } });
      
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">
          Your cart is empty. <a href="/products">Continue shopping</a>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col>
          <h1 className="display-5 fw-bold text-center mb-5">Checkout</h1>
        </Col>
      </Row>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={8}>
            {/* Shipping Address */}
            <Card className="mb-4 shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">📦 Shipping Address</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={shippingAddress.name}
                        onChange={handleInputChange(setShippingAddress)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleInputChange(setShippingAddress)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Address *</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleInputChange(setShippingAddress)}
                    required
                    placeholder="Street address"
                  />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City *</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleInputChange(setShippingAddress)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>State *</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleInputChange(setShippingAddress)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>ZIP Code *</Form.Label>
                      <Form.Control
                        type="text"
                        name="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={handleInputChange(setShippingAddress)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Country *</Form.Label>
                      <Form.Control
                        type="text"
                        name="country"
                        value={shippingAddress.country}
                        onChange={handleInputChange(setShippingAddress)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Payment Method */}
            <Card className="shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">💳 Payment Method</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Select Payment Method *</Form.Label>
                  <div>
                    <Form.Check
                      type="radio"
                      name="paymentMethod"
                      label="Credit/Debit Card"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mb-2"
                    />
                    <Form.Check
                      type="radio"
                      name="paymentMethod"
                      label="PayPal"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mb-2"
                    />
                    <Form.Check
                      type="radio"
                      name="paymentMethod"
                      label="Cash on Delivery"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                  </div>
                </Form.Group>

                {paymentMethod === 'card' && (
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Card Details</Accordion.Header>
                      <Accordion.Body>
                        <Row>
                          <Col md={12}>
                            <Form.Group className="mb-3">
                              <Form.Label>Name on Card *</Form.Label>
                              <Form.Control
                                type="text"
                                name="nameOnCard"
                                value={cardDetails.nameOnCard}
                                onChange={handleInputChange(setCardDetails)}
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={8}>
                            <Form.Group className="mb-3">
                              <Form.Label>Card Number *</Form.Label>
                              <Form.Control
                                type="text"
                                name="cardNumber"
                                value={cardDetails.cardNumber}
                                onChange={handleInputChange(setCardDetails)}
                                placeholder="1234 5678 9012 3456"
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>CVV *</Form.Label>
                              <Form.Control
                                type="text"
                                name="cvv"
                                value={cardDetails.cvv}
                                onChange={handleInputChange(setCardDetails)}
                                placeholder="123"
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={12}>
                            <Form.Group className="mb-3">
                              <Form.Label>Expiry Date *</Form.Label>
                              <Form.Control
                                type="text"
                                name="expiryDate"
                                value={cardDetails.expiryDate}
                                onChange={handleInputChange(setCardDetails)}
                                placeholder="MM/YY"
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                )}

                {paymentMethod === 'paypal' && (
                  <Alert variant="info">
                    You will be redirected to PayPal to complete your payment.
                  </Alert>
                )}

                {paymentMethod === 'cod' && (
                  <Alert variant="warning">
                    Pay with cash when your order is delivered.
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* Order Summary */}
            <Card className="shadow-sm sticky-top">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                <div className="order-items mb-3">
                  {cart.items.map((item) => (
                    <div key={item._id} className="order-item d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center">
                        <img 
                          src={item.product?.images?.[0] || 'https://via.placeholder.com/40x40?text=No+Image'} 
                          alt={item.product?.name}
                          className="order-item-image me-2"
                        />
                        <div>
                          <small className="fw-bold">{item.product?.name}</small>
                          <br />
                          <small className="text-muted">
                            Qty: {item.quantity} × ${item.price}
                          </small>
                        </div>
                      </div>
                      <small className="fw-bold">
                        ${(item.quantity * item.price).toFixed(2)}
                      </small>
                    </div>
                  ))}
                </div>

                <hr />

                <div className="order-totals">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span>
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <strong>Total:</strong>
                    <strong className="text-primary h5">
                      ${total.toFixed(2)}
                    </strong>
                  </div>
                </div>

                {error && <Alert variant="danger" className="small">{error}</Alert>}

                <Button 
                  variant="primary" 
                  size="lg" 
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                </Button>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    By placing your order, you agree to our terms and conditions.
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default Checkout;