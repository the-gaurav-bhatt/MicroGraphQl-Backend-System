# <span style="color: #5bc0de;">GraphQL Gateway</span>

**Description:**

This service acts as the Apollo Gateway, orchestrating requests to the underlying microservices (user, product, and order services) and providing a unified GraphQL API. It also handles JWT authentication and authorization.

**Features:**

- Federated GraphQL schema using Apollo Federation.
- Centralized JWT authentication.
- Propagation of user ID to downstream services.

**Dependencies:**

- Node.js and npm (or yarn)
- @apollo/gateway: "^2.9.2"
- @apollo/server: "^4.11.0"
- @apollo/server/standalone: "^4.11.0"
- graphql: "^16.9.0"
- jsonwebtoken: "^9.0.2" (for JWT handling)

**Installation:**

1. Navigate to the `graphql-gateway` directory.
2. Run `npm install` or `yarn install` to install dependencies.

**Configuration:**

1. Create a `.env` file and set the following environment variable:
   - <span style="color: #d9534f;">`JWT_SECRET`</span>: A strong, secret key for JWT signing (<span style="font-weight: bold;">keep this secure</span>).
2. Update the `supergraph.graphql` file to include the correct schema definitions for your federated graph.
3. In the `gateway.ts` file:
   - Update the `serviceList` in the `ApolloGateway` constructor to point to the correct URLs for your user, product, and order services.
   - Implement the `verifyToken` function in `utils/auth.ts` to validate JWTs and extract the user ID.

**Running the Gateway:**

1. Run `npm start` or `yarn start`.
2. The Apollo Gateway will start on the specified port (e.g., 4000).

**Authentication:**

- The gateway intercepts incoming requests and verifies JWT tokens using the `verifyToken` function.
- The extracted `userId` is added to the request context.
- A custom data source (`AuthenticatedDataSource`) propagates the `userId` to downstream services via request headers.

**Usage:**

- Clients can send GraphQL requests to the gateway's endpoint (e.g., `http://localhost:4000/graphql`).
- JWT tokens should be included in the `Authorization` header (format: `Bearer <token>`) for requests that require authentication.

**Important Notes:**

- The gateway requires the supergraph schema (`supergraph.graphql`) to be composed correctly using the `rover` CLI or Apollo Studio.
- <span style="font-weight: bold; color: #d9534f;">Secure your JWT secret key (`JWT_SECRET`) in a production environment.</span>
- Implement robust error handling for JWT verification and authentication failures.
