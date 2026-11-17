import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input.jsx';

describe('Input', () => {
  test('associates the label with the field', () => {
    render(<Input label="Email" />);
    const input = screen.getByLabelText(/^Email/);
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
    expect(screen.getByRole('textbox', { name: /Email/ })).toBe(input);
  });

  test('typing updates the value through onChange', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Input label="Email" onChange={onChange} />);

    await user.type(screen.getByLabelText(/^Email/), 'dev@elevvo.com');

    expect(onChange).toHaveBeenCalled();
    expect(screen.getByLabelText(/^Email/)).toHaveValue('dev@elevvo.com');
  });

  test('shows hint text and links it with aria-describedby', () => {
    render(<Input label="Password" hint="At least 8 characters" />);

    const input = screen.getByLabelText(/^Password/);
    const hint = screen.getByText('At least 8 characters');

    expect(input).toHaveAttribute('aria-describedby', hint.id);
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  test('error state sets aria-invalid and describes the error message', () => {
    render(<Input label="Email" error="Enter a valid email" />);

    const input = screen.getByLabelText(/^Email/);
    const error = screen.getByText('Enter a valid email');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', error.id);
  });

  test('error message replaces the hint', () => {
    render(<Input label="Email" hint="We never share it" error="Required field" />);

    expect(screen.getByText('Required field')).toBeInTheDocument();
    expect(screen.queryByText('We never share it')).not.toBeInTheDocument();
  });

  test('required fields expose the required attribute', () => {
    render(<Input label="Email" required />);
    expect(screen.getByLabelText(/^Email/)).toBeRequired();
  });

  test('disabled fields are actually disabled', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Input label="Email" disabled onChange={onChange} />);

    const input = screen.getByLabelText(/^Email/);
    expect(input).toBeDisabled();

    await user.type(input, 'nope');
    expect(onChange).not.toHaveBeenCalled();
  });

  test('supports custom ids and native input props', () => {
    render(<Input label="Search" id="site-search" type="search" placeholder="Query" />);
    const input = screen.getByLabelText(/^Search/);
    expect(input).toHaveAttribute('id', 'site-search');
    expect(input).toHaveAttribute('type', 'search');
    expect(input).toHaveAttribute('placeholder', 'Query');
  });

  test('renders the large size class', () => {
    const { container } = render(<Input label="Name" size="lg" />);
    expect(container.querySelector('input').className).toContain('h-11');
  });

  test('renders prefix and suffix adornments and pads the field', () => {
    render(<Input label="Price" prefix="$" suffix="USD" />);

    const input = screen.getByLabelText(/^Price/);
    const prefix = screen.getByText('$');
    const suffix = screen.getByText('USD');

    expect(prefix).toHaveAttribute('aria-hidden', 'true');
    expect(suffix).toHaveAttribute('aria-hidden', 'true');
    expect(input.className).toContain('pl-8');
    expect(input.className).toContain('pr-8');
  });

  test('prefix does not change the accessible label', async () => {
    const user = userEvent.setup();
    render(<Input label="Amount" prefix="$" />);

    const input = screen.getByRole('textbox', { name: /^Amount$/ });
    await user.type(input, '25');
    expect(input).toHaveValue('25');
  });
});
