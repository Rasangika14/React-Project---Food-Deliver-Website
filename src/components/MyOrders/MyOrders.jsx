import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GiFoodTruck } from 'react-icons/gi';
import { FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './MyOrders.css';

const MyOrders = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    // Fetch user from localStorage or sessionStorage
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setError('Please log in to view your orders.');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      // Fetch user orders
      const fetchOrders = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`http://localhost:8081/orders/user/${user.id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch orders');
          }
          const data = await response.json();
          console.log('Fetched orders:', data); // Debug log to verify data
          setOrders(data);
        } catch (err) {
          setError(err.message || 'An error occurred while fetching orders.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrders();
    }
  }, [user]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Preparing':
        return 'bg-blue-100 text-blue-800';
      case 'On the way':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  if (!user) {
    return null; // Prevent rendering until user data is loaded
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center">
              <GiFoodTruck className="text-3xl text-[#ff4757]" />
              <span className="ml-2 text-2xl font-bold text-gray-800">Delight Foods</span>
            </div>
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={() => navigate('/')}
              aria-label="Close orders"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
          <div className="p-6">
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">My Orders</h1>
            <p className="text-gray-600 mb-6">View your order history below</p>

            {isLoading ? (
              <div className="text-center text-gray-600">Loading orders...</div>
            ) : orders.length === 0 ? (
              <p className="text-center text-gray-600">No orders found.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id} // Unique key for each order
                    className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            Order {order.id}: {order.items.map((item) => item.product_name).join(', ')}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Date: {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-800">
                            Total: Rs.{order.total.toFixed(2)}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status || 'Pending'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>
                          <strong>Payment Method:</strong> {order.payment_method || 'Card'}
                          {/* <strong>Payment Method:</strong> {order.payment_method || 'N/A'} */}
                        </p>
                      </div>
                      <button
                        className="mt-4 flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        {expandedOrder === order.id ? (
                          <>
                            Hide Details <FaChevronUp className="ml-1" />
                          </>
                        ) : (
                          <>
                            View Details <FaChevronDown className="ml-1" />
                          </>
                        )}
                      </button>
                      {expandedOrder === order.id && (
                        <div className="mt-4 border-t pt-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Order Items</h4>
                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div
                                key={item.product_id} // Unique key for each item
                                className="flex items-center gap-4"
                              >
                                <img
                                  src={item.image}
                                  alt={item.product_name}
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-800">
                                    {item.product_name}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Quantity: {item.quantity} × Rs.{item.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;