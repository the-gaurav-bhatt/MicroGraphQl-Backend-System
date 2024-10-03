import request from "supertest";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServer } from "@apollo/server";
import { ApolloGateway, RemoteGraphQLDataSource } from "@apollo/gateway";
import { readFileSync } from "fs";
import { randomInt } from "crypto";

// Read the supergraph SDL file
const supergraphSdl = readFileSync("./src/supergraph.graphql", "utf-8");

// Custom data source for authenticated requests
class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }: any) {
    request.http.headers.set("user-id", context.userId);
  }
}

// Configure Apollo Gateway
const gateway = new ApolloGateway({
  supergraphSdl,
  buildService({ url }) {
    return new AuthenticatedDataSource({ url });
  },
});

// Create an Apollo Server instance
const server = new ApolloServer({
  gateway,
});

let baseURL: string;

// Start the server before running tests
beforeAll(async () => {
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }): Promise<any> => {
      const token = req.headers.authorization?.split(" ")[1];
      let userId = "";
      if (token) {
        // Replace this with your actual token verification logic
        userId = "test-user-id";
      }
      return { userId };
    },
    listen: { port: 4005 },
  });
  baseURL = url;
});

// Test cases
describe("Supergraph API", () => {
  it("should create a new product", async () => {
    const mutation = `
      mutation CreateProduct($name: String!, $description: String, $price: Float!, $inventory: Int!) {
        createProduct(name: $name, description: $description, price: $price, inventory: $inventory) {
          id
          name
          description
          price
          inventory
        }
      }
    `;

    const response = await request(baseURL)
      .post("/")
      .send({
        query: mutation,
        variables: {
          name: "Test Product",
          description: "Test Description",
          price: 100.0,
          inventory: 10,
        },
      })
      .set("Authorization", "Bearer valid-token");

    expect(response.body.data.createProduct.name).toBe("Test Product");
    expect(response.body.data.createProduct.description).toBe(
      "Test Description"
    );
    expect(response.body.data.createProduct.price).toBe(100.0);
    expect(response.body.data.createProduct.inventory).toBe(10);
  });

  it("should return all products", async () => {
    const query = `
      query {
        products {
          id
          name
          price
          inventory
        }
      }
    `;

    const response = await request(baseURL)
      .post("/")
      .send({ query })
      .set("Authorization", "Bearer valid-token");

    expect(response.body.data.products.length).toBeGreaterThan(0);
    expect(response.body.data.products[0].name).toBeDefined();
  });

  it("should register a user", async () => {
    const mutation = `
      mutation registerUser($username:String!,$email:String!,$password:String!){
  registerUser(username:$username,email:$email,password:$password){
    token
    user {
      email
      username
      id
    }
  }

}
    `;
    const random = randomInt(1, 10000);
    const response = await request(baseURL)
      .post("/")
      .send({
        query: mutation,
        variables: {
          username: "testuser",
          email: random + "@example.com",
          password: "password123",
        },
      })
      .set("Authorization", "Bearer valid-token");

    expect(response.body.data.registerUser.user.username).toBe("testuser");
    expect(response.body.data.registerUser.user.email).toBe(
      random + "@example.com"
    );
  });

  it("should login a user", async () => {
    const mutation = `
      mutation LoginUser($email: String!, $password: String!) {
        loginUser(email: $email, password: $password) {
          token
          user {
            id
            username
            email
          }
        }
      }
    `;

    const response = await request(baseURL)
      .post("/")
      .send({
        query: mutation,
        variables: { email: "testuser@example.com", password: "password123" },
      })
      .set("Authorization", "Bearer valid-token");

    expect(response.body.data.loginUser.user.email).toBe(
      "testuser@example.com"
    );
  });

  it("should place an order", async () => {
    const mutation = `
    mutation PlaceOrder($userId: ID!, $products: [OrderProductInput!]!, $totalAmount: Float) {
        placeOrder(userId: $userId, products: $products, totalAmount: $totalAmount) {
            id
            products {
                productId
      
        }
            totalAmount
            status
            createdAt
        }
    }
    `;

    const response = await request(baseURL)
      .post("/")
      .send({
        query: mutation,
        variables: {
          userId: "66fb5e2650f3fa29a6735da9",
          products: [
            { productId: "66fd89623d968d3fea21aed3", quantity: 2, price: 1733 },
            { productId: "66fb8f7f1fb849cdb188cba2", quantity: 1, price: 5117 },
          ],
          totalAmount: 19394.11,
        },
      })
      .set("Authorization", "Bearer valid-token");

    expect(response.body.data.placeOrder.totalAmount).toBe(19394.11);
    expect(response.body.data.placeOrder.status).toBeDefined();
  });

  it("should fetch a specific product by ID", async () => {
    const query = `
      query GetProduct($id: ID!) {
        product(id: $id) {
          id
          name
          price
          inventory
        }
      }
    `;

    const response = await request(baseURL)
      .post("/")
      .send({
        query,
        variables: { id: "66fb8f5f1fb849cdb188cba0" },
      })
      .set("Authorization", "Bearer valid-token");

    expect(response.body.data.product.id).toBe("66fb8f5f1fb849cdb188cba0");
  });

  it("should fetch all users", async () => {
    const query = `
      query {
        users {
          id
          username
          email
        }
      }
    `;

    const response = await request(baseURL)
      .post("/")
      .send({ query })
      .set("Authorization", "Bearer valid-token");

    expect(response.body.data.users.length).toBeGreaterThan(0);
    expect(response.body.data.users[0].username).toBeDefined();
  });
});
