export default function QueueStats({ en_attente, appele, cloture }) {
  return (
    <div className="file-attente-stats">
      <span className="stat stat--wait">{en_attente} en attente</span>
      <span className="stat stat--called">{appele} en cours</span>
      <span className="stat stat--done">{cloture} terminés</span>
    </div>
  );
}
