const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'Uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '', // Update with your MySQL password
    database: 'food'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Create users table if not exists
const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

db.query(createUsersTable, (err) => {
    if (err) {
        console.error('Error creating users table:', err);
        throw err;
    }
    console.log('Users table ready');
});

// Create products table if not exists
const createProductsTable = `CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productName VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

db.query(createProductsTable, (err) => {
    if (err) {
        console.error('Error creating products table:', err);
        throw err;
    }
    console.log('Products table ready');
});

// Create messages table if not exists
const createMessagesTable = `CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
    reply TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    replied_at TIMESTAMP NULL
)`;

db.query(createMessagesTable, (err) => {
    if (err) {
        console.error('Error creating messages table:', err);
        throw err;
    }
    console.log('Messages table ready');
});

// Create orders table if not exists
const createOrdersTable = `CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    payment_method ENUM('card', 'cash') DEFAULT 'cash',
    payment_details JSON,
    status ENUM('Pending', 'Processing', 'Preparing', 'On the way', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
)`;

db.query(createOrdersTable, (err) => {
    if (err) {
        console.error('Error creating orders table:', err);
        throw err;
    }
    console.log('Orders table ready');
});

// Create order_items table if not exists
const createOrderItemsTable = `CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
)`;

db.query(createOrderItemsTable, (err) => {
    if (err) {
        console.error('Error creating order_items table:', err);
        throw err;
    }
    console.log('Order_items table ready');
});

// Signup endpoint
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        const checkUser = `SELECT * FROM users WHERE email = ?`;
        db.query(checkUser, [email], async (err, result) => {
            if (err) {
                console.error('Database error during signup:', err);
                return res.status(500).json({ error: 'Database error', details: err.message });
            }
            
            if (result.length > 0) {
                return res.status(400).json({ error: 'User already exists' });
            }
            
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            
            const insertUser = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
            db.query(insertUser, [name, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error creating user:', err);
                    return res.status(500).json({ error: 'Error creating user', details: err.message });
                }
                
                return res.status(201).json({ message: 'User created successfully' });
            });
        });
    } catch (error) {
        console.error('Server error during signup:', error);
        return res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    const findUser = `SELECT * FROM users WHERE email = ?`;
    db.query(findUser, [email], async (err, result) => {
        if (err) {
            console.error('Database error during login:', err);
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        
        if (result.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = result[0];
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at
        };
        
        return res.json({ message: 'Login successful', user: userData });
    });
});

// Add product endpoint
app.post('/products', upload.single('image'), (req, res) => {
    const { productName, description, category, price, quantity } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const insertProduct = `INSERT INTO products (productName, description, category, price, quantity, image) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(insertProduct, [productName, description, category, price, quantity, image], (err, result) => {
        if (err) {
            console.error('Error adding product:', err);
            return res.status(500).json({ error: 'Error adding product', details: err.message });
        }
        return res.status(201).json({ message: 'Product added successfully', id: result.insertId });
    });
});

// Get all products endpoint
app.get('/products', (req, res) => {
    const selectProducts = `SELECT * FROM products`;
    db.query(selectProducts, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        return res.json(results);
    });
});

// Update product endpoint
app.put('/products/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { productName, description, category, price, quantity } = req.body;
    let image = req.body.image;

    if (req.file) {
        image = `/uploads/${req.file.filename}`;
    }

    const updateProduct = `UPDATE products SET productName = ?, description = ?, category = ?, price = ?, quantity = ?, image = ? WHERE id = ?`;
    db.query(updateProduct, [productName, description, category, price, quantity, image, id], (err, result) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).json({ error: 'Error updating product', details: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.json({ message: 'Product updated successfully' });
    });
});

// Delete product endpoint
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    const deleteProduct = `DELETE FROM products WHERE id = ?`;
    db.query(deleteProduct, [id], (err, result) => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ error: 'Error deleting product', details: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.json({ message: 'Product deleted successfully' });
    });
});

// Add message endpoint
app.post('/messages', (req, res) => {
    const { name, email, phone, message } = req.body;
    const insertMessage = `INSERT INTO messages (name, email, phone, message) VALUES (?, ?, ?, ?)`;
    db.query(insertMessage, [name, email, phone, message], (err, result) => {
        if (err) {
            console.error('Error adding message:', err);
            return res.status(500).json({ error: 'Error adding message', details: err.message });
        }
        return res.status(201).json({ message: 'Message sent successfully', id: result.insertId });
    });
});

