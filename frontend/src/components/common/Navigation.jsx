import React, { useEffect } from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useCart } from '../../context/CartContext';
import './../../styles/Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const currentUser = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();
  const { getCartItemsCount } = useCart();

  console.log('🧭 Navigation - Is authenticated:', isAuthenticated);
  console.log('🧭 Navigation - Current user:', currentUser);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar-custom');
      if (navbar && window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else if (navbar) {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Navbar bg="white" variant="light" expand="lg" fixed="top" className="navbar-custom shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-text fw-bold">
          🛍️ MERNStore
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/products"
              className={location.pathname === '/products' ? 'active' : ''}
            >
              Products
            </Nav.Link>
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/cart"
                  className={location.pathname === '/cart' ? 'active' : ''}
                >
                  🛒 Cart
                  {getCartItemsCount() > 0 && (
                    <Badge bg="danger" className="ms-1">
                      {getCartItemsCount()}
                    </Badge>
                  )}
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/profile"
                  className={location.pathname === '/profile' ? 'active' : ''}
                >
                  👋 {currentUser?.name}
                </Nav.Link>
                <Nav.Link 
                  onClick={() => {
                    authService.logout();
                    window.location.reload();
                  }}
                >
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/login"
                  className={location.pathname === '/login' ? 'active' : ''}
                >
                  Login
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/register" 
                  className="btn-primary-nav"
                >
                  Sign Up
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;