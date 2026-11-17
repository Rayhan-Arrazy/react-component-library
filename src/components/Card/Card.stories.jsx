import { Card } from './Card.jsx';

/** @type {import('@storybook/react').Meta<typeof Card>} */
const meta = {
  component: Card,
  tags: ['autodocs'],
  title: 'Components/Card',
  parameters: {
    docs: {
      description: {
        component:
          'Surface for grouping related content. Compose `Card.Header`, `Card.Media`, `Card.Body` and `Card.Footer` inside it.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['elevated', 'outlined', 'filled'] },
    interactive: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
};

export default meta;

/** @type {import('@storybook/react').StoryObj<typeof Card>} */
export const Elevated = {
  args: {
    variant: 'elevated',
    children: (
      <>
        <Card.Header>
          <span className="text-base font-semibold text-neutral-900">Project Aurora</span>
        </Card.Header>
        <Card.Body>
          A design-system migration covering 42 screens and 3 product teams.
        </Card.Body>
      </>
    ),
  },
};

/** @type {import('@storybook/react').StoryObj<typeof Card>} */
export const Outlined = {
  args: {
    variant: 'outlined',
    children: (
      <>
        <Card.Header>
          <span className="text-base font-semibold text-neutral-900">Outlined card</span>
        </Card.Header>
        <Card.Body>Best for dense layouts where elevation would be noisy.</Card.Body>
      </>
    ),
  },
};

/** @type {import('@storybook/react').StoryObj<typeof Card>} */
export const Filled = {
  args: {
    variant: 'filled',
    children: (
      <>
        <Card.Header>
          <span className="text-base font-semibold text-neutral-900">Filled card</span>
        </Card.Header>
        <Card.Body>Subtle background for secondary or grouped content.</Card.Body>
      </>
    ),
  },
};

/** @type {import('@storybook/react').StoryObj<typeof Card>} */
export const WithMediaAndFooter = {
  parameters: {
    docs: {
      description: { story: 'Full composition: media, header, body and footer regions.' },
    },
  },
  render: () => (
    <Card className="w-80">
      <Card.Media>
        <div
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-500 to-brand-800 text-sm font-medium text-white"
          role="img"
          aria-label="Abstract cover artwork"
        >
          Cover artwork
        </div>
      </Card.Media>
      <Card.Header className="pt-4">
        <span className="text-base font-semibold text-neutral-900">Design tokens</span>
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
          New
        </span>
      </Card.Header>
      <Card.Body>Ship consistent colour, spacing and typography across products.</Card.Body>
      <Card.Footer>
        <span className="text-xs text-neutral-500">Updated 2 days ago</span>
      </Card.Footer>
    </Card>
  ),
};

/** @type {import('@storybook/react').StoryObj<typeof Card>} */
export const Interactive = {
  parameters: {
    docs: {
      description: {
        story:
          'An interactive card renders as a `<button>` so it is reachable and operable by keyboard.',
      },
    },
  },
  args: {
    interactive: true,
    variant: 'elevated',
    children: (
      <>
        <Card.Header>
          <span className="text-base font-semibold text-neutral-900">Open dashboard</span>
        </Card.Header>
        <Card.Body>Click or press Enter to continue.</Card.Body>
      </>
    ),
  },
};
