# 🛒 Ecommerce Website – Full Stack (Java + React)

A modern full-stack e-commerce web application built with **Spring Boot 3** and **React 18**, using **MongoDB Atlas** as the database and **JWT** for authentication.

<p align="center">Built with ❤️ by Dinesh Manore</p>

---

## ✨ Features

| User Features | Admin Features |
|--------------|----------------|
| 🔐 JWT Authentication | 📊 Dashboard & Analytics |
| 🛍️ Product Browsing & Search | 📦 Product Management |
| 🛒 Shopping Cart | 📂 Category Management |
| 📦 Order Tracking | 📋 Order Management |
| ⭐ Reviews & Ratings | 👥 User Management |
| ❤️ Wishlist | |

---

## 🛠️ Tech Stack

| Backend | Frontend | Database |
|---------|----------|----------|
| Java 21 | React 18 | MongoDB Atlas |
| Spring Boot 3.2 | Vite 5 | |
| Spring Security (JWT) | Tailwind CSS | |
| Spring Data MongoDB | Zustand | |
| Maven | React Router | |

---

## 🌐 Live Deployment

| Layer    | Platform       | URL |
|----------|----------------|-----|
| Frontend | Vercel         | *https://smartcartdm.vercel.app* |
| Backend  | Render         | *https://ecommerce-web-gmwr.onrender.com* |
| Database | MongoDB Atlas  | Cloud hosted |

---

## 📁 Project Structure

```
Ecommerce-Website-Java-main/
│   README.md
│
├── backend/
│   │   .env
│   │   Dockerfile
│   │   mvnw / mvnw.cmd
│   │   pom.xml
│   │
│   └── src/main/
│       ├── java/com/ecommerce/
│       │   │   EcommerceApplication.java
│       │   ├── config/
│       │   │       MongoConfig.java
│       │   │       SecurityConfig.java
│       │   ├── controller/
│       │   │       AdminController.java
│       │   │       AuthController.java
│       │   │       CartController.java
│       │   │       CategoryController.java
│       │   │       OrderController.java
│       │   │       PaymentController.java
│       │   │       ProductController.java
│       │   │       ReviewController.java
│       │   │       UserController.java
│       │   │       WishlistController.java
│       │   ├── dto/
│       │   │   ├── request/
│       │   │   │       CartItemRequest.java
│       │   │   │       CategoryRequest.java
│       │   │   │       LoginRequest.java
│       │   │   │       OrderRequest.java
│       │   │   │       ProductRequest.java
│       │   │   │       RegisterRequest.java
│       │   │   │       ReviewRequest.java
│       │   │   │       UpdateProfileRequest.java
│       │   │   └── response/
│       │   │           ApiResponse.java
│       │   │           AuthResponse.java
│       │   │           CartResponse.java
│       │   │           CategoryResponse.java
│       │   │           DashboardStatsResponse.java
│       │   │           OrderResponse.java
│       │   │           PageResponse.java
│       │   │           ProductResponse.java
│       │   │           ReviewResponse.java
│       │   │           UserResponse.java
│       │   ├── exception/
│       │   │       BadRequestException.java
│       │   │       GlobalExceptionHandler.java
│       │   │       ResourceNotFoundException.java
│       │   ├── model/
│       │   │       Cart.java
│       │   │       Category.java
│       │   │       Order.java
│       │   │       Payment.java
│       │   │       Product.java
│       │   │       Review.java
│       │   │       User.java
│       │   │       Wishlist.java
│       │   ├── repository/
│       │   │       CartRepository.java
│       │   │       CategoryRepository.java
│       │   │       OrderRepository.java
│       │   │       PaymentRepository.java
│       │   │       ProductRepository.java
│       │   │       ReviewRepository.java
│       │   │       UserRepository.java
│       │   │       WishlistRepository.java
│       │   ├── security/
│       │   │       CustomUserDetailsService.java
│       │   │       JwtAuthenticationFilter.java
│       │   │       JwtTokenProvider.java
│       │   └── service/
│       │           AuthService.java
│       │           CartService.java
│       │           CategoryService.java
│       │           DashboardService.java
│       │           OrderService.java
│       │           PaymentService.java
│       │           ProductService.java
│       │           ReviewService.java
│       │           UserService.java
│       │           WishlistService.java
│       └── resources/
│               application.yml
│
└── frontend/
    │   .env
    │   index.html
    │   package.json
    │   tailwind.config.js
    │   vite.config.js
    │   vercel.json
    │
    └── src/
        │   App.jsx
        │   main.jsx
        │   index.css
        ├── components/
        │   ├── auth/
        │   │       AdminRoute.jsx
        │   │       ProtectedRoute.jsx
        │   ├── category/
        │   │       CategoryGrid.jsx
        │   ├── layout/
        │   │       Footer.jsx
        │   │       Navbar.jsx
        │   ├── product/
        │   │       ProductCard.jsx
        │   └── ui/
        │           EmptyState.jsx
        │           LoadingSpinner.jsx
        │           Modal.jsx
        │           Skeleton.jsx
        ├── pages/
        │   │   Cart.jsx
        │   │   Checkout.jsx
        │   │   Contact.jsx
        │   │   FAQ.jsx
        │   │   Home.jsx
        │   │   Login.jsx
        │   │   OrderDetails.jsx
        │   │   Orders.jsx
        │   │   ProductDetails.jsx
        │   │   Products.jsx
        │   │   Profile.jsx
        │   │   Register.jsx
        │   │   Returns.jsx
        │   │   Shipping.jsx
        │   │   Wishlist.jsx
        │   └── admin/
        │           Categories.jsx
        │           Dashboard.jsx
        │           OrderDetails.jsx
        │           Orders.jsx
        │           ProductForm.jsx
        │           Products.jsx
        │           Users.jsx
        ├── services/
        │       api.js
        └── store/
                authStore.js
                cartStore.js
                wishlistStore.js
```

