const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const itemsJson = require('./items.json');

const itemsInDb = itemsJson.data;

const resolvers = {
  Query: {
    items: (value) =>
      itemsInDb.filter((item) => new RegExp(value, 'i').test(item)),
  },
};

const typeDefs = `#graphql
  type Item {
    value: String!
  }

  type Query {
    items(value: String!): [Item]!
  }
`;

const startServer = async () => {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      stopOnTerminationSignals: true,
    });

    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
    });

    console.log(`🚀  Server ready at: ${url}`);
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};

startServer();
