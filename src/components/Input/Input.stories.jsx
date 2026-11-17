import { Input } from './Input.jsx';

/** @type {import('@storybook/react').Meta<typeof Input>} */
const meta = {
  component: Input,
  tags: ['autodocs'],
  title: 'Components/Input',
  parameters: {
    docs: {
      description: {
        component:
          'Labelled text field. Labels are bound with `htmlFor`, hints/errors are linked through `aria-describedby`, and errors set `aria-invalid`.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
  },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
};

export default meta;

/** @type {import('@storybook/react').StoryObj<typeof Input>} */
export const Default = {
  args: { label: 'Email', placeholder: 'you@company.com' },
};

/** @type {import('@storybook/react').StoryObj<typeof Input>} */
export const WithHint = {
  args: {
    label: 'Password',
    type: 'password',
    hint: 'At least 8 characters, including a number.',
  },
};

/** @type {import('@storybook/react').StoryObj<typeof Input>} */
export const WithError = {
  args: {
    label: 'Email',
    type: 'email',
    defaultValue: 'not-an-email',
    error: 'Enter a valid email address.',
  },
  parameters: {
    docs: {
      description: { story: 'Errors replace the hint and are announced via `aria-describedby`.' },
    },
  },
};

/** @type {import('@storybook/react').StoryObj<typeof Input>} */
export const Required = {
  args: { label: 'Full name', required: true, hint: 'As it appears on your ID.' },
};

/** @type {import('@storybook/react').StoryObj<typeof Input>} */
export const Disabled = {
  args: { label: 'Organisation', value: 'Elevvo Labs', disabled: true },
};

/** @type {import('@storybook/react').StoryObj<typeof Input>} */
export const Large = {
  args: { label: 'Search', type: 'search', size: 'lg', placeholder: 'Search components…' },
};

/** @type {import('@storybook/react').StoryObj<typeof Input>} */
export const WithAffixes = {
  args: {
    label: 'Price (USD)',
    prefix: '$',
    suffix: 'USD',
    defaultValue: '49.00',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Prefix/suffix sit inside the field and are decorative — include the unit in the label so screen readers announce it.',
      },
    },
  },
};

/** @type {import('@storybook/react').StoryObj<typeof Input>} */
export const FormExample = {
  parameters: {
    docs: {
      description: { story: 'Typical form usage: label, hint, and a submit button.' },
    },
  },
  render: () => (
    <form className="flex w-80 flex-col gap-4" onSubmit={(event) => event.preventDefault()}>
      <Input label="Work email" type="email" hint="We only use this for receipts." required />
      <Input label="Company" placeholder="Acme Inc." />
      <button
        type="submit"
        className="h-10 rounded-lg bg-brand-600 text-sm font-medium text-white hover:bg-brand-700"
      >
        Create account
      </button>
    </form>
  ),
};
