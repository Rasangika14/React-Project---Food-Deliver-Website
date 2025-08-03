import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaList, FaClipboardList, FaChartBar, FaEnvelope, FaSignOutAlt, FaTimes, FaCheck, FaReply, FaEye, FaSearch } from 'react-icons/fa';
import './AdminDashboard.css';
import { GiFoodTruck } from 'react-icons/gi';
import { jsPDF } from 'jspdf';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('addItem');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    image: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [logoImage, setLogoImage] = useState();
  const [replyData, setReplyData] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const categoryImages = {
    'Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150',
    'Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150',
    'Pasta': 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=150',
    'Salad': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=150',
    'Drinks': 'https://images.unsplash.com/photo-1551029506-0bccd828d307?w=150',
    'Appetizers': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=150',
    'Sushi': 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=150',
    'Asian': 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=150',
    'Desserts': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=150',
    'Breakfast': 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=150',
    'Beverages': 'https://images.unsplash.com/photo-1437419764061-2473afe69fc2?w=150'
  };

  useEffect(() => {
    fetch('http://localhost:8081/products')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => setProducts(data))
      .catch(error => {
        console.error('Error fetching products:', error);
        alert('Failed to load products. Please check if the server is running.');
      });

    fetch('http://localhost:8081/orders')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        setOrders(data);
        setFilteredOrders(data);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
        alert('Failed to load orders. Please check if the server is running.');
      });

    fetch('http://localhost:8081/messages')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        setMessages(data);
        setUnreadMessages(data.filter(msg => msg.status === 'unread').length);
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
        alert('Failed to load messages. Please check if the server is running.');
      });
  }, []);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    
    if (date) {
      const filtered = orders.filter(order => {
        const orderDate = new Date(order.created_at).toISOString().split('T')[0];
        return orderDate === date;
      });
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  };

  // Monthly report calculations
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const currentOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate.getFullYear() === currentYear && orderDate.getMonth() === currentMonth;
    });
  }, [orders]);

  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const previousOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate.getFullYear() === previousYear && orderDate.getMonth() === previousMonth;
    });
  }, [orders]);

  const calculateIncome = (orders) => {
    return orders.reduce((total, order) => {
      return total + (order.status === 'Delivered' ? order.total : 0);
    }, 0);
  };

  const currentIncome = calculateIncome(currentOrders);
  const previousIncome = calculateIncome(previousOrders);
  const incomeChange = previousIncome === 0 ? 0 : ((currentIncome - previousIncome) / previousIncome * 100).toFixed(1);

  const currentTotalOrders = currentOrders.length;
  const previousTotalOrders = previousOrders.length;
  const ordersChange = previousTotalOrders === 0 ? 0 : ((currentTotalOrders - previousTotalOrders) / previousTotalOrders * 100).toFixed(1);

  const getUniqueCustomers = (orders) => {
    const emails = new Set(orders.map(o => o.customer.email));
    return emails.size;
  };

  const currentCustomers = getUniqueCustomers(currentOrders);
  const previousCustomers = getUniqueCustomers(previousOrders);
  const customersChange = previousCustomers === 0 ? 0 : ((currentCustomers - previousCustomers) / previousCustomers * 100).toFixed(1);

  const currentDeliveredOrders = currentOrders.filter(o => o.status === 'Delivered').length;
  const previousDeliveredOrders = previousOrders.filter(o => o.status === 'Delivered').length;
  const deliveredChange = previousDeliveredOrders === 0 ? 0 : ((currentDeliveredOrders - previousDeliveredOrders) / previousDeliveredOrders * 100).toFixed(1);

  const categorySales = useMemo(() => {
    const sales = {};
    currentOrders.forEach(order => {
      if (order.status === 'Delivered') {
        order.items.forEach(item => {
          const product = products.find(p => p.id === item.product_id);
          if (product) {
            const category = product.category;
            const itemTotal = item.quantity * item.price;
            sales[category] = (sales[category] || 0) + itemTotal;
          }
        });
      }
    });
    return sales;
  }, [currentOrders, products]);

  const allCategories = useMemo(() => {
    return [...new Set(products.map(p => p.category))].filter(cat => categorySales[cat]);
  }, [products, categorySales]);

  const maxSales = Math.max(...Object.values(categorySales), 1);
  const categoryPercentages = useMemo(() => {
    const percentages = {};
    allCategories.forEach(cat => {
      const sales = categorySales[cat] || 0;
      percentages[cat] = (sales / maxSales) * 100;
    });
    return percentages;
  }, [categorySales, allCategories]);

  const productSales = useMemo(() => {
    const sales = {};
    currentOrders.forEach(order => {
      if (order.status === 'Delivered') {
        order.items.forEach(item => {
          const productId = item.product_id;
          const quantity = item.quantity;
          if (sales[productId]) {
            sales[productId].quantity += quantity;
          } else {
            const product = products.find(p => p.id === productId);
            if (product) {
              sales[productId] = {
                quantity: quantity,
                product: product
              };
            }
          }
        });
      }
    });
    return sales;
  }, [currentOrders, products]);

  const topProducts = useMemo(() => {
    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 4);
  }, [productSales]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.image && !formData.image.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i)) {
      alert('Please enter a valid image URL (jpg, jpeg, png, or gif)');
      return;
    }

    const productData = {
      productName: formData.productName,
      description: formData.description,
      category: formData.category,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      image: formData.image || null
    };

    try {
      let response;
      if (editingProduct) {
        response = await fetch(`http://localhost:8081/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
      } else {
        response = await fetch('http://localhost:8081/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
      }

      const result = await response.json();
      if (response.ok) {
        if (editingProduct) {
          setProducts(products.map(p => p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p));
          alert('Product updated successfully!');
          setEditingProduct(null);
        } else {
          setProducts([...products, { ...productData, id: result.id }]);
          alert('Product added successfully!');
        }
        setFormData({
          productName: '',
          description: '',
          category: '',
          price: '',
          quantity: '',
          image: ''
        });
      } else {
        alert(result.error || 'Error processing product');
      }
    } catch (error) {
      console.error('Error submitting product:', error);
      alert('Error submitting product: ' + error.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      description: product.description,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      image: product.image || ''
    });
    setActiveTab('addItem');
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`http://localhost:8081/products/${productId}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (response.ok) {
        setProducts(products.filter(product => product.id !== productId));
        alert('Product deleted successfully!');
      } else {
        alert(result.error || 'Error deleting product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product: ' + error.message);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8081/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const result = await response.json();
      if (response.ok) {
        setOrders(orders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        setFilteredOrders(filteredOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        alert(`Order ${orderId} status updated to ${newStatus}`);
      } else {
        alert(result.error || 'Error updating order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status: ' + error.message);
    }
  };

  const markMessageAsRead = async (messageId) => {
    try {
      const response = await fetch(`http://localhost:8081/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' })
      });
      const result = await response.json();
      if (response.ok) {
        setMessages(messages.map(msg => 
          msg.id === messageId ? { ...msg, status: 'read' } : msg
        ));
        setUnreadMessages(messages.filter(msg => msg.status === 'unread').length - 1);
      } else {
        alert(result.error || 'Error marking message as read');
      }
    } catch (error) {
      console

.error('Error marking message as read:', error);
      alert('Error marking message as read: ' + error.message);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(`http://localhost:8081/messages/${messageId}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== messageId));
        setUnreadMessages(messages.filter(msg => msg.status === 'unread').length);
        alert('Message deleted successfully!');
      } else {
        alert(result.error || 'Error deleting message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message: ' + error.message);
    }
  };

  const handleReplyChange = (messageId, value) => {
    setReplyData(prev => ({
      ...prev,
      [messageId]: value
    }));
  };

  const sendReply = async (messageId) => {
    const reply = replyData[messageId];
    if (!reply || reply.trim() === '') {
      alert('Please enter a reply message');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8081/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'replied', reply })
      });
      const result = await response.json();
      if (response.ok) {
        setMessages(messages.map(msg => 
          msg.id === messageId ? { ...msg, status: 'replied', reply, replied_at: new Date().toISOString() } : msg
        ));
        setUnreadMessages(messages.filter(msg => msg.status === 'unread').length);
        setReplyData(prev => {
          const newReplyData = { ...prev };
          delete newReplyData[messageId];
          return newReplyData;
        });
        alert('Reply sent successfully!');
      } else {
        alert(result.error || 'Error sending reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Error sending reply: ' + error.message);
    }
  };

  const handleLogout = () => {
    alert('You have been logged out');
  };

  const handleViewDetails = async (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
    try {
      const response = await fetch(`http://localhost:8081/orders/user/${order.user_id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const userOrders = await response.json();
      setFilteredOrders(userOrders);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      alert('Failed to load user orders. Please check if the server is running.');
    }
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedOrder(null);
    setFilteredOrders(orders);
    setSelectedDate('');
  };

  const getProductImage = (product) => {
    if (product.image && product.image.trim() !== '') {
      return product.image;
    }
    return categoryImages[product.category] || 'https://picsum Hohs/150';
  };

  const generateMonthlyReport = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Monthly Customer Order Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    const customerOrders = {};
    currentOrders.forEach(order => {
      const customerEmail = order.customer.email;
      customerOrders[customerEmail] = (customerOrders[customerEmail] || 0) + 1;
    });
    
    let yPosition = 50;
    doc.setFontSize(14);
    doc.text('Customer Order Summary', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.text('Customer Email', 20, yPosition);
    doc.text('Number of Orders', 150, yPosition);
    yPosition += 5;
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;
    
    Object.entries(customerOrders).forEach(([email, count]) => {
      doc.text(email, 20, yPosition);
      doc.text(count.toString(), 150, yPosition);
      yPosition += 10;
    });
    
    yPosition += 10;
    doc.setFontSize(14);
    doc.text('Delivered Items Summary', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.text('Item Name', 20, yPosition);
    doc.text('Total Quantity', 150, yPosition);
    yPosition += 5;
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;
    
    const itemQuantities = {};
    currentOrders.forEach(order => {
      if (order.status === 'Delivered') {
        order.items.forEach(item => {
          const itemName = item.product_name;
          itemQuantities[itemName] = (itemQuantities[itemName] || 0) + item.quantity;
        });
      }
    });
    
    Object.entries(itemQuantities).forEach(([itemName, quantity]) => {
      doc.text(itemName.slice(0, 30), 20, yPosition);
      doc.text(quantity.toString(), 150, yPosition);
      yPosition += 10;
    });
    
    yPosition += 10;
    doc.setFontSize(14);
    doc.text('Summary Statistics', 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    doc.text(`Total Customers: ${Object.keys(customerOrders).length}`, 20, yPosition);
    doc.text(`Total Orders: ${currentOrders.length}`, 20, yPosition + 10);
    doc.text(`Total Income: Rs.${currentIncome.toFixed(2)}`, 20, yPosition + 20);
    
    doc.save(`Monthly_Customer_Report_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <div className="brand-logoo">
                <GiFoodTruck className="logo-icon" />
                <span className="brand-namee">Delight Foods</span>
        </div>
        <ul className="menu">
          <li className={activeTab === 'addItem' ? 'active' : ''} onClick={() => setActiveTab('addItem')}>
            <FaPlus className="menu-icon" />
            <span>Add Item</span>
          </li>
          <li className={activeTab === 'listItems' ? 'active' : ''} onClick={() => setActiveTab('listItems')}>
            <FaList className="menu-icon" />
            <span>List of Items</span>
          </li>
          <li className={activeTab === 'viewOrders' ? 'active' : ''} onClick={() => setActiveTab('viewOrders')}>
            <FaClipboardList className="menu-icon" />
            <span>View Orders</span>
          </li>
          <li className={activeTab === 'monthlyReports' ? 'active' : ''} onClick={() => setActiveTab('monthlyReports')}>
            <FaChartBar className="menu-icon" />
            <span>Monthly Reports</span>
          </li>
          <li className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>
            <FaEnvelope className="menu-icon" />
            <span>Messages {unreadMessages > 0 && <span className="badge">{unreadMessages}</span>}</span>
          </li>
          <li className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="menu-icon" />
            <span>Log Out</span>
          </li>
        </ul>
      </div>
      <div className="main-content">
        {activeTab === 'addItem' && (
          <div className="add-item">
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Image URL </label> 
                <input 
                  type="text" 
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Enter image URL or leave blank for default"
                />
                <div className="image-preview-container">
                  {formData.image ? (
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="image-preview"
                      onError={(e) => { 
                        e.target.src = categoryImages[formData.category] || 'https://picsum.photos/150'; 
                      }}
                    />
                  ) : (
                    formData.category && (
                      <div className="default-image-preview">
                        <p>Default {formData.category} image will be used:</p>
                        <img 
                          src={categoryImages[formData.category] || 'https://picsum.photos/150'} 
                          alt="Default preview" 
                          className="image-preview"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Burger">Burger</option>
                  <option value="Pasta">Pasta</option>
                  <option value="Salad">Salad</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Appetizers">Appetizers</option>
                  <option value="Sushi">Sushi</option>
                  <option value="Asian">Asian</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Beverages">Beverages</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (Rs.)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                {editingProduct && (
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setEditingProduct(null);
                      setFormData({
                        productName: '',
                        description: '',
                        category: '',
                        price: '',
                        quantity: '',
                        image: ''
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
        {activeTab === 'listItems' && (
          <div className="list-items">
            <div className="header">
              <h2>List of Products</h2>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search by name or category..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                <FaSearch className="search-icon" />
              </div>
              <div className="total-products">{filteredProducts.length} products</div>
            </div>
            <div className="product-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img 
                      src={getProductImage(product)} 
                      alt={product.productName}
                      onError={(e) => { 
                        e.target.src = categoryImages[product.category] || 'https://picsum.photos/150';
                      }}
                    />
                    {product.quantity <= 5 && (
                      <span className="low-stock">Low Stock</span>
                    )}
                  </div>
                  <div className="product-details">
                    <h3>{product.productName}</h3>
                    <p className="description">{product.description}</p>
                    <div className="meta">
                      <span className="category">{product.category}</span>
                      <div className="price-quantity">
                        <span className="price">Rs.{product.price.toFixed(2)}  </span>
                        <span className="quantity">Qty: {product.quantity}</span>
                      </div>
                    </div>
                    <div className="actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'viewOrders' && (
          <div className="view-orders">
            <div className="header">
              <h2>Orders</h2>
              <div className="order-stats">
                <span className="total">Total: {filteredOrders.length}</span>
                <span className="pending">Pending: {filteredOrders.filter(o => o.status === 'Pending').length}</span>
                <span className="delivered">Delivered: {filteredOrders.filter(o => o.status === 'Delivered').length}</span>
              </div>
              <div className="date-filter">
                <label>Filter by Date: </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="date-input"
                />
              </div>
            </div>
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Products</th>
                    <th>Total</th>
                    <th>Customer</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr 
                      key={order.id} 
                      className={`status-${order.status.toLowerCase().replace(' ', '-')}${selectedOrder && selectedOrder.id === order.id ? ' selected' : ''}`}
                    >
                      <td>{order.id}</td>
                      <td>
                        {order.items.map(item => (
                          <div key={item.product_id}>
                            {item.product_name} (Qty: {item.quantity})
                          </div>
                        ))}
                      </td>
                      <td>Rs{order.total.toFixed(2)}</td>
                      <td>
                        <div className="customer-details">
                          <p><strong>{order.customer.name}</strong></p>
                          <p>{order.customer.phone}</p>
                          <p>{order.customer.email}</p>
                          <p>{order.customer.address}</p>
                        </div>
                      </td>
                      <td>{order.payment_method === 'cash' ? 'Cash on Delivery' : 'Card'}</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`status-select ${order.status.toLowerCase().replace(' ', '-')}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="On the way">On the way</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <button 
                          className="view-btn"
                          onClick={() => handleViewDetails(order)}
                        >
                          <FaEye /> Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {showDetails && selectedOrder && (
              <div className="order-details-modal">
                <div className="modal-content">
                  <div className="modal-header">
                    <h2>Order Details - ID: {selectedOrder.id}</h2>
                    <button className="close-btn" onClick={closeDetails}>
                      <FaTimes />
                    </button>
                  </div>
                  <div className="modal-body">
                    <h3>Customer Information</h3>
                    <table className="details-table">
                      <tbody>
                        <tr>
                          <td><strong>Name</strong></td>
                          <td>{selectedOrder.customer.name}</td>
                        </tr>
                        <tr>
                          <td><strong>Email</strong></td>
                          <td>{selectedOrder.customer.email}</td>
                        </tr>
                        <tr>
                          <td><strong>Phone</strong></td>
                          <td>{selectedOrder.customer.phone}</td>
                        </tr>
                        <tr>
                          <td><strong>Address</strong></td>
                          <td>{selectedOrder.customer.address}</td>
                        </tr>
                      </tbody>
                    </table>
                    <h3>Order Information</h3>
                    <table className="details-table">
                      <tbody>
                        <tr>
                          <td><strong>Order ID</strong></td>
                          <td>{selectedOrder.id}</td>
                        </tr>
                        <tr>
                          <td><strong>Payment Method</strong></td>
                          <td>{selectedOrder.payment_method === 'cash' ? 'Cash on Delivery' : 'Card'}</td>
                        </tr>
                        <tr>
                          <td><strong>Status</strong></td>
                          <td>{selectedOrder.status}</td>
                        </tr>
                        <tr>
                          <td><strong>Subtotal</strong></td>
                          <td>Rs{selectedOrder.subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td><strong>Delivery Fee</strong></td>
                          <td>Rs{selectedOrder.delivery_fee.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td><strong>Total</strong></td>
                          <td>Rs{selectedOrder.total.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td><strong>Order Date</strong></td>
                          <td>{new Date(selectedOrder.created_at).toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                    <h3>Products</h3>
                    <table className="order-items-table">
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Product Name</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map(item => (
                          <tr key={item.product_id}>
                            <td>
                              <img 
                                src={item.image || categoryImages[products.find(p => p.id === item.product_id)?.category] || 'https://picsum.photos/50'} 
                                alt={item.product_name}
                                className="order-item-image"
                                onError={(e) => { e.target.src = 'https://picsum.photos/50'; }}
                              />
                            </td>
                            <td>{item.product_name}</td>
                            <td>{item.quantity}</td>
                            <td>Rs{item.price.toFixed(2)}</td>
                            <td>Rs{(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <h3>Other Orders by This Customer</h3>
                    <table className="orders-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Products</th>
                          <th>Total</th>
                          <th>Payment</th>
                          <th>Status</th>
                          <th>Order Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders
                          .filter(o => o.user_id === selectedOrder.user_id && o.id !== selectedOrder.id)
                          .map(order => (
                            <tr key={order.id} className={`status-${order.status.toLowerCase().replace(' ', '-')}`}>
                              <td>{order.id}</td>
                              <td>
                                {order.items.map(item => (
                                  <div key={item.product_id}>
                                    {item.product_name} (Qty: {item.quantity})
                                  </div>
                                ))}
                              </td>
                              <td>Rs{order.total.toFixed(2)}</td>
                              <td>{order.payment_method === 'cash' ? 'Cash on Delivery' : 'Card'}</td>
                              <td>{order.status}</td>
                              <td>{new Date(order.created_at).toLocaleString()}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="modal-footer">
                    <button className="close-btn" onClick={closeDetails}>
                      <FaTimes />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'monthlyReports' && (
          <div className="monthly-reports">
            <h2>Monthly Reports - {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
            <button className="generate-report-btn" onClick={generateMonthlyReport}>
              Generate PDF Report
            </button>
            <div className="report-summary">
              <div className="stat-card income">
                <h3>Total Income</h3>
                <p>Rs.{currentIncome.toFixed(2)}</p>
                <div className={`trend ${incomeChange >= 0 ? 'up' : 'down'}`}>
                  {incomeChange >= 0 ? '↑' : '↓'} {Math.abs(incomeChange)}% from last month
                </div>
              </div>
              <div className="stat-card orders">
                <h3>Total Orders</h3>
                <p>{currentTotalOrders}</p>
                <div className={`trend ${ordersChange >= 0 ? 'up' : 'down'}`}>
                  {ordersChange >= 0 ? '↑' : '↓'} {Math.abs(ordersChange)}% from last month
                </div>
              </div>
              <div className="stat-card delivered">
                <h3>Delivered Orders</h3>
                <p>{currentDeliveredOrders}</p>
                <div className={`trend ${deliveredChange >= 0 ? 'up' : 'down'}`}>
                  {deliveredChange >= 0 ? '↑' : '↓'} {Math.abs(deliveredChange)}% from last month
                </div>
              </div>
              <div className="stat-card customers">
                <h3>Unique Customers</h3>
                <p>{currentCustomers}</p>
                <div className={`trend ${customersChange >= 0 ? 'up' : 'down'}`}>
                  {customersChange >= 0 ? '↑' : '↓'} {Math.abs(customersChange)}% from last month
                </div>
              </div>
            </div>
            <div className="chart-container">
              <h3>Sales by Category</h3>
              <div className="bar-chart">
                <div className="chart-bars">
                  {allCategories.map(cat => (
                    <div key={cat} className="bar-container">
                      <div className={`bar ${cat.toLowerCase()}`} style={{ height: `${categoryPercentages[cat]}%` }}></div>
                      <span>{cat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="popular-items">
              <h3>Top Selling Products</h3>
              <div className="popular-grid">
                {topProducts.map(ps => (
                  <div key={ps.product.id} className="popular-item">
                    <img 
                      src={getProductImage(ps.product)} 
                      alt={ps.product.productName}
                      onError={(e) => { 
                        e.target.src = categoryImages[ps.product.category] || 'https://picsum.photos/150';
                      }}
                    />
                    <div className="popular-details">
                      <h4>{ps.product.productName}</h4>
                      <p className="price">Rs{ps.product.price.toFixed(2)}</p>
                      <p className="sold">{ps.quantity} sold this month</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'messages' && (
          <div className="messages">
            <div className="header">
              <h2>Customer Messages</h2>
              <div className="message-stats">
                <span className="total">Total: {messages.length}</span>
                <span className="unread">Unread: {unreadMessages}</span>
              </div>
            </div>
            <div className="message-list">
              {messages.map(msg => (
                <div key={msg.id} className={`message-card ${msg.status === 'unread' ? 'unread' : ''}`}>
                  <div className="message-header">
                    <div className="sender-info">
                      <h4>{msg.name}</h4>
                      <p>{msg.email}</p>
                      {msg.phone && <p>{msg.phone}</p>}
                    </div>
                    <div className="message-date">{new Date(msg.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="message-content">
                    <p>{msg.message}</p>
                    {msg.reply && (
                      <div className="reply-content">
                        <h5>Reply (Sent on {new Date(msg.replied_at).toLocaleDateString()}):</h5>
                        <p>{msg.reply}</p>
                      </div>
                    )}
                    {msg.status !== 'replied' && (
                      <div className="reply-form">
                        <textarea
                          value={replyData[msg.id] || ''}
                          onChange={(e) => handleReplyChange(msg.id, e.target.value)}
                          placeholder="Type your reply here..."
                          rows="4"
                        />
                        <button 
                          className="reply-btn"
                          onClick={() => sendReply(msg.id)}
                        >
                          <FaReply /> Send Reply
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="message-actions">
                    {msg.status === 'unread' && (
                      <button 
                        className="mark-read-btn"
                        onClick={() => markMessageAsRead(msg.id)}
                      >
                        <FaCheck /> Mark as read
                      </button>
                    )}
                    <button 
                      className="delete-message-btn"
                      onClick={() => deleteMessage(msg.id)}
                    >
                      <FaTimes /> Delete
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

export default AdminDashboard;