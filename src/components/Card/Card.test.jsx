import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card } from './Card.jsx';

describe('Card', () => {
  test('renders children', () => {
    render(<Card>Plain content</Card>);
    expect(screen.getByText('Plain content')).toBeInTheDocument();
  });

  test('renders as a div by default', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild.tagName).toBe('DIV');
  });

  test('composes with header, body and footer regions', () => {
    render(
      <Card>
        <Card.Header>Project Aurora</Card.Header>
        <Card.Body>Ships in Q3.</Card.Body>
        <Card.Footer>Updated 2 days ago</Card.Footer>
      </Card>,
    );

    expect(screen.getByText('Project Aurora')).toBeInTheDocument();
    expect(screen.getByText('Ships in Q3.')).toBeInTheDocument();
    expect(screen.getByText('Updated 2 days ago')).toBeInTheDocument();
  });

  test('renders media region', () => {
    render(
      <Card>
        <Card.Media>
          <img src="cover.png" alt="Cover" />
        </Card.Media>
      </Card>,
    );
    expect(screen.getByRole('img', { name: 'Cover' })).toBeInTheDocument();
  });

  test('interactive card renders as a button and fires onClick', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Card interactive onClick={onClick}>
        <Card.Body>Open project</Card.Body>
      </Card>,
    );

    const card = screen.getByRole('button', { name: 'Open project' });
    await user.click(card);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(card).toHaveAttribute('type', 'button');
  });

  test('interactive card is keyboard operable', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Card interactive onClick={onClick}>
        Open project
      </Card>,
    );

    await user.tab();
    expect(screen.getByRole('button', { name: 'Open project' })).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('applies the requested variant classes', () => {
    const { container } = render(<Card variant="outlined">Outlined</Card>);
    expect(container.firstChild.className).toContain('border-neutral-200');
    expect(container.firstChild.className).not.toContain('shadow-card');
  });

  test('merges custom className', () => {
    const { container } = render(<Card className="mt-4">Content</Card>);
    expect(container.firstChild.className).toContain('mt-4');
  });
});
