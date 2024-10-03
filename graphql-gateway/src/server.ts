import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloGateway, RemoteGraphQLDataSource } from "@apollo/gateway";
import { readFileSync } from "fs";
import { verifyToken } from "./utils/auth";
import { JwtPayload } from "jsonwebtoken";

// Read the supergraph SDL file
// const supergraphSdl: string = "";
const supergraphSdl: string = readFileSync("./src/supergraph.graphql", "utf-8");

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }: any) {
    request.http.headers.set("user-id", context.userId);
  }
}

// Configure the Apollo Gateway with the supergraph SDL
const gateway: ApolloGateway = new ApolloGateway({
  supergraphSdl,
  buildService({ url }) {
    return new AuthenticatedDataSource({ url }); // Use the custom data source
  },
});

// Create an Apollo Server instance
const server = new ApolloServer({
  gateway,
});
const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }): Promise<any> => {
      const token = req.headers.authorization?.split(" ")[1];

      let userId: JwtPayload | string = "";
      if (token) {
        userId = verifyToken(token);
      }

      return { userId };
    },
    listen: { port: 4000 }, // Or your desired port
  });
  console.log(`🚀  Server ready at ${url}`);
};

startServer();
