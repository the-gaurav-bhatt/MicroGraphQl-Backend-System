import dotenv from "dotenv";
dotenv.config();
import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { gql } from "graphql-tag";
import express from "express";
import path from "path";
import { resolvers } from "./resolvers";
import { readFileSync } from "fs"; // To read the schema file
import { connectDB } from "./config/db";
import { setupRabbitMQ } from "./utils/rabbitmq";
import amqplib from "amqplib";
// const typeDefs = readFileSync("./schema.graphql", "utf-8"); // Load schema.graphql
const typeDefs = gql(
  readFileSync(path.resolve(__dirname, "./order.graphql"), {
    encoding: "utf-8",
  })
);

const app = express();
app.use(cors());
app.use(express.json());
const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs,
    resolvers,
  }),
});
export interface Context {
  message: string;
  rabbitMQChannel: amqplib.Channel;
  userId: string;
}
const startServer = async () => {
  await connectDB();
  const channel = await setupRabbitMQ();
  channel.consume("order_service_queue", (msg) => {
    if (msg != null) {
      const event = JSON.parse(msg.content.toString());
      if (event.type === "userRegistered") {
        handleUserRegistered(event.payload);
        channel.ack(msg);
      }
    }
  });
  channel.consume("product_service_queue", (msg) => {
    console.log("Reaching product created in order service");
    if (msg != null) {
      const event = JSON.parse(msg.content.toString());
      if (event.type === "productCreated") {
        console.log(event.payload, "received in order service");
        channel.ack(msg);
      }
    }
  });
  await server.start();
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }): Promise<Context> => {
        const userId = req.headers["user-id"][0]; // This is the value passed from Apollo Gateway
        return {
          message: "Hello",
          rabbitMQChannel: channel,
          userId: userId || null, // Ensure userId is set in the context
        };
      },
    })
  );

  const port = process.env.ORDER_PORT || 4003;
  app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
  });
};

startServer().catch((err) => console.error("Error starting server", err));

const handleUserRegistered = (payload: any) => {
  console.log(payload);
};
