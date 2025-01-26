import { Meta, StoryFn } from "@storybook/react";
import Button, { ButtonProps } from "./Button";

export default {
  title: "Base/Button",
  component: Button,
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: ["primary", "secondary", "danger", "default"],
      },
    },
    onClick: { action: "clicked" },
  },
} as Meta;

const Template: StoryFn<ButtonProps> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  variant: "primary",
  children: "Primary Button",
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: "secondary",
  children: "Secondary Button",
};

export const Danger = Template.bind({});
Danger.args = {
  variant: "danger",
  children: "Danger Button",
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: "Disabled Button",
  disabled: true,
};
