import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const graphqlClient = new ApolloClient({
  uri: "https://dummyjson.com/graphql", 
  cache: new InMemoryCache(),
});

export { graphqlClient, gql };