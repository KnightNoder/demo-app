import { StoryFn, Meta } from "@storybook/react"; // Use `Story` and `Meta` instead of `ComponentStory` and `ComponentMeta`
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "../../../features/todo/todoSlice"; // Import your reducer
import AddTodo from "./AddTodo";

const store = configureStore({
  reducer: {
    todo: todoReducer,
  },
});

export default {
  title: "Components/AddTodo",
  component: AddTodo,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
} as Meta<typeof AddTodo>;

const Template: StoryFn<typeof AddTodo> = (args) => <AddTodo {...args} />;

export const Default = Template.bind({});
Default.args = {};
