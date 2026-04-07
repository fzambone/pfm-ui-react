import type { Preview } from '@storybook/react-vite';

import '../src/index.css';

/*
 * Storybook Preview Configuration
 *
 * Importing `../src/index.css` loads Tailwind CSS + our design system
 * tokens + base.css — the same CSS pipeline as the app. This means
 * components in Storybook render with the exact same Chromatic
 * Refraction theme: dark background, glass effects, Inter font.
 */
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
    layout: 'centered',
  },
};

export default preview;
