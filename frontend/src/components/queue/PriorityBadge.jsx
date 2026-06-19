export default function PriorityBadge({ level }) {
  if (!level) return null;
  return <span className={`priority-badge priority-badge--${level.toLowerCase()}`}>{level}</span>;
}
