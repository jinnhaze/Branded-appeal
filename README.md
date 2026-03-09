# Branded Appeal - Premium Eyewear E-commerce with Virtual Try-On

Welcome to **Branded Appeal**, a cutting-edge e-commerce platform designed for premium eyewear. Developed by **Kashinadh** (Jr. Python Developer), this project combines a robust Django backend with a dynamic React frontend, featuring a state-of-the-art **Virtual Try-On (VTO)** system.

---

## 🌟 Key Features

### 👓 Virtual Try-On (VTO)
- **Real-time Face Tracking:** Uses **MediaPipe** to detect facial landmarks and map eyewear frames to the user's face via webcam.
- **3D Rendering:** Interactive 3D product previews powered by **Three.js** and **React Three Fiber**.
- **Dimension Accuracy:** Supports millimeter-accurate frame mapping (frame width, bridge width, temple length).

### 🛒 E-commerce Flow
- **Product Management:** Categorized eyewear with support for 3D model uploads (.glb/.obj).
- **Shopping Experience:** Integrated Cart and Wishlist systems with real-time updates.
- **Secure Checkout:** 
  - **Atomic Transactions:** Ensures order integrity by wrapping the checkout process in a database transaction.
  - **Payment Simulation:** Includes a built-in payment simulation logic for testing the "Processing" vs "Pending" states.
- **Order Management:** Complete checkout flow with order status tracking (Pending, Shipped, Delivered, Cancelled).
- **User Reviews:** Product rating and review system with user-specific permissions.

### 🛡️ Admin Interface
- **Separated Dashboard:** A dedicated, secure management interface for staff.
- **Isolated UI:** Independent navigation and layouts for administrative tasks (Order management, User oversight).

---

## 🛠️ Technology Stack

### Backend (Python/Django)
- **Framework:** Django 5 with Django Rest Framework (DRF).
- **Authentication:** Custom User model with extended profile fields.
- **API Design:** RESTful ViewSets for products, orders, cart, and reviews.
- **Database:** SQLite (Relational data management).

### Frontend (JavaScript/React)
- **Framework:** React + Vite (Optimized for speed).
- **Graphics:** Three.js, React Three Fiber, React Three Drei.
- **AI/Vision:** MediaPipe Face Landmarker.
- **Styling:** Tailwind CSS (Modern, responsive UI).
- **Routing:** React Router DOM (Separate client and admin flows).

---

## 🏗️ Project Structure

### Backend (`/backend`)
- `users/`: Handles custom authentication and profile management.
- `products/`: Manages eyewear inventory, dimensions, and 3D assets.
- `orders/`: Processes transactions and order lifecycles.
- `shop/`: Core logic for Cart, Wishlist, and Reviews.

### Frontend (`/frontend`)
- `src/pages/VirtualTryOn.jsx`: The core implementation of the AR try-on logic.
- `src/components/AdminLayout.jsx`: Dedicated layout for the separated admin area.
- `src/pages/Shop.jsx`: Dynamic product listing and filtering.

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies (if requirements.txt exists) or install core packages:
   ```bash
   pip install django djangorestframework django-cors-headers pillow
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Start the server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 👨‍💻 Developed By
**Kashinadh**  
*Jr. Python Developer*

---
*This documentation was generated to reflect the current implementation state of the Branded Appeal project.*
