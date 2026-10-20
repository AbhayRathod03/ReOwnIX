# ReOwnIX

A full-stack secondhand marketplace backend built with Spring Boot. Users can list pre-owned products, make offers, run live auctions with real-time bidding over WebSockets, chat with sellers, and leave reviews.

---

## Tech Stack

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

---

## Modules

### Auth
User registration, login, and JWT-based authentication. Includes role-based access control (`USER`, `ADMIN`) with a custom `JwtAuthenticationFilter`.

### Product
Full CRUD for product listings with category management, image uploads via Cloudinary, search by keyword, and advanced filtering (category, brand, condition, listing type, price range). Supports pagination and sorting.

### Auction
Create timed auctions linked to products. Bidding is done via both REST endpoints and real-time WebSocket channels. Includes bid validation (minimum increment, no self-bidding), auction scheduling/expiry, and event broadcasting.

### Offer
Make price offers on products. Sellers can accept, reject, or counter offers. Tracks offer status lifecycle.

### Chat
One-on-one messaging between buyers and sellers. REST API for conversation history plus WebSocket-powered real-time message delivery.

### Review
Buyers can leave ratings and written reviews for sellers. Supports average seller rating calculation.

### Wishlist
Users can save and manage a list of favorite products.

### Admin
Administrative dashboard operations for managing users, products, and platform-level data.

---

## API Overview

Base URL: `http://localhost:8080`

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/users/profile` | Get current user profile |

### Products
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/products` | Create a product listing |
| GET | `/api/products` | List all products (paginated, filterable) |
| GET | `/api/products/{id}` | Get product details |
| GET | `/api/products/search?keyword=` | Search products |
| GET | `/api/products/my-products` | Get current user's products |
| PUT | `/api/products/{id}` | Update a product |
| DELETE | `/api/products/{id}` | Delete a product |

### Product Images
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/products/{id}/images` | Upload image |
| DELETE | `/api/products/images/{imageId}` | Delete image |

### Categories
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/categories` | Create category |
| GET | `/api/categories` | List all categories |
| PUT | `/api/categories/{id}` | Update category |
| DELETE | `/api/categories/{id}` | Delete category |

### Auctions
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

### Offers
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/offers` | Make an offer |
| GET | `/api/offers` | List offers |
| PUT | `/api/offers/{id}` | Update offer status |

### Chat
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat/conversations` | Start a conversation |
| GET | `/api/chat/conversations` | List conversations |
| POST | `/api/chat/messages` | Send a message |
| GET | `/api/chat/messages/{conversationId}` | Get message history |

### Reviews
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/reviews` | Create a review |
| GET | `/api/reviews/seller/{sellerId}` | Get seller reviews |
| PUT | `/api/reviews/{id}` | Update review |
| DELETE | `/api/reviews/{id}` | Delete review |

### Wishlist
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/wishlist/{productId}` | Add to wishlist |
| GET | `/api/wishlist` | Get wishlist |
| DELETE | `/api/wishlist/{productId}` | Remove from wishlist |

### WebSocket (Auction Real-time)
| Destination | Description |
|---|---|
| `/topic/auction/{id}` | Subscribe to live auction updates |
| `/app/auction/{id}/bid` | Send a bid via WebSocket |

Full interactive API documentation is available at `/swagger-ui.html` when the server is running.

---

## Project Structure

```
src/main/java/com/reownix/
├── AppApplication.java
├── admin/              # Admin management
├── auth/               # Authentication & JWT security
│   ├── config/
│   ├── controller/
│   ├── entity/
│   ├── security/       # JwtService, JwtAuthenticationFilter
│   └── service/
├── auction/            # Auction & bidding system
│   ├── controller/
│   ├── entity/         # Auction, Bid, AuctionEvent
│   ├── service/
│   └── websocket/      # WebSocket config, controllers, scheduler
├── chat/               # Real-time messaging
├── offer/              # Price negotiation
├── product/            # Product listings & categories
│   ├── controller/     # ProductController, CategoryController, ProductImageController
│   ├── dto/
│   ├── entity/
│   ├── specification/  # JPA Specifications for filtering
│   └── service/
├── review/             # Seller reviews & ratings
└── wishlist/           # Saved products
```

---

## Getting Started

### Prerequisites
- Java 21
- Maven 3.9+
- PostgreSQL 15+
- Cloudinary account (for image uploads)

### Setup

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
   spring.datasource.url=jdbc:postgresql://localhost:5432/reownix
   spring.datasource.username=postgres
   spring.datasource.password=YOUR_PASSWORD

   jwt.secret=YOUR_JWT_SECRET_KEY

   cloudinary.cloud-name=YOUR_CLOUD_NAME
   cloudinary.api-key=YOUR_API_KEY
   cloudinary.api-secret=YOUR_API_SECRET
   ```

4. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```
   The server starts on `http://localhost:8080`.

5. **Open Swagger UI**

   Visit `http://localhost:8080/swagger-ui.html` to explore and test all endpoints.

---

## Testing

The project includes unit tests for service layers and a JMeter stress test for the bidding system.

```bash
# Run unit tests
./mvnw test

# JMeter test plan is located at:
# src/test/jmeter/bid_stress_test.jmx
```

---

## License

This project is for educational and portfolio purposes.
