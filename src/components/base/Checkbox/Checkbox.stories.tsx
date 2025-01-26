import { Meta, StoryFn } from "@storybook/react";
import Checkbox from "./Checkbox";

export default {
  title: "Base/Checkbox",
  component: Checkbox,
  argTypes: {
    checked: { control: "boolean" },
    variant: {
      control: "select",
      options: ["default", "primary", "secondary"],
    },
    onChange: { action: "changed" },
  },
} as Meta;

const Template: StoryFn<typeof Checkbox> = (args) => <Checkbox {...args} />;

export const Default = Template.bind({});
Default.args = {
  checked: false,
  variant: "default",
  className: "rounded border-2", // Optional: Add more styling if needed
};

export const Primary = Template.bind({});
Primary.args = {
  checked: true,
  variant: "primary",
  className: "rounded border-2", // Optional
};

export const Secondary = Template.bind({});
Secondary.args = {
  checked: false,
  variant: "secondary",
  className: "rounded border-2", // Optional
};
