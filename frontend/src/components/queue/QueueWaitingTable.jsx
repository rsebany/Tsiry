export default function QueueWaitingTable({ columns, children, emptyMessage }) {
  if (!children || (Array.isArray(children) && children.length === 0)) {
    return emptyMessage ? <p className="empty-queue">{emptyMessage}</p> : null;
  }

  return (
    <div className="queue-table-wrap">
      <table className="queue-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
