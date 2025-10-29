const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_FILE = path.join(__dirname, 'data.sqlite');
const initDB = !fs.existsSync(DB_FILE);
const db = new Database(DB_FILE);

if (initDB) {
  // products table
  db.exec(`
    CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL, image TEXT);
    CREATE TABLE cart (id INTEGER PRIMARY KEY, productId INTEGER, qty INTEGER);
    CREATE TABLE receipts (id INTEGER PRIMARY KEY, name TEXT, email TEXT, total REAL, timestamp TEXT);
  `);
  const insert = db.prepare('INSERT INTO products (name, price, image) VALUES (?, ?, ?)');
  insert.run('Phone X', 24999, '/products/prod1.svg');
  insert.run('Headphones Z', 5999, '/products/prod2.svg');
  insert.run('Smartwatch', 8999, '/products/prod3.svg');
  insert.run('Speaker Pro', 3999, '/products/prod4.svg');
  insert.run('Gaming Mouse', 3499, '/products/prod5.svg');
  insert.run('Mechanical KB', 7499, '/products/prod6.svg');
}

const app = express();
app.use(cors());
app.use(express.json());

// GET /api/products
app.get('/api/products', (req, res) => {
  const rows = db.prepare('SELECT id, name, price, image FROM products').all();
  res.json(rows);
});

// GET /api/cart
app.get('/api/cart', (req, res) => {
  const sql = `
    SELECT c.id, c.productId, c.qty,
           p.name AS name, p.price AS price, p.image AS image
    FROM cart c
    JOIN products p ON p.id = c.productId
  `;
  const items = db.prepare(sql).all();
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  res.json({ items, total });
});

// POST /api/cart
app.post('/api/cart', (req, res) => {
  const { productId, qty } = req.body;
  if (!productId || !qty) {
    return res.status(400).json({ error: 'productId and qty required' });
  }

  const existing = db.prepare('SELECT id, qty FROM cart WHERE productId = ?').get(productId);
  if (existing) {
    db.prepare('UPDATE cart SET qty = qty + ? WHERE id = ?').run(qty, existing.id);
    return res.json({ updated: true });
  }

  const info = db.prepare('INSERT INTO cart (productId, qty) VALUES (?, ?)').run(productId, qty);
  res.status(201).json({ id: info.lastInsertRowid });
});

// DELETE /api/cart/:id
app.delete('/api/cart/:id', (req, res) => {
  db.prepare('DELETE FROM cart WHERE id = ?').run(req.params.id);
  res.json({ deleted: req.params.id });
});

// POST /api/checkout
app.post('/api/checkout', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'name and email required' });
  }

  const items = db.prepare(`
    SELECT c.qty, p.price
    FROM cart c
    JOIN products p ON p.id = c.productId
  `).all();

  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const timestamp = new Date().toISOString();

  const info = db.prepare('INSERT INTO receipts (name, email, total, timestamp) VALUES (?, ?, ?, ?)')
    .run(name, email, total, timestamp);

  db.prepare('DELETE FROM cart').run(); // Clear cart

  res.json({ receipt: { id: info.lastInsertRowid, name, email, total, timestamp } });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Backend (SQLite) running on http://localhost:' + PORT);
});
