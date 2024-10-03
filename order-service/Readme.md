# <span style="color: #f0ad4e;">Order Service</span>

**Description:**

The Order Service is responsible for managing orders. It exposes a GraphQL API for order-related operations.

**Features:**

- Order creation (simplified, without user or product validation).
- JWT-based authentication (managed by the Apollo Gateway).

**Dependencies:**

- Node.js and npm (or yarn)
- Mongoose (for MongoDB interaction)
- @apollo/server (for GraphQL server)
- @apollo/subgraph (for Apollo Federation subgraph)

**Installation:**

1. Navigate to the `order-service` directory.
2. Run `npm install` or `yarn install` to install dependencies.

**Configuration:**

1. Set up a MongoDB database and update the connection string in your configuration file.
2. Create a `.env` file and set the following environment variable:
   - <span style="color: #d9534f;">`MONGODB_URI`</span>: Your MongoDB connection string.
   - <span style="color: #d9534f;">`ORDER_PORT`</span>: The port for the order service (e.g., 4003).

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
- <span style="font-weight: bold; color: #d9534f;">Important:</span> In a real-world scenario, you would implement proper user and product validation and fetch product details from the Product Service.
