# 🛒 Mock E-Commerce Cart | Vibe Commerce Assignment

A full-stack shopping cart app built for the Vibe Commerce hiring task.  
It demonstrates essential e-commerce workflows: product listing, cart management, checkout & receipt generation.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | SQLite (better-sqlite3) |
| API | REST-based |

---

## ✅ Features

✔ Product catalog (5–10 items)  
✔ Add to cart  
✔ Remove from cart  
✔ Cart page with item qty & total  
✔ Mock checkout → receipt stored in DB  
✔ Simple, clean responsive UI  
✔ Persistent data in SQLite

---

## 🧩 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get products |
| GET | /api/cart | Get cart with total |
| POST | /api/cart | Add item {productId, qty} |
| DELETE | /api/cart/:id | Remove item |
| POST | /api/checkout | Create receipt |

---

## 📸 Screenshots

| Home | Cart | Checkout |
|------|------|----------|
| ![Home](frontend/public/screenshots/home.png) | ![Cart](frontend/public/screenshots/cart.png) | ![Checkout](frontend/public/screenshots/checkout.png) |

---

## 🛠️ Local Setup

```bash
# Clone repo
git clone https://github.com/ishagahlot28/mock-ecom-shopping-cart.git
cd mock-ecom-shopping-cart
