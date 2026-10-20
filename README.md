# ReOwnIX

A full-stack secondhand marketplace where users can list pre-owned products, make offers, run live auctions with real-time bidding, chat with sellers, and leave reviews.

---

## Tech Stack

### Backend

| Layer | Technology |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3.4.1 |
| Security | Spring Security + JWT (JJWT 0.12.6) |
| Database | PostgreSQL |
| ORM | Spring Data JPA / Hibernate |
| Real-time | Spring WebSocket + STOMP |
| Image Storage | Cloudinary |
| API Docs | SpringDoc OpenAPI (Swagger UI) |
| Build | Maven |
| Other | Lombok, ModelMapper, Spring Cloud 2024.0.0 |

### Frontend

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 8 |
| UI Library | Material UI (MUI) 9 |
| Routing | React Router 7 |
| HTTP Client | Axios |
| Forms | React Hook Form + Yup |
| Animations | Framer Motion |
| Charts | Recharts |
| WebSocket | STOMP.js + SockJS |
| Icons | Lucide React, MUI Icons |
| Other | react-dropzone, react-hot-toast, date-fns |

---

## Features

**Products** — Full CRUD with category management, image uploads via Cloudinary, keyword search, and advanced filtering (category, brand, condition, listing type, price range). Pagination and sorting included.

**Auctions** — Create timed auctions linked to products. Bidding via REST and real-time WebSocket channels. Bid validation (minimum increment, no self-bidding), auction scheduling/expiry, event broadcasting, and a live auction room UI.

**Offers** — Make price offers on products. Sellers can accept, reject, or counter. Full offer status lifecycle tracking.

**Chat** — One-on-one messaging between buyers and sellers. REST API for history, WebSocket for real-time delivery.

**Reviews** — Ratings and written reviews for sellers with average rating calculation.

**Wishlist** — Save and manage favorite products.

**Auth** — Registration, login, JWT-based authentication, and role-based access control (`USER`, `ADMIN`).

**Admin Dashboard** — Manage users, products, auctions, and categories. Includes data tables and usage charts.

---

## API Endpoints

Base URL: `http://localhost:8080`

<details>
<summary><strong>Auth</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/users/profile` | Get current user profile |

</details>

<details>
<summary><strong>Products</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/products` | Create a product listing |
| GET | `/api/products` | List all products (paginated, filterable) |
| GET | `/api/products/{id}` | Get product details |
| GET | `/api/products/search?keyword=` | Search products |
| GET | `/api/products/my-products` | Get current user's products |
| PUT | `/api/products/{id}` | Update a product |
| DELETE | `/api/products/{id}` | Delete a product |

</details>

<details>
<summary><strong>Product Images</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/products/{id}/images` | Upload image |
| DELETE | `/api/products/images/{imageId}` | Delete image |

</details>

<details>
<summary><strong>Categories</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/categories` | Create category |
| GET | `/api/categories` | List all categories |
| PUT | `/api/categories/{id}` | Update category |
| DELETE | `/api/categories/{id}` | Delete category |

</details>

<details>
<summary><strong>Auctions</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auctions` | Create an auction |
| GET | `/api/auctions` | List active auctions |
| GET | `/api/auctions/{id}` | Get auction details |
| GET | `/api/auctions/product/{productId}` | Get auction by product |
| PUT | `/api/auctions/{id}` | Update auction |
| DELETE | `/api/auctions/{id}` | Cancel auction |
| POST | `/api/auctions/{id}/bids` | Place a bid |
| GET | `/api/auctions/{id}/bids` | Get bid history |
| GET | `/api/auctions/my-bids` | Get current user's bids |

</details>

<details>
<summary><strong>Offers</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/offers` | Make an offer |
| GET | `/api/offers` | List offers |
| PUT | `/api/offers/{id}` | Update offer status |

</details>