// Get all messages endpoint
app.get('/messages', (req, res) => {
    const selectMessages = `SELECT * FROM messages ORDER BY created_at DESC`;
    db.query(selectMessages, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        return res.json(results);
    });
});

// Update message status and reply endpoint
app.put('/messages/:id', (req, res) => {
    const { id } = req.params;
    const { status, reply } = req.body;
    const updateMessage = `UPDATE messages SET status = ?, reply = ?, replied_at = CURRENT_TIMESTAMP WHERE id = ?`;
    db.query(updateMessage, [status, reply, id], (err, result) => {
        if (err) {
            console.error('Error updating message:', err);
            return res.status(500).json({ error: 'Error updating message', details: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Message not found' });
        }
        return res.json({ message: 'Message updated successfully' });
    });
});

// Delete message endpoint
app.delete('/messages/:id', (req, res) => {
    const { id } = req.params;
    const deleteMessage = `DELETE FROM messages WHERE id = ?`;
    db.query(deleteMessage, [id], (err, result) => {
        if (err) {
            console.error('Error deleting message:', err);
            return res.status(500).json({ error: 'Error deleting message', details: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Message not found' });
        }
        return res.json({ message: 'Message deleted successfully' });
    });
});

// Add order endpoint
app.post('/orders', (req, res) => {
    const { user_id, delivery_info, cart, subtotal, delivery_fee, total } = req.body;

    // Start a transaction to ensure atomicity
    db.beginTransaction(err => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json({ error: 'Error starting transaction', details: err.message });
        }

        // Insert order
        const insertOrder = `INSERT INTO orders (user_id, first_name, last_name, email, street, city, state, zip_code, phone, subtotal, delivery_fee, total, payment_method, payment_details, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'cash', NULL, 'Pending')`;
        db.query(insertOrder, [
            user_id || null,
            delivery_info.firstName,
            delivery_info.lastName,
            delivery_info.email,
            delivery_info.street,
            delivery_info.city,
            delivery_info.state,
            delivery_info.zipCode,
            delivery_info.phone,
            subtotal,
            delivery_fee,
            total
        ], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    console.error('Error creating order:', err);
                    res.status(500).json({ error: 'Error creating order', details: err.message });
                });
            }

            const orderId = result.insertId;

            // Insert order items
            const insertOrderItems = `INSERT INTO order_items (order_id, product_id, product_name, quantity, price, image) VALUES ?`;
            const orderItemsValues = cart.map(item => [
                orderId,
                item.id,
                item.name,
                item.quantity,
                item.price,
                item.image
            ]);

            db.query(insertOrderItems, [orderItemsValues], (err) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Error adding order items:', err);
                        res.status(500).json({ error: 'Error adding order items', details: err.message });
                    });
                }

                // Update product quantities
                const updateProductQuantities = `UPDATE products SET quantity = quantity - ? WHERE id = ?`;
                const quantityUpdates = cart.map(item => new Promise((resolve, reject) => {
                    db.query(updateProductQuantities, [item.quantity, item.id], (err, result) => {
                        if (err) {
                            reject(err);
                        } else if (result.affectedRows === 0) {
                            reject(new Error(`Product with ID ${item.id} not found`));
                        } else {
                            resolve();
                        }
                    });
                }));

                Promise.all(quantityUpdates)
                    .then(() => {
                        db.commit(err => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error('Error committing transaction:', err);
                                    res.status(500).json({ error: 'Error committing transaction', details: err.message });
                                });
                            }
                            res.status(201).json({ message: 'Order created successfully', orderId });
                        });
                    })
                    .catch(err => {
                        db.rollback(() => {
                            console.error('Error updating product quantities:', err);
                            res.status(500).json({ error: 'Error updating product quantities', details: err.message });
                        });
                    });
            });
        });
    });
});

// Get all orders endpoint
app.get('/orders', (req, res) => {
    const selectOrders = `
        SELECT o.*, oi.product_id, oi.product_name, oi.quantity as item_quantity, oi.price, oi.image
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        ORDER BY o.created_at DESC
    `;
    db.query(selectOrders, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err.message });
        }

        const orders = [];
        const orderMap = new Map();
        results.forEach(row => {
            if (!orderMap.has(row.id)) {
                orderMap.set(row.id, {
                    id: row.id,
                    user_id: row.user_id,
                    customer: {
                        name: `${row.first_name} ${row.last_name}`,
                        email: row.email,
                        phone: row.phone,
                        address: `${row.street}, ${row.city}, ${row.state} ${row.zip_code}`
                    },
                    subtotal: row.subtotal,
                    delivery_fee: row.delivery_fee,
                    total: row.total,
                    payment_method: row.payment_method,
                    payment_details: row.payment_details ? JSON.parse(row.payment_details) : null,
                    status: row.status,
                    created_at: row.created_at,
                    items: []
                });
            }
            if (row.product_id) {
                orderMap.get(row.id).items.push({
                    product_id: row.product_id,
                    product_name: row.product_name,
                    quantity: row.item_quantity,
                    price: row.price,
                    image: row.image
                });
            }
        });
        orders.push(...orderMap.values());
        return res.json(orders);
    });
});

// Get user orders endpoint
app.get('/orders/user/:user_id', (req, res) => {
    const { user_id } = req.params;
    const selectOrders = `
        SELECT o.*, oi.product_id, oi.product_name, oi.quantity as item_quantity, oi.price, oi.image
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
    `;
    db.query(selectOrders, [user_id], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err.message });
        }

        const orders = [];
        const orderMap = new Map();
        results.forEach(row => {
            if (!orderMap.has(row.id)) {
                orderMap.set(row.id, {
                    id: row.id,
                    user_id: row.user_id,
                    customer: {
                        name: `${row.first_name} ${row.last_name}`,
                        email: row.email,
                        phone: row.phone,
                        address: `${row.street}, ${row.city}, ${row.state} ${row.zip_code}`
                    },
                    subtotal: row.subtotal,
                    delivery_fee: row.delivery_fee,
                    total: row.total,
                    payment_method: row.payment_method,
                    payment_details: row.payment_details ? JSON.parse(row.payment_details) : null,
                    status: row.status,
                    created_at: row.created_at,
                    items: []
                });
            }
            if (row.product_id) {
                orderMap.get(row.id).items.push({
                    product_id: row.product_id,
                    product_name: row.product_name,
                    quantity: row.item_quantity,
                    price: row.price,
                    image: row.image
                });
            }
        });
        orders.push(...orderMap.values());
        return res.json(orders);
    });
});

// Update order endpoint
app.put('/orders/:id', (req, res) => {
    const { id } = req.params;
    const { payment_method, payment_details, status } = req.body;
    console.log('Updating order with payment details:', payment_details);
    const updateOrder = `UPDATE orders SET payment_method = ?, payment_details = ?, status = ? WHERE id = ?`;
    db.query(updateOrder, [payment_method, JSON.stringify(payment_details), status, id], (err, result) => {
        if (err) {
            console.error('Error updating order:', err);
            return res.status(500).json({ error: 'Error updating order', details: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        return res.json({ message: 'Order updated successfully' });
    });
});

// PayHere notify endpoint
app.post('/payhere-notify', (req, res) => {
    const { merchant_id, order_id, payment_id, status_code } = req.body;
    console.log('PayHere notification received:', req.body);

    if (status_code === '2') { // 2 indicates a successful payment
        const payment_details = {
            payhere_payment_id: payment_id,
            status_code: status_code,
            card_details: {
                last_four_digits: 'N/A',
                card_type: 'N/A'
            }
        };
        const updateOrder = `UPDATE orders SET payment_method = 'card', payment_details = ?, status = 'Processing' WHERE id = ?`;
        db.query(updateOrder, [JSON.stringify(payment_details), order_id], (err, result) => {
            if (err) {
                console.error('Error updating order with PayHere notification:', err);
                return res.status(500).send('Error processing notification');
            }
            return res.status(200).send('Notification processed');
        });
    } else {
        return res.status(200).send('Notification received but payment not successful');
    }
});

// Test endpoint
app.get('/', (req, res) => {
    return res.json("From Backend Side");
});

app.listen(8081, () => {
    console.log("Server listening on port 8081");
});