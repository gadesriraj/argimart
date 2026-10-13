# HarvestHub – Smart Agriculture Marketplace

**HarvestHub** is a production-grade full-stack digital agriculture marketplace that connects farmers, customers, and agricultural input sellers into a transparent, fair-trade digital ecosystem.

Built with **React.js + Vite**, **Java Spring Boot**, **Spring Data JPA**, **Spring Security (JWT)**, **MySQL**, and **Google Gemini AI**.

---

## 🌟 Key Highlights & Modules

### 1. 🌾 Farmer Module
- **Live Inventory Management:** List seeds, organic fertilizers, pesticides, vegetables, grains, and farm equipment with high-res photography, stock limits, and location tags.
- **Stock & Price Controls:** Edit pricing, update available stock, and pause/activate listings.
- **Order Dispatch Pipeline:** View real-time orders containing the farmer's crops, track customer delivery details, and update dispatch status (`PLACED` → `CONFIRMED` → `PROCESSING` → `SHIPPED` → `DELIVERED`).
- **Revenue Analytics:** Instant overview of completed transactions and net farm payouts.

### 2. 🛒 Customer & Buyer Module
- **Smart Catalog Discovery:** Search across certified varieties, filter by agricultural category, price bracket, and farming region/hub.
- **Atomic Shopping Cart:** Real-time stock validation, automated GST and shipping calculations, and inventory reservation.
- **Simulated & COD Payments:** Support for Cash on Delivery (COD), Simulated UPI (PhonePe/GPay), and Net Banking.
- **Visual Order Tracking:** End-to-end 5-step milestone tracking with self-cancellation option before shipment.
- **Verified Reviews:** Submit star ratings and crop yield feedback.

### 3. 🛡️ Administrator Oversight
- **Role-Based Access Control (RBAC):** Dedicated console with role enforcement on backend endpoints.
- **User Verification:** Manage farmer and buyer accounts; activate/deactivate accounts.
- **Listing Moderation:** Audit listings and remove inappropriate products.
- **Platform Analytics:** Total GMV, category distribution charts, and environmental savings metrics.

### 4. 🤖 AI Agriculture Assistant (Agronomist)
- Powered by **Gemini AI** (`gemini-3.8-flash`) via secure backend proxy (API key never exposed to browser).
- Answers questions on soil preparation, NPK fertilizer dosing, precision drip vs sprinkler irrigation, seed germination testing, and bio-pesticides.
- Recommends verified products directly from the HarvestHub marketplace catalog.

---

## 🏗️ Project Architecture

```
HarvestHub/
|-- src/                     # React + Vite Frontend
|   |-- components/          # Reusable Navbar, Footer, ProductCard, SearchBar, CategoryFilter
|   |-- context/             # AuthContext, ProductContext, CartContext, OrderContext, FeedbackContext
|   |-- pages/               # Home, Marketplace, ProductDetails, Dashboards, Cart, Orders, AI
|   |-- services/            # Axios API clients (auth, product, cart, order, admin, ai)
|   |-- types/               # TypeScript models & DTOs
|-- server.ts                # Express server + Vite middlewares + Gemini AI backend proxy
|-- backend/                 # Complete Spring Boot 3 Java Backend
|   |-- pom.xml              # Maven dependencies (Spring Web, JPA, Security, MySQL, JJWT)
|   |-- src/main/java/com/harvesthub/
|   |   |-- controller/      # REST API Controllers (Auth, Product, Order, Admin, AI)
|   |   |-- entity/          # JPA Entities (User, Product, Cart, Order, OrderItem, Feedback)
|   |   |-- repository/      # Spring Data JPA Repositories
|   |   |-- security/        # JWT Authentication Filter, SecurityConfig, UserDetails
|   |   |-- service/         # Business Logic & Transactional Inventory Services
|   |-- src/main/resources/  # application.properties
|-- database/
|   |-- schema.sql           # MySQL DDL table creation script
|   |-- sample-data.sql      # Seed demonstration data
|-- README.md
```

---

## 🚀 Quick Start in VS Code

### 1. Prerequisites
- **Node.js** (v18 or v20+) and **npm**
- **Java JDK 17+**
- **Apache Maven 3.8+**
- **MySQL 8.0+**

---

### 2. Running the Live Application (Integrated Node / Vite Server)
In your terminal:
```bash
# Install dependencies
npm install

# Start the full-stack dev server (Vite + Express + AI proxy)
npm run dev
```
Open your browser at: **`http://localhost:3000`**

---

### 3. Running the Spring Boot Backend (Java + MySQL)

#### Step A: Setup MySQL Database
Open MySQL Workbench or MySQL terminal:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/sample-data.sql
```

#### Step B: Configure Backend Properties
Review `backend/src/main/resources/application.properties` and provide your MySQL credentials:
```properties
spring.datasource.username=root
spring.datasource.password=your_mysql_password
gemini.api.key=YOUR_GEMINI_API_KEY
```

#### Step C: Build & Run with Maven
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
The REST API will start at: **`http://localhost:8080/`**

---

## 🔑 Demonstration Accounts

| Role | Email | Password | Pre-configured Data |
|---|---|---|---|
| **Farmer** | `ramesh@greenfield.com` | `Password@123` | Active listings, incoming orders, sales stats |
| **Customer** | `priya@gmail.com` | `Password@123` | Active orders, order tracking, cart items |
| **Admin** | `admin@harvesthub.com` | `Password@123` | Full user & listing moderation access |

*Note: For evaluator convenience, 1-click role switching is also available on the top bar.*

---

## 📡 REST API Endpoints

### Authentication
- `POST /api/auth/register` - Create new Farmer or Customer account
- `POST /api/auth/login` - Authenticate and receive JWT Bearer token
- `GET /api/auth/me` - Fetch authenticated user profile

### Products
- `GET /api/products` - Search and filter products (category, minPrice, maxPrice, query)
- `GET /api/products/{id}` - Fetch detailed product metadata
- `POST /api/products` - Create listing (Farmer / Admin role required)
- `PUT /api/products/{id}` - Update listing details
- `DELETE /api/products/{id}` - Delete listing

### Cart & Orders
- `GET /api/cart` - Retrieve active shopping cart
- `POST /api/cart/items` - Add item to cart with stock validation
- `POST /api/orders` - Place order from cart with atomic inventory deduction
- `GET /api/orders/my` - Customer order history
- `PATCH /api/orders/{id}/status` - Update order lifecycle status

### AI Agronomist
- `POST /api/ai/ask` - Secure server-side proxy query to Gemini model
- `GET /api/ai/history` - Retrieve agronomic Q&A history

---

## 🛡️ Security Architecture
- Passwords hashed using **BCrypt** (strength 12).
- **Stateless JWT** token authorization with `Bearer` header.
- **Zero Public Admin Registration:** Administrative privileges cannot be self-assigned during registration.
- **Inventory Safety:** Transactional validation prevents checkout exceeding stock limits.
