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
  Form,
  InputGroup,
  Pagination
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { authService } from '../services/authService';
import '../styles/Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);

  const { addToCart } = useCart();

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  useEffect(() => {
    updateDisplayedProducts();
  }, [filteredProducts, currentPage]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading products...');
      const data = await productService.getAllProducts();
      console.log('✅ Products loaded:', data);
      setProducts(data.products || data);
      setError('');
    } catch (err) {
      console.error('❌ Error loading products:', err);
      setError(`Failed to load products: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      console.log('🔄 Loading categories...');
      const categoriesData = await productService.getCategories();
      console.log('✅ Categories loaded:', categoriesData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('❌ Error loading categories:', err);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product =>
        product.category === selectedCategory
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const updateDisplayedProducts = () => {
    // Calculate products to display for current page
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    setDisplayedProducts(currentProducts);
  };

  const handleAddToCart = async (productId) => {
    if (!authService.isAuthenticated()) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(productId, 1);
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setCurrentPage(1);
  };

  // Pagination functions
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculate pagination values
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage + 1;
  const currentShowing = Math.min(indexOfLastProduct, filteredProducts.length);

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Show only limited page numbers for better UX
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading products...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <div className="text-center">
            <h1 className="display-4 fw-bold text-primary">Our Products</h1>
            <p className="lead text-muted">
              Discover amazing products at great prices
            </p>
          </div>
        </Col>
      </Row>

      {/* Search and Filter Section */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary">
              🔍
            </Button>
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button 
            variant="outline-secondary" 
            onClick={clearFilters}
            className="w-100"
          >
            Clear Filters
          </Button>
        </Col>
      </Row>

      {/* Results Info */}
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted">
              Showing {indexOfFirstProduct}-{currentShowing} of {filteredProducts.length} products
              {filteredProducts.length !== products.length && ` (filtered from ${products.length} total)`}
            </span>
            {(searchTerm || selectedCategory) && (
              <Badge bg="primary" className="fs-6">
                {searchTerm && `Search: "${searchTerm}"`}
                {searchTerm && selectedCategory && ' • '}
                {selectedCategory && `Category: ${selectedCategory}`}
              </Badge>
            )}
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      {/* Products Grid */}
      <Row>
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <Col key={product._id} xl={3} lg={4} md={6} className="mb-4">
              <Card className="product-card h-100 border-0 shadow-sm">
                <div className="product-image-container">
                  <Card.Img 
                    variant="top" 
                    src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                  <Badge bg="success" className="product-stock-badge">
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </Badge>
                  {product.stock > 0 && product.stock < 20 && (
                    <Badge bg="warning" className="product-low-stock-badge">
                      Low stock
                    </Badge>
                  )}
                </div>
                
                <Card.Body className="d-flex flex-column">
                  <div className="product-category mb-2">
                    <small className="text-uppercase text-muted fw-bold">
                      {product.category}
                    </small>
                  </div>
                  
                  <Card.Title className="h6 flex-grow-1 product-name">
                    {product.name}
                  </Card.Title>
                  
                  <Card.Text className="product-description flex-grow-1">
                    {product.description?.substring(0, 100)}
                    {product.description?.length > 100 && '...'}
                  </Card.Text>

                  <div className="product-brand mb-2">
                    <small className="text-muted">
                      Brand: <strong>{product.brand}</strong>
                    </small>
                  </div>

                  <div className="product-price-rating mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="h5 text-primary fw-bold mb-0">
                        ${product.price}
                      </span>
                      <div className="product-rating text-warning">
                        ⭐⭐⭐⭐⭐
                        <small className="text-muted ms-1">(4.5)</small>
                      </div>
                    </div>
                  </div>

                  <div className="product-actions mt-3">
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="w-100 mb-2"
                      onClick={() => handleAddToCart(product._id)}
                      disabled={!authService.isAuthenticated() || product.stock === 0}
                    >
                      {!authService.isAuthenticated() 
                        ? 'Login to Add' 
                        : product.stock === 0 
                          ? 'Out of Stock' 
                          : 'Add to Cart'
                      }
                    </Button>
                    
                    <Button 
                      as={Link}
                      to={`/products/${product._id}`}
                      variant="outline-secondary" 
                      size="sm" 
                      className="w-100"
                    >
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Card className="text-center border-0">
              <Card.Body className="py-5">
                <div className="no-products-icon mb-3">😔</div>
                <h4>No products found</h4>
                <p className="text-muted mb-4">
                  {searchTerm || selectedCategory 
                    ? 'Try adjusting your search or filters' 
                    : 'No products available. Please check if the backend is running.'
                  }
                </p>
                {(searchTerm || selectedCategory) && (
                  <Button variant="primary" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
                {!searchTerm && !selectedCategory && (
                  <Button variant="primary" onClick={loadProducts}>
                    Retry Loading Products
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* Pagination */}
      {totalPages > 1 && (
        <Row className="mt-5">
          <Col>
            <div className="d-flex justify-content-center">
              <Pagination>
                {/* Previous Button */}
                <Pagination.Prev 
                  onClick={prevPage} 
                  disabled={currentPage === 1}
                />
                
                {/* Page Numbers */}
                {getVisiblePages().map((page, index) => (
                  <Pagination.Item
                    key={index}
                    active={page === currentPage}
                    onClick={() => typeof page === 'number' && paginate(page)}
                    disabled={page === '...'}
                  >
                    {page}
                  </Pagination.Item>
                ))}
                
                {/* Next Button */}
                <Pagination.Next 
                  onClick={nextPage} 
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
            
            {/* Page Info */}
            <div className="text-center mt-3">
              <small className="text-muted">
                Page {currentPage} of {totalPages}
              </small>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Products;