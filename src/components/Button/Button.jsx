import { forwardRef } from 'react';
import { cx } from '../../utils/cx.js';

const VARIANT_CLASSES = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 focus-visible:outline-brand-600',
  secondary:
    'bg-white text-neutral-800 border border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100',
  ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200',
  danger: 'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800',
};

const SIZE_CLASSES = {
  sm: 'h-8 px-3 text-sm rounded-md gap-1.5',
  md: 'h-10 px-4 text-sm rounded-lg gap-2',
  lg: 'h-11 px-5 text-base rounded-lg gap-2',
};

const BASE_CLASSES =
  'inline-flex items-center justify-center font-medium select-none transition-colors ui-focus-ring disabled:cursor-not-allowed';

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      data-testid="button-spinner"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.3" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Button — the primary interactive element of the design system.
 *
 * @example
 * <Button variant="primary" onClick={() => save()}>Save</Button>
 *
 * @param {object} props
 * @param {'primary'|'secondary'|'ghost'|'danger'} [props.variant='primary'] Visual style.
 * @param {'sm'|'md'|'lg'} [props.size='md'] Control height and padding.
 * @param {boolean} [props.disabled=false] Disables the button (native `disabled` attribute).
 * @param {boolean} [props.loading=false] Marks the button as busy (`aria-busy`), shows a spinner and swallows clicks.
 * @param {boolean} [props.fullWidth=false] Stretches the button to the container width.
 * @param {'button'|'submit'|'reset'} [props.type='button'] Native button type (defaults to `button` so it never submits a form by accident).
 * @param {React.ReactNode} [props.startIcon] Icon rendered before the label (decorative — hidden from assistive tech).
 * @param {React.ReactNode} [props.endIcon] Icon rendered after the label (decorative — hidden from assistive tech).
 * @param {React.MouseEventHandler} [props.onClick] Click handler. Not called while `disabled` or `loading`.
 * @param {string} [props.className] Extra class names appended to the component classes.
 * @param {React.ReactNode} [props.children] Button content.
 * @param {React.Ref<HTMLButtonElement>} ref Forwarded to the underlying `<button>`.
 */
export const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    loading = false,
    fullWidth = false,
    startIcon,
    endIcon,
    className,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  const isInactive = disabled || loading;

  function handleClick(event) {
    if (isInactive) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  }

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      className={cx(
        BASE_CLASSES,
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && 'w-full',
        isInactive && 'pointer-events-none opacity-60',
        className,
      )}
      onClick={handleClick}
    >
      {loading && <Spinner />}
      {!loading && startIcon && (
        <span className="inline-flex shrink-0 items-center" aria-hidden="true">
          {startIcon}
        </span>
      )}
      {children}
      {endIcon && (
        <span className="inline-flex shrink-0 items-center" aria-hidden="true">
          {endIcon}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';
