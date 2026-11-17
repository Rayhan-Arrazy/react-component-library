import { useRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal.jsx';

function Harness({ title = 'Delete project', ...modalProps }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Open dialog
      </button>
      <Modal
        {...modalProps}
        open={open}
        onClose={() => setOpen(false)}
        title={title}
      >
        <p>Body content</p>
      </Modal>
    </div>
  );
}

describe('Modal', () => {
  test('renders nothing while closed', () => {
    render(<Modal open={false} title="Hidden">Body</Modal>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('exposes a labelled dialog when open', () => {
    render(
      <Modal open title="Delete project">
        <p>Are you sure?</p>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Delete project' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  test('moves focus into the dialog on open', () => {
    render(
      <Modal open title="Confirm">
        <p>Body</p>
      </Modal>,
    );

    // The header close button is the first focusable element.
    expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveFocus();
  });

  test('closes on Escape', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <Modal open onClose={onClose} title="Confirm">
        <p>Body</p>
      </Modal>,
    );

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('can disable Escape closing', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <Modal open onClose={onClose} title="Confirm" closeOnEscape={false}>
        <p>Body</p>
      </Modal>,
    );

    await user.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });

  test('closes when the overlay is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const { container } = render(
      <Modal open onClose={onClose} title="Confirm">
        <p>Body</p>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    await user.click(dialog.parentElement);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(container).toBeInTheDocument();
  });

  test('does not close when the dialog content itself is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <Modal open onClose={onClose} title="Confirm">
        <p>Body</p>
      </Modal>,
    );

    await user.click(screen.getByText('Body'));
    expect(onClose).not.toHaveBeenCalled();
  });

  test('the header close button closes the dialog', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <Modal open onClose={onClose} title="Confirm">
        <p>Body</p>
      </Modal>,
    );

    await user.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('traps Tab inside the dialog', async () => {
    const user = userEvent.setup();
    render(
      <Modal open title="Confirm">
        <button type="button">Inner action</button>
      </Modal>,
    );

    const closeButton = screen.getByRole('button', { name: 'Close dialog' });
    const inner = screen.getByRole('button', { name: 'Inner action' });

    expect(closeButton).toHaveFocus();

    // Tab moves forward inside the dialog...
    await user.tab();
    expect(inner).toHaveFocus();

    // ...and wraps back to the first focusable element instead of escaping.
    await user.tab();
    expect(closeButton).toHaveFocus();

    // Shift+Tab wraps the other way.
    await user.tab({ shift: true });
    expect(inner).toHaveFocus();
  });

  test('returns focus to the trigger after closing', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const trigger = screen.getByRole('button', { name: 'Open dialog' });
    await user.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  test('locks background scrolling while open and restores it after', () => {
    const { rerender } = render(<Modal open title="Confirm">Body</Modal>);
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<Modal open={false} title="Confirm">Body</Modal>);
    expect(document.body.style.overflow).toBe('');
  });

  test('renders footer actions', () => {
    render(
      <Modal
        open
        title="Confirm"
        footer={
          <button type="button">Confirm</button>
        }
      >
        Body
      </Modal>,
    );
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
  });

  test('falls back to aria-label when no title is provided', () => {
    render(<Modal open>Untitled</Modal>);
    expect(screen.getByRole('dialog', { name: 'Dialog' })).toBeInTheDocument();
  });

  test('keeps focus on the dialog when it contains nothing focusable', async () => {
    const user = userEvent.setup();
    render(
      <Modal open showCloseButton={false} title="Empty">
        <p>No controls here</p>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    dialog.focus();
    expect(dialog).toHaveFocus();

    await user.tab();
    expect(dialog).toHaveFocus();
  });

  test('focuses initialFocusRef instead of the first focusable element', () => {
    function FocusHarness() {
      const fieldRef = useRef(null);
      return (
        <Modal open title="Form" initialFocusRef={fieldRef} showCloseButton={false}>
          <button type="button">Before</button>
          <input ref={fieldRef} aria-label="Target field" />
          <button type="button">After</button>
        </Modal>
      );
    }

    render(<FocusHarness />);
    expect(screen.getByRole('textbox', { name: 'Target field' })).toHaveFocus();
  });
});
