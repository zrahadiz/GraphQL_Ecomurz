const { ApolloServer } = require("apollo-server");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      formatError: (error) => {
        console.error("GraphQL Error:", error);
        return error;
      },
      cors: {
        origin: "*",
        credentials: true,
      },
    });

    const { url } = await server.listen({ port: PORT });

    console.log(`GraphQL Server ready at ${url}`);
    console.log(`GraphQL Playground: ${url}`);
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}
startServer();

module.exports = { startServer };
