# <span style="color: #007bff;">User Service</span>

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
- jsonwebtoken (for JWT handling)
- bcrypt (for password hashing)
- amqplib (for RabbitMQ)
- @apollo/server (for GraphQL server)
- @apollo/subgraph (for Apollo Federation subgraph)

**Installation:**

1. Navigate to the `user-service` directory.
2. Run `npm install` or `yarn install` to install dependencies.

**Configuration:**

1. Set up a MongoDB database and update the connection string in your configuration file.
2. Create a `.env` file and set the following environment variables:
   - <span style="color: #d9534f;">`MONGODB_URI`</span>: Your MongoDB connection string.
   - <span style="color: #d9534f;">`JWT_SECRET`</span>: A strong, secret key for JWT signing (<span style="font-weight: bold;">keep this secure</span>).
   - <span style="color: #d9534f;">`USER_PORT`</span>: The port for the user service (e.g., 4001).
   - <span style="color: #d9534f;">`RABBITMQ_URL`</span>: Your RabbitMQ connection URL.

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
