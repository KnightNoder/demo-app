import axiosClient from "./axiosClient";
import { graphqlClient, gql } from "./graphqlClient";

export const fetchTodosFromRest = async () => {
  const response = await axiosClient.get("/todo");
  return response.data.todos.slice(1,10);
};

// GraphQL API: Fetch Todos
export const fetchTodosFromGraphql = async () => {
  const GET_TODOS = gql`
    query {
      todos {
        id
        todo
        completed
        userId
      }
    }
  `;

  const response = await graphqlClient.query({ query: GET_TODOS });
  return response.data.todos;
};
