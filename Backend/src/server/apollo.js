const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("../graphql/schema");
const createContext = require("../middleware/context");
const errorHandler = require("../middleware/errorHandler");

const createApolloServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: createContext,
    formatError: errorHandler,
    introspection: process.env.NODE_ENV !== "production",
    playground: process.env.NODE_ENV !== "production",
  });
};

module.exports = createApolloServer;
