import type { Preview } from "@storybook/react";
import '../src/index.css';
import CenterComponent from '../src/components/atoms/Center/Center';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
