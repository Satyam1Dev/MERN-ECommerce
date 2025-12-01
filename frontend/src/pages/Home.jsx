import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Button, 
  Card, 
  Carousel,
  Badge,
  InputGroup,
  FormControl,
  Spinner
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { authService } from '../services/authService';
import '../styles/Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const data = await productService.getAllProducts({ page: 1 });
      const products = data.products || data;
      setFeaturedProducts(products.slice(0, 6));
      setTrendingProducts(products.slice(6, 10)); // Get 4 trending products
    } catch (error) {
      console.error('Error loading featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!authService.isAuthenticated()) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(productId, 1);
      // You can add a toast notification here instead of alert
      console.log('Product added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      // Simulate newsletter subscription
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const heroCarouselItems = [
    {
      id: 1,
      title: "Summer Collection 2024",
      description: "Discover the latest trends in fashion with exclusive designs and premium quality",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      buttonText: "Shop Collection",
      buttonVariant: "primary",
      discount: "30% OFF"
    },
    {
      id: 2,
      title: "Smart Technology Sale",
      description: "Up to 50% off on latest gadgets and smart home devices",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      buttonText: "Shop Deals",
      buttonVariant: "warning",
      discount: "50% OFF"
    },
    {
      id: 3,
      title: "Premium Member Benefits",
      description: "Free shipping on all orders + exclusive member discounts",
      image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      buttonText: "Join Now",
      buttonVariant: "success",
      discount: "FREE SHIPPING"
    }
  ];

  const features = [
    {
      icon: "🚀",
      title: "Fast Delivery",
      description: "Same-day delivery available in select areas"
    },
    {
      icon: "🔒",
      title: "Secure Payment",
      description: "256-bit SSL encryption for all transactions"
    },
    {
      icon: "↩️",
      title: "Easy Returns",
      description: "30-day hassle-free return policy"
    },
    {
      icon: "⭐",
      title: "Premium Quality",
      description: "Curated selection of premium products"
    },
    {
      icon: "🌍",
      title: "Global Shipping",
      description: "Worldwide delivery to 150+ countries"
    },
    {
      icon: "💎",
      title: "VIP Rewards",
      description: "Exclusive rewards for loyal customers"
    }
  ];

  const categories = [
    {
      name: "Electronics",
      image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      count: "120+ Products",
      
    },
    {
      name: "Fashion",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      count: "200+ Products",
    },
    {
      name: "Home & Living",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      count: "80+ Products",
    },
    {
      name: "Sports & Fitness",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      count: "150+ Products",
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "200+", label: "Brand Partners" },
    { number: "24/7", label: "Customer Support" },
    { number: "99%", label: "Satisfaction Rate" }
  ];

  return (
    <div className="home-page">
      {/* Hero Carousel */}
      <section className="hero-section">
        <Carousel fade indicators={true} controls={true} interval={5000}>
          {heroCarouselItems.map((item) => (
            <Carousel.Item key={item.id}>
              <div 
                className="carousel-slide"
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${item.image})` }}
              >
                <div className="carousel-overlay">
                  <Container>
                    <Row className="align-items-center min-vh-100">
                      <Col lg={6} className="hero-content-wrapper">
                        <div className="hero-content">
                          <Badge bg="warning" text="dark" className="hero-badge mb-3">
                            {item.discount}
                          </Badge>
                          <h1 className="hero-title display-2 fw-bold text-white">
                            {item.title}
                          </h1>
                          <p className="hero-description lead text-white mb-4">
                            {item.description}
                          </p>
                          <div className="hero-buttons">
                            <Button 
                              as={Link} 
                              to="/products" 
                              variant={item.buttonVariant}
                              size="lg"
                              className="me-3 hero-btn-primary"
                            >
                              {item.buttonText}
                            </Button>
                            <Button 
                              as={Link} 
                              to="/products" 
                              variant="outline-light"
                              size="lg"
                              className="hero-btn-secondary"
                            >
                              Explore More
                            </Button>
                          </div>
                          <div className="hero-features mt-4">
                            <span className="text-white-50">✓ Free Shipping</span>
                            <span className="text-white-50 mx-3">✓ Secure Checkout</span>
                            <span className="text-white-50">✓ 24/7 Support</span>
                          </div>
                        </div>
                      </Col>
                      <Col lg={6} className="text-center">
                        <div className="hero-visual">
                          <div className="floating-elements">
                            <div className="floating-card card-1">
                              <i className="fas fa-star"></i>
                              <small>Premium Quality</small>
                            </div>
                            <div className="floating-card card-2">
                              <i className="fas fa-shipping-fast"></i>
                              <small>Fast Delivery</small>
                            </div>
                            <div className="floating-card card-3">
                              <i className="fas fa-shield-alt"></i>
                              <small>Secure</small>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5">
        <Container>
          <Row className="g-4">
            {stats.map((stat, index) => (
              <Col lg={3} md={6} key={index}>
                <div className="stat-card text-center">
                  <h3 className="stat-number  fw-bold">{stat.number}</h3>
                  <p className="stat-label text-muted mb-0">{stat.label}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-title display-4 fw-bold">Why Choose Us</h2>
              <p className="section-subtitle text-muted fs-5">
                Experience the difference with our premium services
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col lg={4} md={6} key={index}>
                <Card className="feature-card text-center border-0 h-100">
                  <Card.Body className="p-4">
                    <div className="feature-icon-wrapper mb-4">
                      <div className="feature-icon">
                        {feature.icon}
                      </div>
                    </div>
                    <Card.Title className="h4 fw-bold mb-3">{feature.title}</Card.Title>
                    <Card.Text className="text-muted fs-6">
                      {feature.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="categories-section py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-title display-4 fw-bold">Shop by Category</h2>
              <p className="section-subtitle text-muted fs-5">
                Discover products tailored to your lifestyle
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {categories.map((category, index) => (
              <Col lg={3} md={6} key={index}>
                <Card 
                  className="category-card border-0 text-black overflow-hidden"
                  style={{ background: category.gradient }}
                >
                  <div className="category-content p-4 position-relative">
                    <Card.Body className="text-center p-0">
                      <div className="category-icon mb-3">
                        <i className={`fas fa-${getCategoryIcon(category.name)} fa-2x`}></i>
                      </div>
                      <Card.Title className="h4 fw-bold mb-2">{category.name}</Card.Title>
                      <Card.Text className="mb-3 opacity-75">
                        {category.count}
                      </Card.Text>
                      <Button 
                        as={Link} 
                        to="/products" 
                        variant="light"
                        size="sm"
                        className="category-btn"
                      >
                        Explore Now
                      </Button>
                    </Card.Body>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Featured Products */}
      <section className="featured-products py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-title display-4 fw-bold">Featured Products</h2>
              <p className="section-subtitle text-muted fs-5">
                Handpicked items just for you
              </p>
            </Col>
          </Row>
          
          {loading ? (
            <Row className="text-center py-5">
              <Col>
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading amazing products...</p>
              </Col>
            </Row>
          ) : (
            <>
              <Row className="g-4">
                {featuredProducts.map((product) => (
                  <Col xl={4} lg={6} key={product._id}>
                    <Card className="product-card h-100 border-0 shadow-sm overflow-hidden">
                      <div className="product-image-container position-relative">
                        <Card.Img 
                          variant="top" 
                          src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'}
                          className="product-image"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                          }}
                        />
                        <Badge bg="danger" className="product-badge position-absolute">
                          <i className="fas fa-crown me-1"></i>Featured
                        </Badge>
                        <div className="product-actions ">
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => handleAddToCart(product._id)}
                            className="action-btn"
                          >
                            <i className="fas fa-shopping-cart"></i>
                          </Button>
                          <Button 
                            variant="outline-light" 
                            size="sm"
                            className="action-btn"
                            as={Link}
                            to={`/products/${product._id}`}
                          >
                            <i className="fas fa-eye"></i>
                          </Button>
                        </div>
                      </div>
                      
                      <Card.Body className="d-flex flex-column p-4">
                        <div className="product-category mb-2">
                          <Badge bg="outline-primary" className="text-primary">
                            {product.category}
                          </Badge>
                        </div>
                        
                        <Card.Title className="h5 flex-grow-1 product-name">
                          {product.name}
                        </Card.Title>
                        
                        <Card.Text className="product-description text-muted small flex-grow-1">
                          {product.description?.substring(0, 80)}...
                        </Card.Text>

                        <div className="product-brand mb-2">
                          <small className="text-muted">
                            by <strong>{product.brand}</strong>
                          </small>
                        </div>

                        <div className="product-price-rating mt-auto">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="h4 text-primary fw-bold mb-0">
                              ${product.price}
                            </span>
                            <div className="product-rating text-warning">
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star-half-alt"></i>
                              <small className="text-muted ms-1">(4.5)</small>
                            </div>
                          </div>
                        </div>

                        <div className="product-actions mt-3">
                          <Button 
                            variant="primary" 
                            className="w-100"
                            onClick={() => handleAddToCart(product._id)}
                          >
                            <i className="fas fa-shopping-cart me-2"></i>
                            Add to Cart
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              
              <Row className="text-center mt-5">
                <Col>
                  <Button as={Link} to="/products" variant="outline-primary" size="lg" className="px-5">
                    <i className="fas fa-grid me-2"></i>
                    View All Products
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Container>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section py-5 text-white">
        <Container>
          <Row className="align-items-center text-center">
            <Col lg={8} className="mx-auto">
              <div className="newsletter-content">
                <h2 className="display-5 fw-bold mb-3">Join Our Community</h2>
                <p className="lead mb-4 opacity-75">
                  Get exclusive deals, early access to sales, and style tips delivered to your inbox
                </p>
                
                {subscribed ? (
                  <div className="alert alert-success mt-4">
                    <i className="fas fa-check-circle me-2"></i>
                    Thank you for subscribing! Welcome to our community.
                  </div>
                ) : (
                  <Form onSubmit={handleNewsletterSubmit}>
                    <InputGroup size="lg" className="newsletter-input-group">
                      <FormControl 
                        placeholder="Enter your email address" 
                        aria-label="Email for newsletter"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        type="email"
                        className="newsletter-input"
                      />
                      <Button variant="warning" type="submit" className="newsletter-btn">
                        <i className="fas fa-paper-plane me-2"></i>
                        Subscribe
                      </Button>
                    </InputGroup>
                  </Form>
                )}
                
                <div className="newsletter-features mt-4">
                  <small className="opacity-75">
                    <i className="fas fa-shield-alt me-1"></i> No spam ever · 
                    <i className="fas fa-lock me-1 ms-2"></i> Your data is secure · 
                    <i className="fas fa-gift me-1 ms-2"></i> Exclusive offers
                  </small>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

// Helper function to get category icons
const getCategoryIcon = (categoryName) => {
  const icons = {
    'Electronics': 'laptop',
    'Fashion': 'tshirt',
    'Home & Living': 'home',
    'Sports & Fitness': 'dumbbell',
    'Books': 'book',
    'Beauty': 'spa'
  };
  return icons[categoryName] || 'shopping-bag';
};

export default Home;