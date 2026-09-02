import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, type CategoryId } from '../../lib/categories';
import { submitConcern } from '../../lib/api';

export default function Submit() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = category !== null && text.trim().length > 0 && !submitting;

  async function handleSubmit() {
    if (!category || !text.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const code = await submitConcern(category, text.trim());
      navigate('/submitted', { state: { code }, replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="app-header">
        <a href="#" className="app-header-back" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          ‹
        </a>
        <h3>New concern</h3>
      </div>
      <div className="app-body">
        <div>
          <label style={{ display: 'block', fontSize: 14, marginBottom: 8 }} className="text-muted">
            What's this about?
          </label>
          <div className="chip-row">
            {CATEGORIES.map((c) => (
              <div
                key={c.id}
                className={`chip${category === c.id ? ' is-selected' : ''}`}
                onClick={() => setCategory(c.id)}
              >
                {c.label}
              </div>
            ))}
          </div>
        </div>
        <div className="crisis-notice">
          <span className="crisis-notice-title">If you're in immediate danger or crisis, please don't wait for a reply here.</span>
          Call <a href="tel:999">999</a> (or <a href="tel:112">112</a> from a mobile) if there's
          immediate risk to life. For urgent support any time, day or night, contact the
          University's Student Hub: <a href="tel:02380599599">02380 599 599</a> or{' '}
          <a href="mailto:studenthub@soton.ac.uk">studenthub@soton.ac.uk</a>. Campus security:{' '}
          <a href="tel:02380593311">02380 593311</a>.
          <span className="crisis-notice-footnote">
            Afiya is not monitored in real time, and replies may take time.
          </span>
        </div>
        <div className="field">
          <label>Tell us what's going on</label>
          <textarea
            className="input"
            rows={7}
            placeholder="Write as much or as little as you like. Nothing here is linked to your name."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <p className="text-muted" style={{ fontSize: 13, margin: '8px 0 0' }}>
            The system never links this to you — but if you'd rather stay fully anonymous, avoid
            including your name or other identifying details in the message itself.
          </p>
        </div>
        {error && <p className="error-text">{error}</p>}
      </div>
      <div className="app-footer">
        <button className="btn btn-primary btn-block" disabled={!canSubmit} onClick={handleSubmit}>
          {submitting ? 'Submitting…' : 'Submit privately'}
        </button>
      </div>
    </>
  );
}
