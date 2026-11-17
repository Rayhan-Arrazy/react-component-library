import { forwardRef, useId } from 'react';
import { cx } from '../../utils/cx.js';

const SIZE_CLASSES = {
  sm: 'h-8 px-3 text-sm rounded-md',
  md: 'h-10 px-3 text-sm rounded-lg',
  lg: 'h-11 px-3.5 text-base rounded-lg',
};

const BASE_INPUT_CLASSES =
  'w-full border bg-white text-neutral-900 placeholder:text-neutral-400 ui-focus-ring disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500';

const STATE_CLASSES = {
  idle: 'border-neutral-300 hover:border-neutral-400 focus:border-brand-500',
  error: 'border-danger-500 hover:border-danger-600 focus:border-danger-500',
};

const AFFIX_PADDING = {
  sm: { prefix: 'pl-7', suffix: 'pr-7' },
  md: { prefix: 'pl-8', suffix: 'pr-8' },
  lg: { prefix: 'pl-9', suffix: 'pr-9' },
};

/**
 * Input — labelled text field with hint and error support.
 *
 * Accessibility: the `<label>` is associated via `htmlFor`, hints and error
 * messages are linked with `aria-describedby`, and invalid values are exposed
 * through `aria-invalid`.
 *
 * @example
 * <Input label="Email" type="email" error="Enter a valid email" required />
 *
 * @param {object} props
 * @param {string} props.label Visible field label.
 * @param {string} [props.hint] Helper text rendered under the field.
 * @param {string} [props.error] Error message. When set it replaces the hint and the field becomes `aria-invalid`.
 * @param {'text'|'email'|'password'|'number'|'search'|'tel'|'url'} [props.type='text'] Native input type.
 * @param {'sm'|'md'|'lg'} [props.size='md'] Field height.
 * @param {string|React.ReactNode} [props.prefix] Static text shown inside the field, before the value (decorative — include the unit in `label` so it is announced).
 * @param {string|React.ReactNode} [props.suffix] Static text shown inside the field, after the value (decorative).
 * @param {boolean} [props.required=false] Marks the field as required.
 * @param {boolean} [props.disabled=false] Disables the field.
 * @param {string} [props.id] Custom id. Auto-generated when omitted.
 * @param {string} [props.className] Extra class names for the `<input>`.
 * @param {React.InputHTMLAttributes<HTMLInputElement>} [props.rest] Any native input props (value, onChange, placeholder, ...).
 * @param {React.Ref<HTMLInputElement>} ref Forwarded to the underlying `<input>`.
 */
export const Input = forwardRef(function Input(
  {
    label,
    hint,
    error,
    type = 'text',
    size = 'md',
    prefix,
    suffix,
    required = false,
    disabled = false,
    id,
    className,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const describedBy = cx(error ? errorId : hint && hintId) || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-neutral-700"
        >
          {label}
          {required && (
            <span className="ml-0.5 text-danger-600" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        {prefix && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-neutral-500"
          >
            {prefix}
          </span>
        )}

        <input
          {...rest}
          ref={ref}
          id={inputId}
          type={type}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cx(
            BASE_INPUT_CLASSES,
            SIZE_CLASSES[size],
            error ? STATE_CLASSES.error : STATE_CLASSES.idle,
            prefix && AFFIX_PADDING[size].prefix,
            suffix && AFFIX_PADDING[size].suffix,
            className,
          )}
        />

        {suffix && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-neutral-500"
          >
            {suffix}
          </span>
        )}
      </div>

      {error ? (
        <p id={errorId} className="text-sm text-danger-600">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="text-sm text-neutral-500">
            {hint}
          </p>
        )
      )}
    </div>
  );
});

Input.displayName = 'Input';
