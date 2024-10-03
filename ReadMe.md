You are absolutely correct! I apologize for providing the README files without the .md formatting.

Here are the README.md files in the correct Markdown format:

## User Service README.md

# User Service

**Description:**

The User Service is responsible for managing user accounts, authentication, and authorization. It exposes a GraphQL API for user-related operations.

**Features:**

- User registration and login.
- User profile management (updating username and email).
- JWT-based authentication.
- Event publishing for user creation and updates (using RabbitMQ).

**Dependencies:**

- Node.js and npm (or yarn)
- Mongoose (for MongoDB interaction)
- `jsonwebtoken` (for JWT handling)
- `bcrypt` (for password hashing)
- `amqplib` (for RabbitMQ)
- `@apollo/server` (for GraphQL server)
- `@apollo/subgraph` (for Apollo Federation subgraph)

**Installation:**

1. Navigate to the `user-service` directory.
2. Run `npm install` or `yarn install` to install dependencies.

**Configuration:**

1. Set up a MongoDB database and update the connection string in your configuration file.
2. Create a `.env` file and set the following environment variables:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A strong, secret key for JWT signing (keep this secure).
   - `USER_PORT`: The port for the user service (e.g., `4001`).
   - `RABBITMQ_URL`: Your RabbitMQ connection URL.

**Running the Service:**

1. Run `npm start` or `yarn start`.
2. The User Service will start on the port specified in `USER_PORT`.

**GraphQL API:**

The User Service exposes a GraphQL API with the following operations:

- **Queries:**
  - `users`: Fetches all users.
  - `user(id: ID!)`: Fetches a user by ID.
- **Mutations:**
  - `registerUser(username: String!, email: String!, password: String!)`: Registers a new user.
  - `loginUser(email: String!, password: String!)`: Logs in a user.
  - `updateUserProfile(id: ID!, username: String!, email: String!)`: Updates a user's profile.

**Authentication:**

- The User Service uses JWT for authentication.
- The `registerUser` and `loginUser` mutations return a JWT token that should be included in the `Authorization` header (format: `Bearer <token>`) for subsequent requests that require authentication (e.g., `updateUserProfile`).

**Event Publishing:**

- The User Service publishes the following events to RabbitMQ:
  - `user.created`: When a new user is registered.
  - `user.updated`: When a user profile is updated.

## Product Service README.md

# Product Service

**Description:**

The Product Service manages product information. It exposes a GraphQL API for product-related operations.

**Features:**

- Product creation and management (name, description, price, inventory).
- Event handling for user registration (using RabbitMQ).

**Dependencies:**

- Node.js and npm (or yarn)
- Mongoose (for MongoDB interaction)
- `amqplib` (for RabbitMQ)
- `@apollo/server` (for GraphQL server)
- `@apollo/subgraph` (for Apollo Federation subgraph)

**Installation:**

1. Navigate to the `product-service` directory.
2. Run `npm install` or `yarn install` to install dependencies.

**Configuration:**

1. Set up a MongoDB database and update the connection string in your configuration file.
2. Create a `.env` file and set the following environment variables:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `PRODUCT_PORT`: The port for the product service (e.g., `4002`).
   - `RABBITMQ_URL`: Your RabbitMQ connection URL.

**Running the Service:**

1. Run `npm start` or `yarn start`.
2. The Product Service will start on the port specified in `PRODUCT_PORT`.

**GraphQL API:**

The Product Service exposes a GraphQL API with the following operations:

- **Queries:**
  - `products`: Fetches all products.
  - `product(id: ID!)`: Fetches a product by ID.
- **Mutations:**
  - `createProduct(name: String!, description: String, price: Float!, inventory: Int!)`: Creates a new product.
  - `updateInventory(productId: ID!, newInventory: Int!)`: Updates a product's inventory.

**Event Handling:**

- The Product Service listens for the `user.created` event from RabbitMQ. You can add custom logic to handle this event in the `handleUserRegistered` function (e.g., send a welcome email to new users).

## Order Service README.md

# Order Service

**Description:**

The Order Service is responsible for managing orders. It exposes a GraphQL API for order-related operations.

**Features:**

