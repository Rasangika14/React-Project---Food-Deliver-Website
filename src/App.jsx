import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Home from './components/Home/Home.jsx';
import About from './components/About/About.jsx';
import Menu from './components/Menu/Menu.jsx';
import Contact from './components/Contact/Contact.jsx';
import SignUp from './components/SignUp/SignUp.jsx';
import Login from './components/Login/Login.jsx';
import CartTotal from './components/CartTotal/CartTotal.jsx';
import DeliveryInfo from './components/DeliveryInfo/DeliveryInfo.jsx';
import Payment from './components/Payment/Payment.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import Profile from './components/Profile/Profile.jsx';
import MyOrders from './components/MyOrders/MyOrders.jsx';
// import MyOrders from './components/MyOrders.jsx'; // Updated import
import './App.css';

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

const App = () => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id) {
          setUser(parsedUser);
          // console.log('User loaded:', parsedUser);
        }
      } catch (err) {
        console.error('Error parsing stored user:', err);
      }
    }
  }, []);

  const calculateTotal = (cart) => {
    return cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  };

  return (
    <div className="App">
      <Navbar setUser={setUser}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<Menu cart={cart} setCart={setCart} user={user} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/carttotal" element={<CartTotal cart={cart} setCart={setCart} />} />
        <Route
          path="/delivery"
          element={
            <DeliveryInfo
              cart={cart}
              total={calculateTotal(cart)}
              onBack={() => navigate(-1)}
              user={user}
            />
          }
        />
        <Route
          Route
          path="/payment"
          element={
            <Payment
              cart={cart}
              setCart={setCart}
              total={cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
              user={user}
              />
          }
        />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/my-orders" element={<MyOrders user={user} />} />
      </Routes>
    </div>
  );
};

export default AppWrapper;