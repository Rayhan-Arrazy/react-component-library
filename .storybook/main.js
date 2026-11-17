/** @type {import('@storybook/react-vite').StorybookConfig} */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: '@storybook/react-vite',
  features: {
    // Run React's `act` in production builds so a11y checks see settled DOM.
    developmentModeForBuild: true,
  },
  docs: {
    autodocs: 'tag',
  },
};

export default config;
