import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Spinner, 
  Alert,
  Badge,
  Carousel,
  ListGroup
} from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { authService } from '../services/authService';
import '../styles/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading product details...', id);
      const productData = await productService.getProduct(id);
      console.log('✅ Product details loaded:', productData);
      setProduct(productData);
      setError('');
    } catch (err) {
      console.error('❌ Error loading product:', err);
      setError('Product not found or failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!authService.isAuthenticated()) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(product._id, 1);
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!authService.isAuthenticated()) {
      alert('Please login to purchase items');
      return;
    }

    try {
      await addToCart(product._id, 1);
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading product details...</p>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <h4>Product Not Found</h4>
          <p>{error || 'The product you are looking for does not exist.'}</p>
          <Button as={Link} to="/products" variant="primary">
            Back to Products
          </Button>
        </Alert>
      </Container>
    );
  }

  const mainImage = product.images && product.images[0] 
    ? product.images[0] 
    : 'https://via.placeholder.com/600x600?text=No+Image';

  return (
    <Container className="py-4">
      {/* Breadcrumb Navigation */}
      <Row className="mb-4">
        <Col>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/products" className="text-decoration-none">Products</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>
        </Col>
      </Row>

      <Row>
        {/* Product Images */}
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="main-image-container mb-4">
                <img 
                  src={mainImage}
                  alt={product.name}
                  className="main-product-image w-100"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
                  }}
                />
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="thumbnail-images">
                  <Row className="g-2">
                    {product.images.map((image, index) => (
                      <Col key={index} xs={3}>
                        <img 
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className={`thumbnail-image w-100 ${selectedImage === index ? 'active' : ''}`}
                          onClick={() => setSelectedImage(index)}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100x100?text=Image';
                          }}
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Product Details */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              {/* Category and Stock */}
              <div className="d-flex justify-content-between align-items-start mb-3">
                <Badge bg="secondary" className="fs-6">
                  {product.category}
                </Badge>
                <Badge bg={product.stock > 0 ? 'success' : 'danger'} className="fs-6">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </Badge>
              </div>

              {/* Product Name */}
              <h1 className="display-5 fw-bold text-dark mb-3">
                {product.name}
              </h1>

              {/* Brand */}
              <div className="mb-3">
                <span className="text-muted">Brand: </span>
                <strong className="text-primary">{product.brand}</strong>
              </div>

              {/* Price */}
              <div className="mb-4">
                <h2 className="text-primary fw-bold display-6">
                  ${product.price}
                </h2>
                <small className="text-muted">Inclusive of all taxes</small>
              </div>

              {/* Rating */}
              <div className="mb-4">
                <div className="d-flex align-items-center">
                  <div className="product-rating-large text-warning me-2">
                    ⭐⭐⭐⭐⭐
                  </div>
                  <span className="text-muted">(4.5) • 128 Reviews</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h5 className="fw-bold mb-3">Description</h5>
                <p className="text-muted lead">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-4">
                  <h5 className="fw-bold mb-3">Key Features</h5>
                  <ListGroup variant="flush">
                    {product.features.map((feature, index) => (
                      <ListGroup.Item key={index} className="px-0 border-0">
                        <i className="fas fa-check text-success me-2"></i>
                        {feature}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              )}

              {/* Action Buttons */}
              <div className="product-actions mt-auto">
                <Row className="g-3">
                  <Col md={6}>
                    <Button 
                      variant="primary" 
                      size="lg" 
                      className="w-100"
                      onClick={handleAddToCart}
                      disabled={!authService.isAuthenticated() || product.stock === 0}
                    >
                      {!authService.isAuthenticated() 
                        ? 'Login to Add' 
                        : product.stock === 0 
                          ? 'Out of Stock' 
                          : 'Add to Cart'
                      }
                    </Button>
                  </Col>
                  <Col md={6}>
                    <Button 
                      variant="success" 
                      size="lg" 
                      className="w-100"
                      onClick={handleBuyNow}
                      disabled={!authService.isAuthenticated() || product.stock === 0}
                    >
                      {!authService.isAuthenticated() 
                        ? 'Login to Buy' 
                        : product.stock === 0 
                          ? 'Out of Stock' 
                          : 'Buy Now'
                      }
                    </Button>
                  </Col>
                </Row>

                {/* Continue Shopping */}
                <div className="text-center mt-3">
                  <Button 
                    as={Link} 
                    to="/products" 
                    variant="primary" 
                    className="w-100"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Additional Information */}
      <Row className="mt-5">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Product Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between">
                      <strong>Category:</strong>
                      <span className="text-capitalize">{product.category}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between">
                      <strong>Brand:</strong>
                      <span>{product.brand}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between">
                      <strong>SKU:</strong>
                      <span>{product._id}</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between">
                      <strong>Availability:</strong>
                      <span className={product.stock > 0 ? 'text-success' : 'text-danger'}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between">
                      <strong>Shipping:</strong>
                      <span>Free shipping on orders over $99</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between">
                      <strong>Return Policy:</strong>
                      <span>30 days return policy</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;