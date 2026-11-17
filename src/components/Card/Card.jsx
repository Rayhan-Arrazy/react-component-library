import { cx } from '../../utils/cx.js';

const VARIANT_CLASSES = {
  elevated: 'bg-white border border-neutral-200 shadow-card',
  outlined: 'bg-white border border-neutral-200',
  filled: 'bg-neutral-50 border border-neutral-200',
};

const BASE_CLASSES = 'rounded-card overflow-hidden text-neutral-900';

/**
 * Card — surface that groups related content.
 *
 * Compose it from the attached subcomponents: `Card.Header`, `Card.Media`,
 * `Card.Body`, `Card.Footer`.
 *
 * @example
 * <Card>
 *   <Card.Header>Title</Card.Header>
 *   <Card.Body>Body copy</Card.Body>
 * </Card>
 *
 * @param {object} props
 * @param {'elevated'|'outlined'|'filled'} [props.variant='elevated'] Surface treatment.
 * @param {boolean} [props.interactive=false] Renders the whole card as a `<button>` (do not nest other controls inside).
 * @param {React.MouseEventHandler} [props.onClick] Click handler (most useful with `interactive`).
 * @param {string} [props.className] Extra class names.
 * @param {React.ReactNode} [props.children] Card content.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.rest] Native div props.
 */
export function Card({
  variant = 'elevated',
  interactive = false,
  className,
  children,
  onClick,
  ...rest
}) {
  const Tag = interactive ? 'button' : 'div';

  return (
    <Tag
      {...(interactive ? { type: 'button' } : null)}
      onClick={onClick}
      className={cx(
        BASE_CLASSES,
        VARIANT_CLASSES[variant],
        interactive &&
          'w-full text-left ui-focus-ring cursor-pointer transition-shadow hover:shadow-card-hover',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * Card header region — typically a title and optional actions.
 * @param {object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.children]
 */
function CardHeader({ className, children, ...rest }) {
  return (
    <div className={cx('flex items-center justify-between gap-3 px-5 pt-5', className)} {...rest}>
      {children}
    </div>
  );
}
CardHeader.displayName = 'Card.Header';

/**
 * Card media region — an image or illustration area.
 * @param {object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.children]
 */
function CardMedia({ className, children, ...rest }) {
  return (
    <div className={cx('aspect-video w-full overflow-hidden bg-neutral-100', className)} {...rest}>
      {children}
    </div>
  );
}
CardMedia.displayName = 'Card.Media';

/**
 * Card body region — the main content.
 * @param {object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.children]
 */
function CardBody({ className, children, ...rest }) {
  return (
    <div className={cx('px-5 py-4 text-sm text-neutral-600', className)} {...rest}>
      {children}
    </div>
  );
}
CardBody.displayName = 'Card.Body';

/**
 * Card footer region — metadata or secondary actions.
 * @param {object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.children]
 */
function CardFooter({ className, children, ...rest }) {
  return (
    <div
      className={cx('flex items-center gap-3 border-t border-neutral-200 px-5 py-4', className)}
      {...rest}
    >
      {children}
    </div>
  );
}
CardFooter.displayName = 'Card.Footer';

Card.Header = CardHeader;
Card.Media = CardMedia;
Card.Body = CardBody;
Card.Footer = CardFooter;

export { CardHeader, CardMedia, CardBody, CardFooter };
