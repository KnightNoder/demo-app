// import React from "react";
// import { Provider } from "react-redux";
// import { configureStore } from "@reduxjs/toolkit";
// import { mount } from "cypress/react";
// import TodoList from "../../src/components/TodoList/TodoList";
// import todosReducer, {
//   setTodos,
//   setLoading,
//   setError,
// } from "../../src/features/todo/todoSlice";

// // Mock store configuration
// const createMockStore = (preloadedState: any) =>
//   configureStore({
//     reducer: {
//       todos: todosReducer,
//     },
//   })

// describe("TodoList Component", () => {
//   it("renders the loading state", () => {
//     const mockStore = createMockStore({
//       todos: { todos: [], loading: true, error: null },
//     });

//     mount(
//         <TodoList/>
//     );

//     // Verify loading text is displayed
//     cy.contains("Loading...").should("exist");
//   });

//   it("renders the error state", () => {
//     const mockStore = createMockStore({
//       todos: { todos: [], loading: false, error: "Failed to fetch todos" },
//     });

//     mount(
//       <Provider store={mockStore}>
//         <TodoList />
//       </Provider>
//     );

//     // Verify error message is displayed
//     cy.contains("Error: Failed to fetch todos").should("exist");
//   });

//   it("renders the todo list from REST API data", () => {
//     const mockStore = createMockStore({
//       todos: {
//         todos: [
//           { id: 1, todo: "Learn Cypress", completed: false },
//           { id: 2, todo: "Write Tests", completed: true },
//         ],
//         loading: false,
//         error: null,
//       },
//     });

//     mount(
//       <Provider store={mockStore}>
//         <TodoList />
//       </Provider>
//     );

//     // Verify todos are displayed
//     cy.contains("Learn Cypress").should("exist");
//     cy.contains("Write Tests").should("exist");

//     // Verify completed todos have the correct style
//     cy.contains("Write Tests").should("have.class", "line-through");

//     // Verify checkbox states
//     cy.get("input[type='checkbox']").first().should("not.be.checked");
//     cy.get("input[type='checkbox']").last().should("be.checked");
//   });

//   it("toggles a todo's completion", () => {
//     const mockStore = createMockStore({
//       todos: {
//         todos: [{ id: 1, todo: "Learn Cypress", completed: false }],
//         loading: false,
//         error: null,
//       },
//     });

//     mount(
//       <Provider store={mockStore}>
//         <TodoList />
//       </Provider>
//     );

//     // Simulate clicking the checkbox
//     cy.get("input[type='checkbox']").first().click();

//     // Verify the Redux state is updated (you can use a spy to monitor dispatch)
//     cy.get("input[type='checkbox']").first().should("be.checked");
//   });

//   it("fetches todos using REST API when button is clicked", () => {
//     const mockStore = createMockStore({
//       todos: { todos: [], loading: false, error: null },
//     });

//     mount(
//       <Provider store={mockStore}>
//         <TodoList />
//       </Provider>
//     );

//     // Intercept REST API call
//     cy.intercept("GET", "/todos", {
//       statusCode: 200,
//       body: {
//         todos: [
//           { id: 1, todo: "Learn Cypress", completed: false },
//           { id: 2, todo: "Write Tests", completed: true },
//         ],
//       },
//     }).as("fetchTodos");

//     // Click the button to fetch todos
//     cy.contains("Get Data from REST api").click();

//     // Wait for the API call and verify the result
//     cy.wait("@fetchTodos").then((interception) => {
//       expect(interception.response?.statusCode).to.eq(200);
//     });

//     // Verify todos are displayed after fetching
//     cy.contains("Learn Cypress").should("exist");
//     cy.contains("Write Tests").should("exist");
//   });

// });
