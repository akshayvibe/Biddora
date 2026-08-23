export function StatusBadge({ status }) {
  const cls = status === 'OPEN' ? 'badge-open'
    : status === 'SCHEDULED' ? 'badge-scheduled'
    : 'badge-closed';

  return (
    <span className={`badge ${cls}`}>
      <span className="badge-dot"></span>
      {status}
    </span>
  );
}

export function formatPrice(amount) {
  if (amount == null) return '—';
  return `$${Number(amount).toLocaleString()}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function TimeRemaining({ endTime }) {
  if (!endTime) return null;
  const end = new Date(endTime);
  const now = new Date();
  const diff = end - now;
  if (diff <= 0) return <span className="mono text-muted">Ended</span>;

  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return <span className="mono">{days}d {hours % 24}h</span>;
  }
  return <span className="mono">{hours}h {mins}m</span>;
}
