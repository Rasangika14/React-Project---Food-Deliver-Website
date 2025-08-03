import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import './Payment.css';

const Payment = ({ cart, total, user, setCart }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, deliveryInfo } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  // Log location.state for debugging
  useEffect(() => {
    console.log('location.state:', location.state);
  }, [location.state]);

  // PayHere configuration
  const merchantId = '1230604'; // Replace with your PayHere merchant ID
  const merchantSecret = 'MjE1MzkwMTYxNTMyODQyNjEwOTM0NzAyNDM3OTMxNzA3NDM4ODEw'; // Replace with your PayHere merchant secret
  const currency = 'LKR';
  const amount = (total + 450).toFixed(2); // Total including delivery fee
  const amountFormatted = parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 }).replaceAll(',', '');

  // Generate PayHere hash
  const hashedSecret = CryptoJS.MD5(merchantSecret).toString().toUpperCase();
  const hash = CryptoJS.MD5(merchantId + orderId + amountFormatted + currency + hashedSecret).toString().toUpperCase();

  // Load PayHere SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.payhere.lk/lib/payhere.js';
    script.async = true;
    script.onload = () => {
      console.log('PayHere SDK loaded');
    };
    document.body.appendChild(script);
  }, []);

  const updateOrderPayment = async (payherePaymentId, statusCode) => {
    if (!orderId) {
      throw new Error('No order ID provided');
    }

    const paymentData = {
      payment_method: 'card',
      payment_details: {
        payhere_payment_id: payherePaymentId,
        status_code: statusCode || 'N/A',
        card_details: {
          last_four_digits: 'N/A',
          card_type: 'N/A'
        }
      },
      status: statusCode === '2' ? 'Processing' : 'Pending'
    };

    try {
      const response = await fetch(`http://localhost:8081/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, response: ${text}`);
      }

      return true;
    } catch (error) {
      console.error('Error updating order payment:', error);
      throw error;
    }
  };

  const clearCart = () => {
    if (typeof setCart === 'function') {
      setCart([]);
    } else {
      console.warn('setCart is not a function. Cart not cleared.');
    }
  };

  const handlePayHerePayment = () => {
    if (!orderId) {
      alert('Order ID missing. Please complete the order process again.');
      return;
    }

    // PayHere payment callbacks
    window.payhere.onCompleted = async (payhereOrderId) => {
      try {
        setPaymentSuccess(null);
        const success = await updateOrderPayment(payhereOrderId, '2');
        setPaymentSuccess(success);
        if (success) {
          alert('Payment completed successfully. Order ID: ' + payhereOrderId);
          clearCart(); // Clear cart after successful payment
          setTimeout(() => {
            navigate('/my-orders', { state: { orderPlaced: true } });
          }, 2000);
        }
      } catch (error) {
        setPaymentSuccess(false);
        alert('Payment update failed: ' + error.message);
      }
    };

    window.payhere.onDismissed = () => {
      setPaymentSuccess(false);
      alert('Payment dismissed by user.');
    };

    window.payhere.onError = (error) => {
      setPaymentSuccess(false);
      alert('Payment error: ' + error);
    };

    // Prepare payment object with fallback values
    const payment = {
      sandbox: true, // Set to false for live environment
      merchant_id: merchantId,
      return_url: undefined,
      cancel_url: undefined,
      notify_url: 'http://localhost:8081/payhere-notify',
      order_id: orderId,
      items: cart.map(item => item.name).join(', '),
      amount: amountFormatted,
      currency: currency,
      hash: hash,
      first_name: deliveryInfo?.firstName || 'Guest',
      last_name: deliveryInfo?.lastName || '',
      email: deliveryInfo?.email || 'guest@example.com',
      phone: deliveryInfo?.phone || '0771234567',
      address: deliveryInfo?.street || '123, Galle Road',
      city: deliveryInfo?.city || 'Colombo',
      country: 'Sri Lanka'
    };

    // Trigger PayHere payment popup
    window.payhere.startPayment(payment);
  };

  const handleCashOnDelivery = async () => {
    if (!orderId) {
      alert('Order ID missing. Please complete the order process again.');
      return;
    }

    try {
      setPaymentSuccess(null);
      const response = await fetch(`http://localhost:8081/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_method: 'cash', payment_details: null, status: 'Pending' })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, response: ${text}`);
      }

      setPaymentSuccess(true);
      clearCart(); // Clear cart after successful order
      setTimeout(() => {
        navigate('/my-orders', { state: { orderPlaced: true } });
      }, 2000);
    } catch (error) {
      setPaymentSuccess(false);
      alert('Order confirmation failed: ' + error.message);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="order-summary">
          <h2>Bill Course</h2>
          <div className="order-items">
            {cart.map(item => (
              <div key={item.id} className="order-item">
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>{item.quantity} × Rs.{item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>Rs.{total.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Delivery:</span>
              <span>Rs.450.00</span>
            </div>
            <div className="total-row grand-total">
              <span>Total:</span>
              <span>Rs.{(total + 450).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="payment-method">
          <h2>Payment Method</h2>
          <div className="payment-options">
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
              />
              <span>Pay with Card (PayHere)</span>
            </label>
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
              />
              <span>Cash on Delivery</span>
            </label>
          </div>

          {paymentMethod === 'card' ? (
            <div className="payhere-payment">
              <p>Click below to proceed with card payment via PayHere.</p>
              <button onClick={handlePayHerePayment} className="pay-button">
                Pay Now with PayHere
              </button>
            </div>
          ) : (
            <div className="cash-on-delivery">
              <p>Pay with cash when your order arrives</p>
              <button onClick={handleCashOnDelivery} className="pay-button">
                Confirm Order
              </button>
            </div>
          )}

          {paymentSuccess !== null && (
            <div className={`payment-status ${paymentSuccess ? 'success' : 'error'}`}>
              {paymentSuccess
                ? 'Order confirmed successfully! Redirecting to My Orders...'
                : 'Order confirmation failed. Please try again.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;