- Order creation (simplified, without user or product validation).
- JWT-based authentication (managed by the Apollo Gateway).

**Dependencies:**

- Node.js and npm (or yarn)
- Mongoose (for MongoDB interaction)
- `@apollo/server` (for GraphQL server)
- `@apollo/subgraph` (for Apollo Federation subgraph)

**Installation:**

1. Navigate to the `order-service` directory.
2. Run `npm install` or `yarn install` to install dependencies.

**Configuration:**

1. Set up a MongoDB database and update the connection string in your configuration file.
2. Create a `.env` file and set the following environment variable:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `ORDER_PORT`: The port for the order service (e.g., `4003`).

**Running the Service:**

1. Run `npm start` or `yarn start`.
2. The Order Service will start on the port specified in `ORDER_PORT`.

**GraphQL API:**

The Order Service exposes a GraphQL API with the following operations:

- **Queries:**
  - `orders`: Fetches all orders.
  - `order(id: ID!)`: Fetches an order by ID.
- **Mutations:**
  - `placeOrder(userId: ID!, products: [OrderProductInput!]!, totalAmount: Float!)`: Creates a new order (simplified, without user or product validation).

**Authentication:**

- JWT authentication is handled by the Apollo Gateway.
- The Order Service receives the `userId` from the request headers, which are set by the gateway after verifying the JWT token.
- The `placeOrder` mutation requires a valid `userId` to be present in the headers.

**Order Creation (Simplified):**

- The `placeOrder` mutation currently creates orders without validating user or product information.
- You need to provide `productId`, `quantity`, and `price` for each product in the `products` array.
- The `totalAmount` should also be provided in the mutation.
- In a real-world scenario, you would implement proper user and product validation and fetch product details from the Product Service.

You are absolutely right! I missed a crucial detail about the Apollo Gateway setup. The gateway configuration itself, along with its dependencies, should be documented in its own README.md file.

Let's create a `README.md` file for the Apollo Gateway:

## GraphQL Gateway README.md

# GraphQL Gateway

**Description:**

This service acts as the Apollo Gateway, orchestrating requests to the underlying microservices (user, product, and order services) and providing a unified GraphQL API. It also handles JWT authentication and authorization.

**Features:**

- Federated GraphQL schema using Apollo Federation.
- Centralized JWT authentication.
- Propagation of user ID to downstream services.

**Dependencies:**

- Node.js and npm (or yarn)
- `@apollo/gateway`: "^2.9.2"
- `@apollo/server`: "^4.11.0"
- `@apollo/server/standalone`: "^4.11.0"
- `graphql`: "^16.9.0"
- `jsonwebtoken`: "^9.0.2" (for JWT handling)

**Installation:**

1. Navigate to the `graphql-gateway` directory.
2. Run `npm install` or `yarn install` to install dependencies.

**Configuration:**

1. Create a `.env` file and set the following environment variable:
   - `JWT_SECRET`: A strong, secret key for JWT signing (keep this secure).
2. Update the `supergraph.graphql` file to include the correct schema definitions for your federated graph.
3. In the `gateway.ts` file:
   - Update the `serviceList` in the `ApolloGateway` constructor to point to the correct URLs for your user, product, and order services.
   - Implement the `verifyToken` function in `utils/auth.ts` to validate JWTs and extract the user ID.

**Running the Gateway:**

1. Run `npm start` or `yarn start`.
2. The Apollo Gateway will start on the specified port (e.g., `4000`).

**Authentication:**

- The gateway intercepts incoming requests and verifies JWT tokens using the `verifyToken` function.
- The extracted `userId` is added to the request context.
- A custom data source (`AuthenticatedDataSource`) propagates the `userId` to downstream services via request headers.

**Usage:**

- Clients can send GraphQL requests to the gateway's endpoint (e.g., `http://localhost:4000/graphql`).
- JWT tokens should be included in the `Authorization` header (format: `Bearer <token>`) for requests that require authentication.

**Important Notes:**

- The gateway requires the supergraph schema (`supergraph.graphql`) to be composed correctly using the `rover` CLI or Apollo Studio.
- Secure your JWT secret key (`JWT_SECRET`) in a production environment.
- Implement robust error handling for JWT verification and authentication failures.
