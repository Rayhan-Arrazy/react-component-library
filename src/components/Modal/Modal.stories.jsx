import { useState } from 'react';
import { Modal } from './Modal.jsx';
import { Button } from '../Button/Button.jsx';

/**
 * Modal stories render through a harness that owns the open state and shows
 * the trigger button, mirroring how the dialog is used in a real screen.
 */
function ModalHarness({ triggerLabel = 'Open dialog', ...args }) {
  const [open, setOpen] = useState(args.defaultOpen ?? false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>{triggerLabel}</Button>
      <Modal
        {...args}
        open={open}
        onClose={(event) => {
          args.onClose?.(event);
          setOpen(false);
        }}
      />
    </>
  );
}

/** @type {import('@storybook/react').Meta<typeof Modal>} */
const meta = {
  component: Modal,
  tags: ['autodocs'],
  title: 'Components/Modal',
  parameters: {
    docs: {
      description: {
        component:
          'Accessible dialog rendered in a portal: labelled via its title, focus trapped while open, `Escape` and overlay click close it, and focus returns to the trigger on close.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    closeOnOverlayClick: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    showCloseButton: { control: 'boolean' },
    onClose: { action: 'closed' },
  },
};

export default meta;

/** @type {import('@storybook/react').StoryObj<typeof Modal>} */
export const Default = {
  render: (args) => <ModalHarness {...args} />,
  args: {
    title: 'Delete project',
    size: 'md',
    children: (
      <p>
        This permanently removes <strong>Project Aurora</strong> and all of its builds. This action
        cannot be undone.
      </p>
    ),
    footer: (
      <div className="flex gap-3">
        <Button variant="secondary">Cancel</Button>
        <Button variant="danger">Delete</Button>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: { story: 'Open the dialog to try Escape, Tab trapping and focus restore.' },
    },
  },
};

/** @type {import('@storybook/react').StoryObj<typeof Modal>} */
export const Small = {
  render: (args) => <ModalHarness {...args} />,
  args: {
    ...Default.args,
    size: 'sm',
    title: 'Confirm',
    children: <p>Re-run the failing build?</p>,
    footer: (
      <div className="flex gap-3">
        <Button variant="secondary">Cancel</Button>
        <Button>Re-run</Button>
      </div>
    ),
  },
};

/** @type {import('@storybook/react').StoryObj<typeof Modal>} */
export const Large = {
  render: (args) => <ModalHarness {...args} />,
  args: {
    ...Default.args,
    size: 'lg',
    title: 'Invite teammates',
    children: (
      <div className="flex flex-col gap-3">
        <p>Share this workspace with your team. They will receive an email invitation.</p>
        <ul className="list-disc pl-5">
          <li>Editors can change components</li>
          <li>Viewers can read documentation only</li>
        </ul>
      </div>
    ),
  },
};

/** @type {import('@storybook/react').StoryObj<typeof Modal>} */
export const WithoutCloseButton = {
  render: (args) => <ModalHarness {...args} />,
  args: {
    ...Default.args,
    title: 'Installation in progress',
    showCloseButton: false,
    closeOnOverlayClick: false,
    closeOnEscape: false,
    children: <p>Keep this window open until the migration finishes.</p>,
    footer: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'Closing can be disabled per interaction while the dialog stays accessible.',
      },
    },
  },
};