<details>
<summary><strong>Chat</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat/conversations` | Start a conversation |
| GET | `/api/chat/conversations` | List conversations |
| POST | `/api/chat/messages` | Send a message |
| GET | `/api/chat/messages/{conversationId}` | Get message history |

</details>

<details>
<summary><strong>Reviews</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/reviews` | Create a review |
| GET | `/api/reviews/seller/{sellerId}` | Get seller reviews |
| PUT | `/api/reviews/{id}` | Update review |
| DELETE | `/api/reviews/{id}` | Delete review |

</details>

<details>
<summary><strong>Wishlist</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/wishlist/{productId}` | Add to wishlist |
| GET | `/api/wishlist` | Get wishlist |
| DELETE | `/api/wishlist/{productId}` | Remove from wishlist |

</details>

<details>
<summary><strong>WebSocket (Auction Real-time)</strong></summary>

| Destination | Description |
|---|---|
| `/topic/auction/{id}` | Subscribe to live auction updates |
| `/app/auction/{id}/bid` | Send a bid via WebSocket |

</details>

Full interactive API documentation is available at `/swagger-ui.html` when the server is running.

---

## Project Structure

```
ReOwnIX/
├── src/main/java/com/reownix/       # Spring Boot backend
│   ├── AppApplication.java
│   ├── admin/                        # Admin management
│   ├── auth/                         # Authentication & JWT
│   │   ├── config/
│   │   ├── controller/
│   │   ├── entity/
│   │   ├── security/                 # JwtService, JwtAuthenticationFilter
│   │   └── service/
│   ├── auction/                      # Auctions & bidding
│   │   ├── controller/
│   │   ├── entity/
│   │   ├── service/
│   │   └── websocket/                # Config, controllers, scheduler
│   ├── chat/                         # Real-time messaging
│   ├── offer/                        # Price negotiation
│   ├── product/                      # Listings & categories
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── specification/            # JPA Specifications for filtering
│   │   └── service/
│   ├── review/                       # Seller reviews & ratings
│   └── wishlist/                     # Saved products
│
├── frontend/                         # React + Vite client
│   ├── src/
│   │   ├── components/
│   │   │   ├── auction/              # AuctionCard, BidInput, Countdown, etc.
│   │   │   ├── auth/                 # AuthShowcase, AuthFooter
│   │   │   ├── home/                 # HeroBanner, CategoryShowcase, FlashDeals
│   │   │   ├── offer/                # MakeOfferDialog, OfferCard
│   │   │   ├── product/              # FilterSidebar, ImageGallery, ProductCard
│   │   │   ├── review/               # RatingStars, ReviewCard, ReviewForm
│   │   │   └── common/               # AnimatedFade, GlobalWebSocket, ScrollToTop
│   │   ├── pages/                    # Home, Products, AuctionRoom, Chat, etc.
│   │   ├── layouts/                  # MainLayout, AdminLayout, DashboardLayout
│   │   ├── context/                  # AuthContext, ThemeContext
│   │   └── services/                 # API service modules (axios)
│   ├── package.json
│   └── vite.config.js
│
└── pom.xml
```

---

## Getting Started

### Prerequisites

- Java 21
- Maven 3.9+
- Node.js 18+
- PostgreSQL 15+
- Cloudinary account (for image uploads)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/AbhayRathod03/ReOwnIX.git
   cd ReOwnIX
   ```

2. **Create the PostgreSQL database**
   ```sql
   CREATE DATABASE reownix;
   ```

3. **Configure application properties**

   Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.password=YOUR_PASSWORD
   jwt.secret=YOUR_JWT_SECRET_KEY
   cloudinary.cloud-name=YOUR_CLOUD_NAME
   cloudinary.api-key=YOUR_API_KEY
   cloudinary.api-secret=YOUR_API_SECRET
   ```

4. **Run the backend**
   ```bash
   ./mvnw spring-boot:run
   ```
   Backend starts on `http://localhost:8080`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the dev server**
   ```bash
   npm run dev
   ```
   Frontend starts on `http://localhost:5173`

---

## Testing

Unit tests for service layers and a JMeter stress test for the bidding system.

```bash
# Run unit tests
./mvnw test

# JMeter test plan location:
# src/test/jmeter/bid_stress_test.jmx
```

---

## License

This project is for educational and portfolio purposes.
