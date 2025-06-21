const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const itemsJson = require('./items.json');

const itemsInDb = itemsJson.data.sort((a, b) => a.localeCompare(b));

const resolvers = {
  Query: {
    items: () => itemsInDb,
    filter: (_parent, args) => itemsInDb.filter((item) => new RegExp(args.value, 'i').test(item)),
  },
};

const typeDefs = `#graphql
  type Query {
    items: [String!]!
    filter(value: String!): [String]!
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
