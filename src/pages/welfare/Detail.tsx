import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getConcern, setConcernStatus, welfareSendReply } from '../../lib/api';
import { categoryLabel } from '../../lib/categories';
import { STATUS_META } from '../../lib/statusMeta';
import type { InboxItem, Thread } from '../../lib/types';

export default function Detail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [concern, setConcern] = useState<InboxItem | null>(null);
  const [replies, setReplies] = useState<Thread['replies']>([]);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    try {
      const { concern, replies } = await getConcern(id);
      setConcern(concern);
      setReplies(replies);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load this concern.');
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSend() {
    const text = replyText.trim();
    if (!text) return;
    setSending(true);
    setError('');
    try {
      await welfareSendReply(id, text);
      setReplyText('');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send the reply.');
    } finally {
      setSending(false);
    }
  }

  async function handleStatus(status: 'answered' | 'resolved') {
    setUpdatingStatus(true);
    setError('');
    try {
      await setConcernStatus(id, status);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update the status.');
    } finally {
      setUpdatingStatus(false);
    }
  }

  if (error && !concern) {
    return (
      <>
        <div className="app-header">
          <a href="#" className="app-header-back" onClick={(e) => { e.preventDefault(); navigate('/welfare'); }}>
            ‹
          </a>
          <h3>Concern</h3>
        </div>
        <p className="error-text" style={{ padding: '16px 20px' }}>{error}</p>
      </>
    );
  }

  if (!concern) return <div className="center-loading">Loading…</div>;

  const status = STATUS_META[concern.status];

  return (
    <>
      <div className="app-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="#" className="app-header-back" onClick={(e) => { e.preventDefault(); navigate('/welfare'); }}>
            ‹
          </a>
          <h3 style={{ fontVariantNumeric: 'tabular-nums' }}>{concern.code}</h3>
        </div>
        <div className="app-header-meta" style={{ marginTop: 0 }}>
          <span className="tag tag-neutral">{categoryLabel(concern.category)}</span>
          <span className={status.className}>{status.label}</span>
        </div>
      </div>
      <div className="thread">
        <div className="msg-row is-theirs">
          <div className="msg-bubble is-theirs">{concern.message}</div>
        </div>
        {replies.map((m, i) => {
          const mine = m.sender === 'welfare';
          return (
            <div key={i} className={`msg-row ${mine ? 'is-mine' : 'is-theirs'}`}>
              <div className={`msg-bubble ${mine ? 'is-mine' : 'is-theirs'}`}>{m.message}</div>
            </div>
          );
        })}
      </div>
      {error && <p className="error-text" style={{ padding: '0 16px' }}>{error}</p>}
      <div className="detail-actions">
        {concern.status === 'resolved' ? (
          <button className="btn btn-secondary btn-block" disabled={updatingStatus} onClick={() => handleStatus('answered')}>
            Reopen thread
          </button>
        ) : (
          <button className="btn btn-secondary btn-block" disabled={updatingStatus} onClick={() => handleStatus('resolved')}>
            Mark resolved
          </button>
        )}
      </div>
      <div className="composer" style={{ padding: '0 16px 22px' }}>
        <textarea
          className="input"
          rows={1}
          placeholder="Reply privately…"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <button className="btn btn-primary" disabled={!replyText.trim() || sending} onClick={handleSend}>
          {sending ? 'Sending…' : 'Send'}
        </button>
      </div>
    </>
  );
}
