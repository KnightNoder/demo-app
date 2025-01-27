import { Meta, StoryFn } from "@storybook/react";
import Input, { InputProps } from "./Input";
import Center from "../../Center/Center";

export default {
  title: "Base/TextInput",
  component: Input,
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: ["default", "outlined", "filled"],
      },
    },
    placeholder: {
      control: "text",
    },
    disabled: {
      control: "boolean",
    },
  },
  decorators: [(Story) => <Center>{Story()}</Center>],
} as Meta;

const Template: StoryFn<InputProps> = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
  variant: "default",
  placeholder: "Default Input",
};

export const Outlined = Template.bind({});
Outlined.args = {
  variant: "outlined",
  placeholder: "Outlined Input",
};

export const Filled = Template.bind({});
Filled.args = {
  variant: "filled",
  placeholder: "Filled Input",
};

export const Disabled = Template.bind({});
Disabled.args = {
  variant: "default",
  placeholder: "Disabled Input",
  disabled: true,
};
