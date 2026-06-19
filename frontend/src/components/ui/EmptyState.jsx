export default function EmptyState({ message, className = 'empty-queue' }) {
  return <p className={className}>{message}</p>;
}
