import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import itemsJson from './items.json' with { type: "json" };

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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  stopOnTerminationSignals: true,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
