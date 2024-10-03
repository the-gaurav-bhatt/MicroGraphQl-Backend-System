# <span style="color: #5cb85c;">Product Service</span>

**Description:**

The Product Service manages product information. It exposes a GraphQL API for product-related operations.

**Features:**

- Product creation and management (name, description, price, inventory).
- Event handling for user registration (using RabbitMQ).

**Dependencies:**

- Node.js and npm (or yarn)
- Mongoose (for MongoDB interaction)
- amqplib (for RabbitMQ)
- @apollo/server (for GraphQL server)
- @apollo/subgraph (for Apollo Federation subgraph)

**Installation:**

1. Navigate to the `product-service` directory.
2. Run `npm install` or `yarn install` to install dependencies.

**Configuration:**

1. Set up a MongoDB database and update the connection string in your configuration file.
2. Create a `.env` file and set the following environment variables:
   - <span style="color: #d9534f;">`MONGODB_URI`</span>: Your MongoDB connection string.
   - <span style="color: #d9534f;">`PRODUCT_PORT`</span>: The port for the product service (e.g., 4002).
   - <span style="color: #d9534f;">`RABBITMQ_URL`</span>: Your RabbitMQ connection URL.

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

- The Product Service listens for the `user.created` event from RabbitMQ.
- You can add custom logic to handle this event in the `handleUserRegistered` function (e.g., send a welcome email to new users).
