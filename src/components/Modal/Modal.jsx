import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx.js';
import { getFocusableElements } from '../../utils/focus.js';

const SIZE_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

/**
 * Modal — accessible dialog rendered in a portal.
 *
 * Behaviour:
 * - `role="dialog"` + `aria-modal` + an accessible name (from `title`)
 * - focus moves into the dialog on open and returns to the trigger on close
 * - `Tab` / `Shift+Tab` are trapped inside the dialog
 * - `Escape` and overlay click close it (both configurable)
 * - background scrolling is locked while open
 * - opens with a subtle fade/rise animation (skipped under `prefers-reduced-motion`)
 *
 * @example
 * <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Delete project">
 *   <p>Are you sure?</p>
 * </Modal>
 *
 * @param {object} props
 * @param {boolean} [props.open=false] Whether the dialog is visible.
 * @param {React.ReactEventHandler} [props.onClose] Called when the user requests to close (Escape, overlay, close button).
 * @param {string} [props.title] Dialog title. Rendered as the accessible name via `aria-labelledby`.
 * @param {React.ReactNode} [props.children] Dialog body content.
 * @param {React.ReactNode} [props.footer] Footer content (e.g. action buttons).
 * @param {'sm'|'md'|'lg'} [props.size='md'] Maximum width of the dialog.
 * @param {boolean} [props.closeOnOverlayClick=true] Close when the backdrop is clicked.
 * @param {boolean} [props.closeOnEscape=true] Close when `Escape` is pressed.
 * @param {boolean} [props.showCloseButton=true] Show the header close button.
 * @param {React.RefObject<HTMLElement>} [props.initialFocusRef] Element focused when the dialog opens (defaults to the first focusable element).
 * @param {string} [props.className] Extra class names for the dialog panel.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.rest] Native div props for the panel.
 */
export function Modal({
  open = false,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  initialFocusRef,
  className,
  ...rest
}) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const hasTitle = Boolean(title);

  // Move focus into the dialog on open, restore it on close.
  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const dialog = dialogRef.current;
    const target = initialFocusRef?.current ?? getFocusableElements(dialog)[0] ?? dialog;
    target?.focus();

    return () => {
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [open, initialFocusRef]);

  // Escape + Tab trap.
  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape' && closeOnEscape) {
        event.stopPropagation();
        onClose?.(event);
        return;
      }

      if (event.key !== 'Tab') return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = getFocusableElements(dialog);
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const inside = dialog.contains(active);

      if (event.shiftKey) {
        if (!inside || active === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (!inside || active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, closeOnEscape, onClose]);

  // Lock background scroll while open.
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  function handleOverlayMouseDown(event) {
    if (!closeOnOverlayClick) return;
    if (event.target === event.currentTarget) onClose?.(event);
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 p-4 motion-reduce:animate-none animate-modal-backdrop"
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        {...rest}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={hasTitle ? titleId : undefined}
        aria-label={hasTitle ? undefined : 'Dialog'}
        tabIndex={-1}
        className={cx(
          'max-h-[calc(100vh-2rem)] w-full overflow-y-auto rounded-xl bg-white p-6 shadow-2xl outline-none motion-reduce:animate-none animate-modal-panel',
          SIZE_CLASSES[size],
          className,
        )}
      >
        {(hasTitle || showCloseButton) && (
          <div className="mb-4 flex items-start justify-between gap-4">
            {hasTitle && (
              <h2 id={titleId} className="text-lg font-semibold text-neutral-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                aria-label="Close dialog"
                onClick={onClose}
                className="ui-focus-ring -m-1.5 rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-5 w-5"
                >
                  <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="text-sm text-neutral-600">{children}</div>

        {footer && (
          <div className="mt-6 flex justify-end gap-3 border-t border-neutral-200 pt-4">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  );
}

Modal.displayName = 'Modal';
