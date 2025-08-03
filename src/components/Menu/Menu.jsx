import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaPlus, FaTimes, FaMinus } from 'react-icons/fa';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import './Menu.css';

const Menu = ({ cart, setCart, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const [menuData, setMenuData] = useState([]);
  const [filteredMenuData, setFilteredMenuData] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8081/products');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const categories = [...new Set(data.map(item => item.category))];
      const groupedData = categories.map((category, index) => ({
        id: index + 1,
        category,
        description: `Delicious ${category.toLowerCase()} items`,
        image: data.find(item => item.category === category)?.image || '',
        items: data
          .filter(item => item.category === category)
          .map(item => ({
            id: item.id,
            name: item.productName,
            description: item.description,
            price: parseFloat(item.price),
            image: item.image.startsWith('http') ? item.image : `http://localhost:8081${item.image}`,
            availableQuantity: parseInt(item.quantity)
          }))
      }));
      setMenuData(groupedData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Refresh menu data when returning from payment page
  useEffect(() => {
    if (location.state?.orderPlaced) {
      fetchData(); // Re-fetch data to get updated quantities
    }
  }, [location.state]);

  // Filter menu data based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredMenuData(menuData);
    } else {
      const filtered = menuData
        .map(category => ({
          ...category,
          items: category.items.filter(item =>
            item.name.toLowerCase().includes(searchQuery) ||
            category.category.toLowerCase().includes(searchQuery)
          )
        }))
        .filter(category => category.items.length > 0);
      setFilteredMenuData(filtered);
    }
  }, [menuData, searchQuery]);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  const updateItemQuantity = (itemId, amount) => {
    setMenuData(prevMenuData => {
      return prevMenuData.map(category => ({
        ...category,
        items: category.items.map(item => {
          if (item.id === itemId) {
            return {
              ...item,
              availableQuantity: Math.max(0, item.availableQuantity + amount)
            };
          }
          return item;
        })
      }));
    });
  };

  const addToCart = (item) => {
    if (item.availableQuantity <= 0) {
      alert('This item is out of stock!');
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    
    updateItemQuantity(item.id, -1);
    setShowCartNotification(true);
    const timer = setTimeout(() => setShowCartNotification(false), 3000);
    return () => clearTimeout(timer);
  };

  const removeFromCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem?.quantity > 1) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prevCart.filter(cartItem => cartItem.id !== item.id);
    });
    
    updateItemQuantity(item.id, 1);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0).toFixed(2);
  };

  const toggleCartModal = () => {
    setShowCartModal(!showCartModal);
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/delivery' } });
    } else {
      setShowCartModal(false);
      navigate('/delivery');
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error loading menu</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="menu-page">
      {showCartNotification && (
        <div className="cart-notification">
          <div className="notification-content">
            <h4>Item added to cart!</h4>
            <div className="cart-items-preview">
              {cart.slice(-3).map(item => (
                <div key={`preview-${item.id}`} className="cart-preview-item">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="preview-item-image" 
                    loading="lazy"
                  />
                  <span>{item.name} (x{item.quantity || 1}) - Rs.{item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <span>Total: Rs.{getTotalPrice()}</span>
            </div>
          </div>
          <button 
            className="close-notification-btn"
            onClick={() => setShowCartNotification(false)}
            aria-label="Close notification"
          >
            <FaTimes />
          </button>
        </div>
      )}

      <div 
        className="floating-cart-icon" 
        onClick={toggleCartModal}
        role="button"
        tabIndex={0}
        aria-label="View cart"
      >
        <FaShoppingCart />
        {cart.length > 0 && (
          <span className="cart-badge">{getTotalItems()}</span>
        )}
      </div>

      {showCartModal && (
        <div className="cart-modal">
          <div className="cart-modal-content">
            <div className="cart-modal-header">
              <h3>Your Order</h3>
              <button 
                className="close-modal-btn"
                onClick={toggleCartModal}
                aria-label="Close cart"
              >
                <FaTimes />
              </button>
            </div>
            
            {cart.length === 0 ? (
              <div className="empty-cart-message">
                <p>Your cart is empty</p>
                <p>Add some delicious items to get started!</p>
              </div>
            ) : (
              <>
                <div className="cart-items-list">
                  {cart.map(item => (
                    <div key={`cart-${item.id}`} className="cart-item">
                      <div className="cart-item-image">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          loading="lazy"
                        />
                      </div>
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <p>Rs.{item.price.toFixed(2)} × {item.quantity}</p>
                      </div>
                      <div className="cart-item-actions">
                        <button 
                          className="quantity-btn"
                          onClick={() => removeFromCart(item)}
                          aria-label={`Remove one ${item.name} from cart`}
                        >
                          <FaMinus />
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          className="quantity-btn"
                          onClick={() => addToCart(item)}
                          disabled={!filteredMenuData
                            .flatMap(category => category.items)
                            .find(menuItem => menuItem.id === item.id)?.availableQuantity}
                          aria-label={`Add one more ${item.name} to cart`}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div className="cart-total">
                    <span>Total Items:</span>
                    <span>{getTotalItems()}</span>
                  </div>
                  <div className="cart-total">
                    <span>Total Price:</span>
                    <span>Rs.{getTotalPrice()}</span>
                  </div>
                  <button 
                    className="checkout-btn"
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="menu-hero">
        <div className="hero-content">
          <h1>Our Delicious Menu</h1>
          <p>Premium ingredients, authentic flavors, made with love</p>
          {searchQuery && (
            <p className="search-results-info">Showing results for: "{searchQuery}"</p>
          )}
        </div>
      </div>

      <div className="menu-container">
        <h2 className="section-title">Food Categories</h2>
        <p className="section-subtitle">Select a category to explore our offerings</p>
        
        <div className="categories-grid">
          {filteredMenuData.map((category) => (
            <div 
              key={`category-${category.id}`}
              className={`category-card ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
              role="button"
              tabIndex={0}
              aria-label={`View ${category.category} items`}
            >
              <div className="category-image">
                {category.image ? (
                  <img 
                    src={category.image.startsWith('http') ? category.image : `http://localhost:8081${category.image}`} 
                    alt={category.category} 
                    loading="lazy"
                  /> 
                ) : (
                  <div className="no-image-placeholder">No Image</div>
                )}
                <div className="category-overlay"></div>
              </div>
              <div className="category-info">
                <h3>{category.category}</h3>
                <p>{category.description}</p>
                <span className="view-items">
                  {activeCategory === category.id ? 'Items' : 'View Items'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {activeCategory && (
          <div className="category-items-container">
            <h3 className="items-title">
              {filteredMenuData.find(c => c.id === activeCategory)?.category} Menu
            </h3>
            <div className="items-grid">
              {filteredMenuData.find(c => c.id === activeCategory)?.items.map((item) => (
                <div key={`item-${item.id}`} className="menu-item-card">
                  <div className="item-images">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      loading="lazy"
                    />
                  </div>
                  <div className="item-content">
                    <div className="item-header">
                      <h4>{item.name}</h4>
                      <span className="item-price">Rs.{item.price.toFixed(2)}</span>
                    </div>
                    <p className="item-description">{item.description}</p>
                    <div className="item-stock">
                      Available: {item.availableQuantity}
                    </div>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => addToCart(item)}
                      disabled={item.availableQuantity <= 0}
                      aria-label={`Add ${item.name} to cart`}
                    >
                      <FaPlus /> 
                      {item.availableQuantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;