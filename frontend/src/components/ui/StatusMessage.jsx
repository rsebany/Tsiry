const VARIANT_CLASS = {
  loading: 'status--loading',
  error: 'status--error',
  ok: 'status--ok',
};

export default function StatusMessage({ variant = 'loading', message, hint, children, className = '' }) {
  const content = children ?? message;
  if (!content && !hint) return null;

  return (
    <p className={`status ${VARIANT_CLASS[variant] || ''} ${className}`.trim()}>
      {content}
      {hint && <span className="status-hint">{hint}</span>}
    </p>
  );
}
