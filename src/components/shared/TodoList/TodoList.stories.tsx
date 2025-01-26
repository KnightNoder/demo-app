import { Meta, StoryFn } from "@storybook/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import TodoList from "./TodoList";
import todoReducer from "../../../features/todo/todoSlice"; // Import your reducer

// Mock Redux Store
const mockStore = configureStore({
  reducer: {
    todos: todoReducer,
  },
  preloadedState: {
    todos: {
      todos: [
        { id: 1, todo: "Learn Storybook", completed: false },
        { id: 2, todo: "Write documentation", completed: true },
      ],
      loading: false,
      error: null,
    },
  },
});

export default {
  title: "Components/TodoList",
  component: TodoList,
  decorators: [
    (Story) => (
      <Provider store={mockStore}>
        <Story />
      </Provider>
    ),
  ],
} as Meta<typeof TodoList>;

const Template: StoryFn<typeof TodoList> = (args) => <TodoList {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Loading = Template.bind({});
Loading.decorators = [
  (Story) => (
    <Provider
      store={configureStore({
        reducer: {
          todos: todoReducer,
        },
        preloadedState: {
          todos: {
            todos: [],
            loading: true,
            error: null,
          },
        },
      })}
    >
      <Story />
    </Provider>
  ),
];

export const ErrorState = Template.bind({});
ErrorState.decorators = [
  (Story) => (
    <Provider
      store={configureStore({
        reducer: {
          todos: todoReducer,
        },
        preloadedState: {
          todos: {
            todos: [],
            loading: false,
            error: "Unable to fetch todos.",
          },
        },
      })}
    >
      <Story />
    </Provider>
  ),
];