---

## 🚀 Local Setup

### Prerequisites
- Java 21
- Node.js 18+
- MongoDB Atlas account

### Backend

```bash
cd backend
# Configure .env file (see below)
./mvnw spring-boot:run        # Mac/Linux
.\mvnw.cmd spring-boot:run    # Windows
```

> Server runs at `http://localhost:8080`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

> App runs at `http://localhost:5173`

---

## ⚙️ Environment Variables

**Backend** (`backend/.env`)
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000
```

**Frontend** (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8080/api
```

For production, change `VITE_API_URL` to your Render backend URL:
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## ☁️ Deployment Guide

### 🎨 Frontend → Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Set **Root Directory** to `frontend`
4. Add environment variable:
   ```
   VITE_API_URL = https://your-backend.onrender.com/api
   ```
5. Click **Deploy** ✅

---

### ⚙️ Backend → Render

1. Go to [render.com](https://render.com) → **New Web Service** → Connect your repo
2. Set **Root Directory** to `backend`
3. Set **Build Command**:
   ```
   ./mvnw clean package -DskipTests
   ```
4. Set **Start Command**:
   ```
   java -jar target/*.jar
   ```
5. Add environment variables:
   ```
   MONGODB_URI = mongodb+srv://...
   JWT_SECRET  = your-secret-key
   ```
6. Click **Deploy** ✅

---

### 🍃 Database → MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist all IPs: `0.0.0.0/0` (for Render)
5. Copy the connection string and paste into `MONGODB_URI`

---

## 📡 API Endpoints

| Method | Endpoint                | Description              |
|--------|-------------------------|--------------------------|
| POST   | `/api/auth/register`    | Register new user        |
| POST   | `/api/auth/login`       | Login & get JWT token    |
| GET    | `/api/products`         | Get all products         |
| POST   | `/api/products`         | Create product (Admin)   |
| GET    | `/api/cart`             | Get cart items           |
| POST   | `/api/cart`             | Add item to cart         |
| POST   | `/api/orders`           | Place an order           |
| GET    | `/api/orders`           | Get user orders          |
| GET    | `/api/wishlist`         | Get wishlist             |
| GET    | `/api/admin/dashboard`  | Admin dashboard stats    |

> 🔒 Protected routes require: `Authorization: Bearer <your_jwt_token>`

---

## 👥 Team

| Name          | Role                  | Links |
|---------------|-----------------------|-------|
| Dinesh Manore | Full Stack Developer  | [GitHub](https://github.com/DineshManore) · [Email](mailto:manoredinesh66@gmail.com) |

---

## 📄 License

<<<<<<< HEAD
MIT License — feel free to use and modify this project.
=======
MIT License — feel free to use and modify this project.
>>>>>>> 6acc8df (Add health endpoint)
