// import React, { useEffect } from 'react';
// import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import './Cart.css';

// const Cart = ({ cart, updateCart }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Check for successful payment via location state
//   useEffect(() => {
//     if (location.state?.paymentSuccess) {
//       updateCart([]); // Clear the cart
//       // Clear the location state to prevent repeated clearing
//       navigate('/cart', { replace: true, state: {} });
//     }
//   }, [location, updateCart, navigate]);

//   const incrementItem = (itemId) => {
//     updateCart(prevCart =>
//       prevCart.map(item =>
//         item.id === itemId 
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       )
//     );
//   };

//   const decrementItem = (itemId) => {
//     updateCart(prevCart =>
//       prevCart.map(item =>
//         item.id === itemId 
//           ? { ...item, quantity: Math.max(1, item.quantity - 1) }
//           : item
//       )
//     );
//   };

//   const removeItem = (itemId) => {
//     updateCart(prevCart => prevCart.filter(item => item.id !== itemId));
//   };

//   const getTotalPrice = () => {
//     return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
//   };

//   const proceedToCheckout = () => {
//     navigate('/checkout');
//   };

//   return (
//     <div className="cart-page">
//       <div className="cart-container">
//         <h1>Your Cart</h1>
        
//         {cart.length === 0 ? (
//           <div className="empty-cart">
//             <p>Your cart is empty</p>
//             <Link to="/menu" className="continue-shopping-btn">
//               Continue Shopping
//             </Link>
//           </div>
//         ) : (
//           <>
//             <div className="cart-items">
//               {cart.map(item => (
//                 <div key={item.id} className="cart-item">
//                   <div className="item-info">
//                     <h3>{item.name}</h3>
//                     <p>${item.price.toFixed(2)} each</p>
//                   </div>
//                   <div className="item-controls">
//                     <button 
//                       className="quantity-btn"
//                       onClick={() => decrementItem(item.id)}
//                     >
//                       <FaMinus />
//                     </button>
//                     <span className="quantity">{item.quantity}</span>
//                     <button 
//                       className="quantity-btn"
//                       onClick={() => incrementItem(item.id)}
//                     >
//                       <FaPlus />
//                     </button>
//                     <span className="item-total">
//                       ${(item.price * item.quantity).toFixed(2)}
//                     </span>
//                     <button 
//                       className="remove-btn"
//                       onClick={() => removeItem(item.id)}
//                     >
//                       <FaTrash />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="cart-summary">
//               <div className="total-section">
//                 <h3>Total:</h3>
//                 <span className="total-price">${getTotalPrice()}</span>
//               </div>
//               <button 
//                 className="checkout-btn"
//                 onClick={proceedToCheckout}
//               >
//                 Proceed to Checkout
//               </button>
//               <Link to="/menu" className="continue-shopping-btn">
//                 Continue Shopping
//               </Link>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Cart;