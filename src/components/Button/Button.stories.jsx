import { Button } from './Button.jsx';

/** @type {import('@storybook/react').Meta<typeof Button>} */
const meta = {
  component: Button,
  tags: ['autodocs'],
  title: 'Components/Button',
  parameters: {
    docs: {
      description: {
        component:
          'The primary interactive element. Variants cover emphasis levels, sizes cover density, and `loading` announces busy state with `aria-busy`.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      description: 'Visual emphasis',
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    onClick: { action: 'clicked' },
    children: { control: 'text' },
  },
};

export default meta;

/** @type {import('@storybook/react').StoryObj<typeof Button>} */
export const Primary = {
  args: { children: 'Save changes', variant: 'primary' },
};

/** @type {import('@storybook/react').StoryObj<typeof Button>} */
export const Secondary = {
  args: { children: 'Cancel', variant: 'secondary' },
};

/** @type {import('@storybook/react').StoryObj<typeof Button>} */
export const Ghost = {
  args: { children: 'Learn more', variant: 'ghost' },
};

/** @type {import('@storybook/react').StoryObj<typeof Button>} */
export const Danger = {
  args: { children: 'Delete project', variant: 'danger' },
};

/** @type {import('@storybook/react').StoryObj<typeof Button>} */
export const Small = {
  args: { children: 'Small', size: 'sm' },
};

/** @type {import('@storybook/react').StoryObj<typeof Button>} */
export const Large = {
  args: { children: 'Large', size: 'lg' },
};

/** @type {import('@storybook/react').StoryObj<typeof Button>} */
export const Loading = {
  args: { children: 'Saving…', loading: true },
  parameters: {
    docs: {
      description: {
        story: 'Loading buttons expose `aria-busy="true"`, render a spinner and ignore clicks.',
      },
    },
  },
};

/** @type {import('@storybook/react').StoryObj<typeof Button>} */
export const Disabled = {
  args: { children: 'Unavailable', disabled: true },
};

/** @type {import('@storybook/react').StoryObj<typeof Button>} */
export const FullWidth = {
  args: { children: 'Continue', fullWidth: true },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
};

/** @type {import('@storybook/react').StoryObj<typeof Button>} */
export const WithIcons = {
  parameters: {
    docs: {
      description: {
        story: 'Icons are decorative (`aria-hidden`) and never replace the label.',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        startIcon={
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
            <path d="M10 3v14M3 10h14" strokeLinecap="round" />
          </svg>
        }
      >
        New project
      </Button>
      <Button
        variant="secondary"
        endIcon={
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
            <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      >
        Continue
      </Button>
      <Button variant="ghost" startIcon={<span aria-hidden="true">★</span>}>
        Star
      </Button>
    </div>
  ),
};

/** @type {import('@storybook/react').StoryObj<typeof Button>} */
export const AllVariants = {
  parameters: {
    docs: {
      description: { story: 'Every variant side by side for quick comparison.' },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
      <Button variant="primary" loading>
        Loading
      </Button>
    </div>
  ),
};
