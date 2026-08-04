import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addStudentReply, getThreadByCode } from '../../lib/api';
import { categoryLabel } from '../../lib/categories';
import { STATUS_META } from '../../lib/statusMeta';
import type { Thread as ThreadType } from '../../lib/types';

export default function Thread() {
  const { code = '' } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState<ThreadType | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [followUp, setFollowUp] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    try {
      const t = await getThreadByCode(code);
      if (t) setThread(t);
      else setNotFound(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load this thread.');
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  async function handleSend() {
    const text = followUp.trim();
    if (!text) return;
    setSending(true);
    setError('');
    try {
      await addStudentReply(code, text);
      setFollowUp('');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send your message.');
    } finally {
      setSending(false);
    }
  }

  if (notFound) {
    return (
      <>
        <div className="app-header">
          <a href="#" className="app-header-back" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            ‹
          </a>
          <h3>My concern</h3>
        </div>
        <div className="thread-empty">No concern found for that code.</div>
      </>
    );
  }

  if (!thread) return <div className="center-loading">Loading…</div>;

  const status = STATUS_META[thread.status];

  return (
    <>
      <div className="app-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="#" className="app-header-back" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            ‹
          </a>
          <h3>My concern</h3>
        </div>
        <div className="app-header-meta" style={{ marginTop: 0 }}>
          <span className="tag tag-neutral">{categoryLabel(thread.category)}</span>
          <span className={status.className}>{status.label}</span>
        </div>
      </div>
      <div className="thread">
        <div className="msg-row is-theirs">
          <div className="msg-bubble is-theirs">{thread.message}</div>
        </div>
        {thread.replies.map((m, i) => {
          const mine = m.sender === 'student';
          return (
            <div key={i} className={`msg-row ${mine ? 'is-mine' : 'is-theirs'}`}>
              <div className={`msg-bubble ${mine ? 'is-mine' : 'is-theirs'}`}>{m.message}</div>
            </div>
          );
        })}
      </div>
      {error && <p className="error-text" style={{ padding: '0 16px' }}>{error}</p>}
      <div className="composer">
        <textarea
          className="input"
          rows={1}
          placeholder="Send a follow-up…"
          value={followUp}
          onChange={(e) => setFollowUp(e.target.value)}
        />
        <button className="btn btn-primary" disabled={!followUp.trim() || sending} onClick={handleSend}>
          {sending ? 'Sending…' : 'Send'}
        </button>
      </div>
    </>
  );
}
