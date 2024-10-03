// TODO
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
import * as amqp from "amqplib"; // Import amqplib types

// const typeDefs = readFileSync("./schema.graphql", "utf-8"); // Load schema.graphql
const typeDefs = gql(
  readFileSync(path.resolve(__dirname, "./user.graphql"), {
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
  rabbitmqChannel: amqp.Channel;
}
const startServer = async () => {
  await connectDB();
  const channel = await setupRabbitMQ();
  channel.consume("order_service_queue", (msg) => {
    console.log("Consuming order service queue");
    if (msg != null) {
      const event = JSON.parse(msg.content.toString());
      if (event.type === "orderPlaced") {
        console.log("Order place received in product service ", event);
        // TODO: Handle order placed event
        channel.ack(msg);
      }
    }
  });
  await server.start();
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }): Promise<Context> => {
        return {
          message: "Hello",
          rabbitmqChannel: channel,
        };
      },
    })
  );

  const port = process.env.USER_PORT || 4001;
  app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
  });
};

startServer().catch((err) => console.error("Error starting server", err));
