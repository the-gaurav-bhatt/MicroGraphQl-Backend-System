# E-commerce Microservices with GraphQL Federation

This repository demonstrates a basic e-commerce system built using microservices architecture and Apollo Federation for GraphQL.

## Services

The system is composed of four independent services:

- **User Service:** Manages user accounts, authentication, and authorization.
- **Product Service:** Handles product information and inventory.
- **Order Service:** Processes orders (simplified for demonstration).
- **GraphQL Gateway:** Acts as the single entry point for clients, orchestrating requests to the underlying services.

## Technologies Used

- **Node.js:** Backend runtime environment.
- **Express.js:** Web framework for Node.js.
- **GraphQL:** Query language for APIs.
- **Apollo Federation:** Architecture for composing multiple GraphQL services into a unified graph.
- **MongoDB:** NoSQL database for data storage.
- **RabbitMQ:** Message broker for inter-service communication.
- **JWT (JSON Web Token):** For authentication and authorization.

## Architecture

```
                            +-----------+
                            |  Client  |
                            +-----+-----+
                                   ^
                                   |
                                   v
                      +-------------------+
                      |  GraphQL Gateway  |
                      +--------+---------+
                             ^
                             |
             +--------------+--------------+--------------+
              |                     |                     |
     +--------v---------+  +--------v---------+  +--------v---------+
     |  User Service    |  |  Product Service |  |  Order Service   |
     +------------------+  +------------------+  +------------------+
             |                      |                      |
             v                      v                      v
     +--------+---------+  +--------+---------+  +--------+---------+
     |  MongoDB         |  |  MongoDB         |  |  MongoDB         |
     +------------------+  +------------------+  +------------------+
```

1. The **Client** (e.g., a web or mobile app) sends GraphQL requests to the **GraphQL Gateway**.
2. The **Gateway** parses the request and determines which underlying services are needed to fulfill it.
3. The **Gateway** forwards the relevant parts of the request to the appropriate services (User, Product, Order).
4. The services fetch data from their respective databases (MongoDB).
5. The services return the data to the **Gateway**.
6. The **Gateway** combines the data from the services and returns a single, unified response to the **Client**.

## Features

- **User Registration and Login:** Secure user account management.
- **User Profile Management:** Users can update their profile information.
- **Product Management:** Create, update, and manage product details.
- **Order Placement:** Simplified order creation process (no validation for demonstration).
- **Federated GraphQL Schema:** A unified GraphQL schema exposed through the gateway.
- **JWT Authentication:** Centralized authentication handled by the gateway.

## Getting Started

1. **Clone the Repository:** `git clone https://github.com/the-gaurav-bhatt/MicroGraphQl-Backend-System.git`
2. **Navigate to Each Service Directory:** (e.g., `cd user-service`) or you may setup docker compose
3. **Install Dependencies:** `npm install` or `yarn install`
4. **Configure Services:** Set up MongoDB connections, JWT secrets, port numbers, and RabbitMQ URLs in `.env` files (refer to service-specific READMEs).
5. **Start Services:** `npm start` or `yarn start` in each service directory.
6. **Start the Gateway:** `npm start` or `yarn start` in the `graphql-gateway` directory.

## Exploring the API

Once the services and gateway are running, you can use a GraphQL client like **GraphQL Playground** or **Apollo Studio** to explore the unified GraphQL API at the gateway's endpoint (e.g., `http://localhost:4000/graphql`).

## Future Enhancements

- **Implement Robust Order Validation:** Validate user and product information during order creation.
- **Add Payment Integration:** Integrate with a payment gateway for processing payments.
- **Implement Shipping and Order Tracking:** Add functionality for managing shipping and order tracking.
- **Improve Error Handling:** Implement more robust error handling throughout the services.
