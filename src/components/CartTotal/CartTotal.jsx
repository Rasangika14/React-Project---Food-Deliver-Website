import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import './CartTotal.css';

const CartTotal = ({ cart, updateCart }) => {
  const navigate = useNavigate();
  const deliveryFee = 2.99; // Example delivery fee

  const incrementItem = (itemId) => {
    updateCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrementItem = (itemId) => {
    updateCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId 
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const removeItem = (itemId) => {
    updateCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const calculateTotal = () => {
    return (parseFloat(calculateSubtotal()) + deliveryFee).toFixed(2);
  };

  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-total-page">
      <div className="cart-total-container">
        <h1>Your Order Summary</h1>
        
        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Link to="/menu" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-table">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.id} className="cart-item-row">
                      <td className="item-title">
                        <div className="item-image">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <span>{item.name}</span>
                      </td>
                      <td className="item-price">${item.price.toFixed(2)}</td>
                      <td className="item-quantity">
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn"
                            onClick={() => decrementItem(item.id)}
                          >
                            <FaMinus />
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button 
                            className="quantity-btn"
                            onClick={() => incrementItem(item.id)}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </td>
                      <td className="item-total">${(item.price * item.quantity).toFixed(2)}</td>
                      <td className="item-action">
                        <button 
                          className="remove-btn"
                          onClick={() => removeItem(item.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${calculateSubtotal()}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee:</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${calculateTotal()}</span>
              </div>
              <button 
                className="checkout-btn"
                onClick={proceedToCheckout}
              >
                Proceed to Checkout
              </button>
              <Link to="/menu" className="continue-shopping-btn">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTotal;