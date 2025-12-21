const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 4000;

async function startServer() {
  const app = express();

  // CORS for browser
  app.use(
    cors({
      origin: "https://ecomurz.pages.dev",
      credentials: true,
    })
  );

  app.use(express.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => {
      console.error("GraphQL Error:", error);
      return error;
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql", cors: false });

  app.listen(PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

startServer();
