import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          No order found. <Link to="/products">Continue shopping</Link>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="text-center border-0 shadow-sm success-card">
            <Card.Body className="py-5">
              <div className="success-icon mb-4">🎉</div>
              <h1 className="text-success mb-3">Order Placed Successfully!</h1>
              
              <Card className="bg-light mb-4">
                <Card.Body>
                  <h5 className="mb-3">Order Details</h5>
                  <div className="text-start">
                    <p><strong>Order Number:</strong> {order.orderNumber}</p>
                    <p><strong>Total Amount:</strong> ${order.totalPrice?.toFixed(2)}</p>
                    <p><strong>Payment Method:</strong> {order.paymentMethod?.toUpperCase()}</p>
                    <p><strong>Order Status:</strong> 
                      <span className="badge bg-success ms-2">{order.orderStatus}</span>
                    </p>
                  </div>
                </Card.Body>
              </Card>

              <p className="lead mb-4">
                Thank you for your purchase! We've sent a confirmation email to your registered email address.
                Your order will be shipped within 2-3 business days.
              </p>

              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                <Button as={Link} to="/products" variant="primary" size="lg" className="me-md-2">
                  Continue Shopping
                </Button>
                <Button as={Link} to="/" variant="outline-primary" size="lg">
                  Back to Home
                </Button>
              </div>

              <div className="mt-4">
                <small className="text-muted">
                  Need help? <a href="/contact">Contact our support team</a>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderSuccess;