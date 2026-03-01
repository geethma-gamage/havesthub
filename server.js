const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

/* =====================================================
   DATABASE CONNECTION
===================================================== */
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'signup'
});

db.connect(err => {
    if (err) console.error('DB Connection Failed:', err);
    else console.log(' MySQL Connected');
});

/* =====================================================
   ADMIN SIGNUP & LOGIN
===================================================== */
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ message: 'All fields required' });

    const hashed = await bcrypt.hash(password, 10);

    db.query(
        "INSERT INTO login (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashed],
        err => {
            if (err) return res.status(500).json({ message: 'Signup failed' });
            res.json({ message: 'Signup successful' });
        }
    );
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM login WHERE email = ?", [email], async (err, rows) => {
        if (err || rows.length === 0)
            return res.status(401).json({ message: 'Invalid credentials' });

        const admin = rows[0];
        const match = await bcrypt.compare(password, admin.password);
        if (!match)
            return res.status(401).json({ message: 'Invalid credentials' });

        res.json({ message: 'Login successful', admin });
    });
});

/* =====================================================
   CUSTOMER REGISTER & LOGIN
===================================================== */
app.post('/customers/register', async (req, res) => {
    const { full_name, email, password } = req.body;
    if (!full_name || !email || !password)
        return res.status(400).json({ message: 'All fields required' });

    const hashed = await bcrypt.hash(password, 10);

    db.query(
        "INSERT INTO customers (full_name, email, password) VALUES (?, ?, ?)",
        [full_name, email, hashed],
        err => {
            if (err) return res.status(500).json({ message: 'Register failed' });
            res.json({ message: 'Customer registered' });
        }
    );
});

app.post('/customers/login', (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM customers WHERE email = ?", [email], async (err, rows) => {
        if (err || rows.length === 0)
            return res.status(401).json({ message: 'Invalid credentials' });

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(401).json({ message: 'Invalid credentials' });

        res.json({ message: 'Login successful', customer: user });
    });
});

/* =====================================================
   FARMER REGISTER & LOGIN
===================================================== */
app.post('/farmers/register', async (req, res) => {
    const { full_name, email, password, farm_name, location, contact_number } = req.body;

    if (!full_name || !email || !password || !farm_name || !location || !contact_number)
        return res.status(400).json({ message: 'All fields required' });

    const hashed = await bcrypt.hash(password, 10);

    db.query(
        `INSERT INTO farmers 
        (full_name, email, password, farm_name, location, contact_number)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [full_name, email, hashed, farm_name, location, contact_number],
        err => {
            if (err) return res.status(500).json({ message: 'Registration failed' });
            res.json({ message: 'Farmer registered' });
        }
    );
});

app.post('/farmers/login', (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM farmers WHERE email = ?", [email], async (err, rows) => {
        if (err || rows.length === 0)
            return res.status(401).json({ message: 'Invalid credentials' });

        const farmer = rows[0];
        const match = await bcrypt.compare(password, farmer.password);
        if (!match)
            return res.status(401).json({ message: 'Invalid credentials' });

        res.json({
            message: 'Login successful',
            farmer: {
                id: farmer.id,
                full_name: farmer.full_name,
                email: farmer.email,
                farm_name: farmer.farm_name,
                location: farmer.location,
                contact_number: farmer.contact_number
            }
        });
    });
});

/* =====================================================
   PRODUCTS
===================================================== */
app.post('/add-product', (req, res) => {
    const { name, quantity, price_per_kg, location, farmer_name, farmer_contact, farm_name } = req.body;

    if (!name || !quantity || !price_per_kg || !location || !farmer_name || !farmer_contact || !farm_name)
        return res.status(400).json({ message: 'All fields required' });

    // Insert product
    const productSql = `
        INSERT INTO product_items
        (name, quantity, price_per_kg, location, farmer_name, farmer_contact, farm_name, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW())
    `;

    db.query(productSql, [name, quantity, price_per_kg, location, farmer_name, farmer_contact, farm_name], (err) => {
        if (err) return res.status(500).json({ message: 'Add product failed' });

        // Insert notification for admin
        const notifySql = `
            INSERT INTO notifications (message, type)
            VALUES (?, ?)
        `;
        const notifyMessage = `New Product Added by ${farmer_name}`;

        db.query(notifySql, [notifyMessage, 'product'], (err2) => {
            if (err2) console.log('Notification Error:', err2);
        });

        res.json({ message: 'Product added successfully' });
    });
});

app.put('/products/update/:id', (req, res) => {
    const { name, quantity, price_per_kg, location } = req.body;

    const sql = `
        UPDATE product_items
        SET name = ?, quantity = ?, price_per_kg = ?, location = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, quantity, price_per_kg, location, req.params.id],
        (err, result) => {
            if (err) {
                console.error('Update Error:', err);
                return res.status(500).json({ message: 'Update failed' });
            }
            res.json({ message: 'Product updated successfully' });
        }
    );
});

app.put('/products/toggle/:id', (req, res) => {
    const { is_active } = req.body;

    const sql = `
        UPDATE product_items
        SET is_active = ?
        WHERE id = ?
    `;

    db.query(sql, [is_active, req.params.id], (err, result) => {
        if (err) {
            console.error('Toggle Error:', err);
            return res.status(500).json({ message: 'Toggle failed' });
        }
        res.json({ message: 'Product status updated' });
    });
});
/* =====================================================
   GET NOTIFICATIONS (ADMIN)
===================================================== */
app.get('/notifications', (req, res) => {
    const sql = `
        SELECT * FROM notifications
        ORDER BY created_at DESC
    `;
    db.query(sql, (err, rows) => {
        if (err) {
            console.error('Notification Fetch Error:', err);
            return res.status(500).json({ message: 'Fetch failed' });
        }
        res.json(rows);
    });
});

/* =====================================================
   MARK NOTIFICATION AS READ
===================================================== */
app.post('/notifications/read/:id', (req, res) => {
    db.query(
        "UPDATE notifications SET is_read = 1 WHERE id = ?",
        [req.params.id],
        err => {
            if (err) return res.status(500).json({ message: 'Update failed' });
            res.json({ message: 'Notification marked as read' });
        }
    );
});

app.get('/products', (req, res) => {
    db.query("SELECT * FROM product_items WHERE is_active = 1 ORDER BY created_at DESC",
        (err, rows) => {
            if (err) return res.status(500).json({ message: 'Fetch failed' });
            res.json(rows);
        }
    );
});

/* =====================================================
   PLACE ORDER + STOCK UPDATE
===================================================== */
app.post('/orders', (req, res) => {
    const { product_id, quantity, customer_name, customer_email } = req.body;

    if (!product_id || !quantity || !customer_name || !customer_email) {
        return res.status(400).json({ message: 'All fields required' });
    }

    db.query("SELECT * FROM product_items WHERE id = ?", [product_id], (err, rows) => {

        if (err || rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const product = rows[0];

        if (quantity > product.quantity) {
            return res.status(400).json({ message: 'Not enough stock' });
        }

        const total_price = quantity * product.price_per_kg;

        const insertSql = `
            INSERT INTO orders
            (product_id, product_name, quantity, price_per_kg, total_price,
             customer_name, customer_email, farmer_name, farmer_contact,
             farm_name, location)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            insertSql,
            [
                product.id,
                product.name,
                quantity,
                product.price_per_kg,
                total_price,
                customer_name,
                customer_email,
                product.farmer_name,
                product.farmer_contact,
                product.farm_name,
                product.location
            ],
            (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Order failed' });
                }

                // Reduce Stock
                db.query(
                    "UPDATE product_items SET quantity = quantity - ? WHERE id = ?",
                    [quantity, product.id]
                );

                res.json({ message: 'Order placed successfully' });
            }
        );
    });
});

/* =====================================================
   GET ORDERS (ADMIN)
===================================================== */
app.get('/api/orders', (req, res) => {
    db.query("SELECT * FROM orders ORDER BY created_at DESC", (err, rows) => {
        if (err) return res.status(500).json({ message: 'Fetch failed' });
        res.json(rows);
    });
});

/* =====================================================
   GET ORDERS BY FARMER
===================================================== */
app.get('/orders/farmer/:farmerName', (req, res) => {
    db.query(
        "SELECT * FROM orders WHERE farmer_name = ? ORDER BY created_at DESC",
        [req.params.farmerName],
        (err, rows) => {
            if (err) return res.status(500).json({ message: 'Fetch failed' });
            res.json(rows);
        }
    );
});


/* =====================================================
   GET ORDERS BY CUSTOMER EMAIL (NEW - FOR CUSTOMER DASHBOARD)
===================================================== */
app.get('/orders/customer/:email', (req, res) => {
    const { email } = req.params;
    db.query(
        "SELECT o.*, p.name as product_name, p.price_per_kg FROM orders o " +
        "LEFT JOIN product_items p ON o.product_id = p.id " +
        "WHERE o.customer_email = ? ORDER BY o.created_at DESC",
        [email],
        (err, rows) => {
            if (err) return res.status(500).json({ message: 'Fetch failed' });
            res.json(rows);
        }
    );
});


/* =====================================================
   SUPPORT MESSAGES
===================================================== */

// Save Support Message
app.post('/support', (req, res) => {
    const { customer_name, customer_email, message } = req.body;

    if (!customer_name || !customer_email || !message) {
        return res.status(400).json({ message: 'All fields required' });
    }

    const status = 'Pending'; // default status

    const sql = `
        INSERT INTO support_messages
        (customer_name, customer_email, message, status, created_at)
        VALUES (?, ?, ?, ?, NOW())
    `;

    db.query(sql, [customer_name, customer_email, message, status], (err) => {
        if (err) {
            console.error('DB Insert Error:', err);
            return res.status(500).json({ message: 'Failed to send message' });
        }
        res.json({ message: 'Support message sent successfully' });
    });
});


// Get All Support Messages (Admin)
app.get('/support', (req, res) => {
    const sql = `
        SELECT * FROM support_messages 
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, rows) => {
        if (err) {
            console.error('Fetch Error:', err);
            return res.status(500).json({ message: 'Fetch failed' });
        }
        res.json(rows);
    });
});

/* =====================================================
   REPLY TO SUPPORT MESSAGE (ADMIN)
===================================================== */
app.post('/support/reply/:id', (req, res) => {
    const { id } = req.params;
    const { reply } = req.body;

    if (!reply || !id) return res.status(400).json({ message: 'Reply required' });

    // Update message with reply and status
    const sql = `
        UPDATE support_messages
        SET reply = ?, status = 'Replied'
        WHERE id = ?
    `;

    db.query(sql, [reply, id], (err, result) => {
        if (err) {
            console.error('Reply Error:', err);
            return res.status(500).json({ message: 'Failed to send reply' });
        }
        res.json({ message: 'Reply sent successfully' });
    });
});

// ✅ POST route (for submitting reviews) - CORRECT
app.post('/reviews', (req, res) => {
  const { farmer_name, customer_name, rating, comment } = req.body;

  if (!farmer_name || !customer_name || !rating || !comment) {
    return res.status(400).json({ message: "All fields required" });
  }

  const ratingInt = parseInt(rating);
  if (isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5) {
    return res.status(400).json({ message: "Rating must be 1-5" });
  }

  const sql = `
    INSERT INTO farmer_reviews (farmer_name, customer_name, rating, comment, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(sql, [farmer_name, customer_name, ratingInt, comment], (err, result) => {
    if (err) {
      console.error('Review Insert Error:', err);
      return res.status(500).json({ message: "Review failed - " + err.message });
    }
    res.json({ message: "Review submitted successfully" });
  });
});

// ✅ GET route (for fetching reviews) - CORRECT
app.get('/reviews', (req, res) => {
  const sql = `SELECT * FROM farmer_reviews ORDER BY created_at DESC`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('Fetch Reviews Error:', err);
      return res.status(500).json({ message: 'Fetch reviews failed' });
    }
    res.json(rows);
  });
});
/* =====================================================
   PAYMENTS - CORRECT VERSION
===================================================== */

app.post('/payments', (req, res) => {
    const { order_id, customer_name, customer_email, amount, payment_method } = req.body;

    if (!customer_name || !customer_email || !amount || !payment_method) {
        return res.status(400).json({ message: 'All payment fields required' });
    }

    // Generate Transaction ID
    const transaction_id = 'TXN' + Date.now();

    // Step 1 - Insert as Pending
    const insertSql = `
        INSERT INTO payments
        (order_id, customer_name, customer_email, amount, payment_method, transaction_id, status)
        VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `;

    db.query(
        insertSql,
        [order_id || null, customer_name, customer_email, amount, payment_method, transaction_id],
        (err, result) => {

            if (err) {
                console.error('Payment Insert Error:', err);
                return res.status(500).json({ message: 'Payment failed' });
            }

            // Step 2 - Simulate Payment Success
            const updatePaymentSql = `
                UPDATE payments SET status = 'success'
                WHERE id = ?
            `;

            db.query(updatePaymentSql, [result.insertId]);

            // Step 3 - Update Order Status if order_id exists
            if (order_id) {
                db.query(
                    `UPDATE orders SET payment_status = 'Paid' WHERE id = ?`,
                    [order_id]
                );
            }

            res.json({
                message: 'Payment successful 🎉',
                transaction_id: transaction_id
            });
        }
    );
});


app.get('/payments', (req, res) => {
    const sql = "SELECT * FROM payments ORDER BY created_at DESC";

    db.query(sql, (err, rows) => {
        if (err) {
            console.error('Fetch Payments Error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(rows);
    });
});



/* =====================================================
   START SERVER
===================================================== */
app.listen(8081, () =>
    console.log(' Server running on http://localhost:8081')
);