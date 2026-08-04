import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listConcerns } from '../../lib/api';
import { categoryLabel } from '../../lib/categories';
import { STATUS_META } from '../../lib/statusMeta';
import { supabase } from '../../lib/supabase';
import type { ConcernStatus, InboxItem } from '../../lib/types';

type Filter = 'all' | 'needs_reply' | 'resolved';

const STATUS_ORDER: Record<ConcernStatus, number> = { needs_reply: 0, answered: 1, resolved: 2 };

function timeAgo(iso: string): string {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Inbox() {
  const navigate = useNavigate();
  const [items, setItems] = useState<InboxItem[] | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  async function load() {
    try {
      const data = await listConcerns();
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load the inbox.');
    }
  }

  useEffect(() => {
    load();
  }, []);

  const sorted = useMemo(() => {
    if (!items) return [];
    return [...items].sort(
      (a, b) =>
        STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [items]);

  const filtered = sorted.filter((c) => {
    if (filter === 'needs_reply') return c.status === 'needs_reply';
    if (filter === 'resolved') return c.status === 'resolved';
    return true;
  });

  const needsReplyCount = sorted.filter((c) => c.status === 'needs_reply').length;

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/welfare/login', { replace: true });
  }

  return (
    <>
      <div className="inbox-toolbar">
        <div className="inbox-toolbar-row">
          <h3 style={{ margin: 0, fontSize: 22 }}>Welfare inbox</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {needsReplyCount > 0 && <span className="tag tag-accent">{needsReplyCount} new</span>}
            <a href="#" style={{ fontSize: 13 }} onClick={(e) => { e.preventDefault(); handleLogout(); }}>
              Log out
            </a>
          </div>
        </div>
        <div className="filter-row">
          <div className={`filter-chip${filter === 'all' ? ' is-active' : ''}`} onClick={() => setFilter('all')}>
            All
          </div>
          <div
            className={`filter-chip${filter === 'needs_reply' ? ' is-active' : ''}`}
            onClick={() => setFilter('needs_reply')}
          >
            Needs reply
          </div>
          <div
            className={`filter-chip${filter === 'resolved' ? ' is-active' : ''}`}
            onClick={() => setFilter('resolved')}
          >
            Resolved
          </div>
        </div>
      </div>
      <div className="inbox-list">
        {error && <p className="error-text" style={{ padding: '16px 20px' }}>{error}</p>}
        {items && filtered.length === 0 && (
          <div className="thread-empty">No concerns here yet.</div>
        )}
        {filtered.map((item) => {
          const status = STATUS_META[item.status];
          const snippet = item.message.length > 72 ? item.message.slice(0, 72) + '…' : item.message;
          return (
            <button key={item.id} className="inbox-item" onClick={() => navigate(`/welfare/c/${item.id}`)}>
              <div className="inbox-item-row">
                <span className="tag tag-neutral">{categoryLabel(item.category)}</span>
                <span className={status.className}>{status.label}</span>
              </div>
              <div className="inbox-item-snippet">{snippet}</div>
              <div className="inbox-item-meta">
                {item.code} · {timeAgo(item.created_at)}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
