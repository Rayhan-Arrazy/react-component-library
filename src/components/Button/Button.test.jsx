import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button.jsx';

describe('Button', () => {
  test('renders its label', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  test('fires onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('does not fire onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  test('fires onClick with the mouse event payload', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Go</Button>);

    await user.click(screen.getByRole('button', { name: 'Go' }));

    expect(onClick.mock.calls[0][0]).toMatchObject({ type: 'click' });
  });

  test('is operable from the keyboard (Enter activates)', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Submit</Button>);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('loading state is announced with aria-busy and swallows clicks', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Button loading onClick={onClick}>
        Saving
      </Button>,
    );

    const button = screen.getByRole('button', { name: /Saving/ });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByTestId('button-spinner')).toBeInTheDocument();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  test('defaults to type="button" so it never submits forms accidentally', () => {
    render(<Button>Cancel</Button>);
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveAttribute('type', 'button');
  });

  test('supports type="submit" for form usage', () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'submit');
  });

  test('applies variant and size classes', () => {
    const { container } = render(
      <Button variant="danger" size="lg">
        Delete
      </Button>,
    );
    const button = container.querySelector('button');
    expect(button.className).toContain('bg-danger-600');
    expect(button.className).toContain('h-11');
  });

  test('fullWidth stretches the button', () => {
    const { container } = render(<Button fullWidth>Wide</Button>);
    expect(container.querySelector('button').className).toContain('w-full');
  });

  test('forwards the ref to the underlying button element', () => {
    const ref = { current: null };
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveTextContent('Ref');
  });

  test('renders start and end icons around the label, hidden from AT', () => {
    render(
      <Button
        startIcon={<svg data-testid="start-icon" />}
        endIcon={<svg data-testid="end-icon" />}
      >
        Next
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Next' });
    const start = within(button).getByTestId('start-icon');
    const end = within(button).getByTestId('end-icon');

    // Decorative icons are announced neither as text nor as images.
    expect(start.parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(end.parentElement).toHaveAttribute('aria-hidden', 'true');

    // Order: start icon → label → end icon.
    const nodes = Array.from(button.childNodes);
    expect(nodes[0]).toBe(start.parentElement);
    expect(nodes[1]).toHaveTextContent('Next');
    expect(nodes[2]).toBe(end.parentElement);
  });

  test('hides the start icon while loading (spinner takes over)', () => {
    render(
      <Button loading startIcon={<svg data-testid="start-icon" />}>
        Saving
      </Button>,
    );

    expect(screen.getByTestId('button-spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('start-icon')).not.toBeInTheDocument();
  });
});
